package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type OpenMeteoInput struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Current   struct {
		Temp      float64 `json:"temperature_2m"`
		Humidity  float64 `json:"relative_humidity_2m"`
		WindSpeed float64 `json:"wind_speed_10m"`
		Code      int     `json:"weather_code"`
	} `json:"current"`
	Hourly struct {
		Time          []string  `json:"time"`
		Precipitation []float64 `json:"precipitation_probability"`
	} `json:"hourly"`
	CollectedAt string `json:"collected_at"`
}

type NestPayload struct {
	Latitude    float64     `json:"latitude"`
	Longitude   float64     `json:"longitude"`
	Temperature float64     `json:"temperature"`
	Humidity    float64     `json:"humidity"`
	WindSpeed   float64     `json:"windSpeed"`
	PrecipitationProb int   `json:"precipitationProb"`
	Condition   int         `json:"condition"`
	ConditionString string  `json:"conditionString"`
	CollectedAt string      `json:"collectedAt"`
	FullData    interface{} `json:"fullData"`
}

func main() {
	rabbitURL := getEnv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
	apiUrl := getEnv("API_URL", "http://nest-backend:3000/api/weather/logs")

	var conn *amqp.Connection
	var err error

	for {
		conn, err = amqp.Dial(rabbitURL)
		if err == nil {
			log.Println("Go Worker conectado ao RabbitMQ!")
			break
		}
		log.Printf("Falha ao conectar no RabbitMQ (%s). Tentando em 5s...", err)
		time.Sleep(5 * time.Second)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather_queue",
		true,            
		false,           
		false,           
		false,           
		nil,             
	)
	failOnError(err, "Falha ao declarar fila")

	msgs, err := ch.Consume(
		q.Name, 
		"",     
		false,  
		false,  
		false,  
		false,  
		nil,    
	)
	failOnError(err, "Falha ao registrar consumidor")

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			log.Println("📥 Mensagem recebida! Processando...")

			var input OpenMeteoInput
			err := json.Unmarshal(d.Body, &input)
			if err != nil {
				log.Printf("❌ Erro ao ler JSON: %s", err)
				d.Nack(false, false)
				continue
			}

			var rawJSON interface{}
			json.Unmarshal(d.Body, &rawJSON)
			currentProb := 0
			now := time.Now().Format("2006-01-02T15:00")
			for i, t := range input.Hourly.Time {
				if len(t) >= 13 && t[:13] == now[:13] {
					if i < len(input.Hourly.Precipitation) {
						currentProb = int(input.Hourly.Precipitation[i])
					}
					break
				}
			}
			description := getWeatherDescription(input.Current.Code)

			payload := NestPayload{
				Latitude:    input.Latitude,
				Longitude:   input.Longitude,
				Temperature: input.Current.Temp,
				Humidity:    input.Current.Humidity,
				WindSpeed:   input.Current.WindSpeed,
				PrecipitationProb: currentProb,
				Condition:   input.Current.Code,
				ConditionString: description,
				CollectedAt: input.CollectedAt,
				FullData:    rawJSON,
			}

			err = sendToApi(apiUrl, payload)
			if err != nil {
				log.Printf("Erro ao enviar para API: %s", err)
				d.Ack(false) 
				continue
			}

			log.Println("Sucesso! Dados salvos no NestJS.")
			d.Ack(false)
		}
	}()

	log.Println(" [*] Worker rodando. Aguardando mensagens...")
	<-forever
}

func sendToApi(url string, data NestPayload) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API retornou status: %d - Erro: %s", resp.StatusCode, string(bodyBytes))
	}

	return nil
}

func getWeatherDescription(code int) string {
	switch code {
	case 0:
		return "Céu limpo"
	case 1:
		return "Predominantemente limpo"
	case 2:
		return "Parcialmente nublado"
	case 3:
		return "Encoberto"
	case 45:
		return "Nevoeiro"
	case 48:
		return "Nevoeiro com geada"
	case 51:
		return "Garoa leve"
	case 53:
		return "Garoa moderada"
	case 55:
		return "Garoa densa"
	case 56:
		return "Garoa congelante leve"
	case 57:
		return "Garoa congelante densa"
	case 61:
		return "Chuva leve"
	case 63:
		return "Chuva moderada"
	case 65:
		return "Chuva forte"
	case 66:
		return "Chuva congelante leve"
	case 67:
		return "Chuva congelante forte"
	case 71:
		return "Neve leve"
	case 73:
		return "Neve moderada"
	case 75:
		return "Neve forte"
	case 77:
		return "Granizo"
	case 80:
		return "Pancadas de chuva leves"
	case 81:
		return "Pancadas de chuva moderadas"
	case 82:
		return "Pancadas de chuva violentas"
	case 85:
		return "Pancadas de neve leves"
	case 86:
		return "Pancadas de neve fortes"
	case 95:
		return "Tempestade" 
	case 96:
		return "Tempestade com granizo leve"
	case 99:
		return "Tempestade com granizo forte"
	default:
		return "Desconhecido"
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
