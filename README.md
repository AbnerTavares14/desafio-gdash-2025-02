# Desafio GDASH 2025/02 - Monitoramento Climático Distribuído

Este projeto implementa uma arquitetura de microserviços para coleta, processamento e visualização de dados climáticos em tempo real, utilizando processamento assíncrono e Inteligência Artificial para geração de insights.

## 🚀 Tecnologias Utilizadas

* **Frontend:** React, Vite, TailwindCSS, shadcn/ui.
* **Backend:** NestJS (TypeScript), Prisma ORM.
* **Worker:** Go (Golang) para processamento de alta performance.
* **Coletor:** Python (AsyncIO) para ingestão de dados.
* **Banco de Dados:** MongoDB (Replica Set).
* **Mensageria:** RabbitMQ.
* **IA:** Google Gemini (Generative AI).
* **Infraestrutura:** Docker & Docker Compose.

## ⚙️ Arquitetura

1.  **Coletor (Python):** Busca dados da Open-Meteo a cada 10 minutos e publica na fila `weather_queue` do RabbitMQ.
2.  **Worker (Go):** Consome a fila, enriquece os dados (tradução WMO, cálculo de probabilidades) e envia para a API.
3.  **API (NestJS):** Recebe os dados, persiste no MongoDB e serve o Frontend. Também integra com o Google Gemini para gerar análises climáticas.
4.  **Frontend (React):** Dashboard interativo com dados em tempo real, gráficos de previsão e exportação de relatórios.

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
* Docker e Docker Compose instalados.
* Uma chave de API do Google Gemini (definida no `.env`).

### Passo a Passo

1.  Clone o repositório e acesse a pasta:
    ```bash
    git clone <seu-repo>
    cd desafio-gdash-2025-02
    ```

2.  Configure as variáveis de ambiente:
    ```bash
    cp backend/.env.example backend/.env
    # Edite o backend/.env e adicione sua GEMINI_API_KEY
    ```

3.  Suba os containers:
    ```bash
    docker-compose up -d --build
    ```
    *Aguarde alguns instantes para que o MongoDB inicialize o Replica Set e o Seed de usuário seja executado.*

## 🔑 Acesso ao Sistema

Após os containers subirem, acesse:

* **Frontend (Dashboard):** [http://localhost:5173](http://localhost:5173)
* **API (Backend):** [http://localhost:3000/api](http://localhost:3000/api)
* **RabbitMQ Management:** [http://localhost:15672](http://localhost:15672) (User: `guest` / Pass: `guest`)

### Usuário Padrão (Seed)
Para acessar o Dashboard, utilize as credenciais geradas automaticamente:
* **Email:** `admin@example.com`
* **Senha:** `12345678`

## 🧪 Funcionalidades Implementadas

- [x] Pipeline completo (Python -> RabbitMQ -> Go -> NestJS -> Mongo).
- [x] Dashboard com Shadcn/UI e visualização de previsão horária.
- [x] Login e Autenticação JWT.
- [x] Seed automático de banco de dados.
- [x] Integração com IA (Google Gemini) para insights climáticos.
- [x] Exportação de dados em CSV e Excel.
- [x] Dockerização completa com hot-reload.

---