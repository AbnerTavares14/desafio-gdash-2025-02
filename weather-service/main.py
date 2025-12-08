import asyncio
import os
import json
import logging
import httpx
import aio_pika
from datetime import datetime
from dotenv import load_dotenv

logging.basicConfig(
	level=logging.INFO,
	format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("WeatherCollector")

load_dotenv()

RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'guest')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'guest')
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', 5672))
QUEUE_NAME = "weather_queue"

LATITUDE = os.getenv('LATITUDE', '-15.8973')
LONGITUDE = os.getenv('LONGITUDE', '-52.2301')
COLLECTION_INTERVAL = int(os.getenv('COLLECTION_INTERVAL', 600))

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
API_PARAMS = {
	"latitude": float(LATITUDE),
	"longitude": float(LONGITUDE),
	"current": "temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m",
	"hourly": "temperature_2m,shortwave_radiation,cloud_cover,precipitation_probability",
	"daily": "sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours",
	"timezone": "auto"
}

class WeatherService:
	def __init__(self):
		self.connection = None
		self.channel = None

	async def connect_rabbitmq(self):
		"""Lógica de conexão com retry infinito até o RabbitMQ subir"""
		while True:
			try:
				self.connection = await aio_pika.connect_robust(
					host=RABBITMQ_HOST,
					port=RABBITMQ_PORT,
					login=RABBITMQ_USER,
					password=RABBITMQ_PASS
				)
				self.channel = await self.connection.channel()
				
				await self.channel.declare_queue(QUEUE_NAME, durable=True)
				
				logger.info("Conectado ao RabbitMQ com sucesso!")
				return
			except Exception as e:
				logger.warning(f"Falha ao conectar no RabbitMQ. Tentando em 5s... Erro: {e}")
				await asyncio.sleep(5)

	async def fetch_weather_data(self):
		"""Busca dados na API com Timeout seguro"""
		async with httpx.AsyncClient(timeout=10.0) as client:
			try:
				response = await client.get(OPEN_METEO_URL, params=API_PARAMS)
				response.raise_for_status()
				return response.json()
			except httpx.HTTPError as e:
				logger.error(f"Erro HTTP ao buscar clima: {e}")
				return None
			except Exception as e:
				logger.error(f"Erro inesperado na API: {e}")
				return None

	async def publish_message(self, data):
		"""Publica mensagem garantindo que a conexão está ativa"""
		if not self.connection or self.connection.is_closed:
			logger.warning("Conexão perdida. Reconectando...")
			await self.connect_rabbitmq()

		try:
			data['collected_at'] = datetime.now().isoformat()
			
			message_body = json.dumps(data).encode()
			
			await self.channel.default_exchange.publish(
				aio_pika.Message(
					body=message_body,
					delivery_mode=aio_pika.DeliveryMode.PERSISTENT
				),
				routing_key=QUEUE_NAME
			)
			logger.info(f"Dados enviados para fila '{QUEUE_NAME}'")
		except Exception as e:
			logger.error(f"Falha ao publicar mensagem: {e}")

	async def start(self):
		"""Loop principal"""
		await self.connect_rabbitmq()
		
		while True:
			logger.info(f"🔄 Iniciando ciclo de coleta para Lat: {LATITUDE}, Lon: {LONGITUDE}")
			weather_data = await self.fetch_weather_data()
			
			if weather_data:
				await self.publish_message(weather_data)

			logger.info(f"💤 Dormindo por {COLLECTION_INTERVAL} segundos...")
			await asyncio.sleep(COLLECTION_INTERVAL)

if __name__ == "__main__":
	service = WeatherService()
	try:
		asyncio.run(service.start())
	except KeyboardInterrupt:
		logger.info("Serviço interrompido pelo usuário.")