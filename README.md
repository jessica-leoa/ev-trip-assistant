# 📘 Documentação do Sistema: EV Trip Assistant

## 1. Visão Geral da Solução
O **EV Trip Assistant** é uma API RESTful desenvolvida em **Node.js** com **TypeScript**, focada em auxiliar proprietários de Veículos Elétricos (VEs). A solução atua como um orquestrador que integra serviços de geolocalização, inteligência artificial e dados de carregamento para fornecer planejamento de rotas, estimativas de custo e assistência técnica virtual.

A aplicação foi desenhada seguindo os princípios de **Clean Architecture** (Arquitetura Limpa) e **Modularidade**, facilitando a escalabilidade e manutenção.

---

## 2. User Stories (Histórias de Usuário)
Estas histórias definem os requisitos funcionais e servem de base para Diagramas de Caso de Uso.

| ID | Ator | História | Critério de Aceite |
|---|---|---|---|
| **US01** | Motorista de VE | **Como** motorista, **quero** localizar pontos de recarga próximos ou no destino, **para** garantir que não ficarei sem bateria. | O sistema deve retornar uma lista de postos com endereço e status baseada na geolocalização. |
| **US02** | Viajante | **Como** viajante, **quero** informar origem e destino, **para** saber a distância, tempo e quantas paradas de recarga precisarei fazer. | O sistema deve calcular a rota, considerar a autonomia do carro e sugerir o número de paradas. |
| **US03** | Proprietário | **Como** proprietário, **quero** visualizar um dashboard de eficiência, **para** entender meus custos e consumo energético. | O sistema deve exibir gráficos de consumo simulado e custo estimado da viagem em R$. |
| **US04** | Usuário | **Como** usuário, **quero** tirar dúvidas técnicas com uma IA especializada, **para** obter respostas rápidas sobre manutenção e uso do VE. | O chatbot deve usar IA (Gemini) para responder em linguagem natural e sugerir próximas ações. |

---

## 3. Arquitetura do Sistema

### 3.1. Estilo Arquitetural
O sistema utiliza uma **Arquitetura em Camadas (Layered Architecture)** organizada por **Módulos de Domínio**.

*   **Presentation Layer (Controllers):** Recebe as requisições HTTP e valida a entrada.
*   **Business Layer (Services):** Contém a lógica de negócios e orquestração.
*   **Integration Layer (External APIs):** Comunicação com serviços terceiros (OpenChargeMap, OSRM, Google Gemini).
*   **Shared Kernel (Types/DTOs):** Definições de tipos compartilhados entre as camadas.

### 3.2. Estrutura de Pastas (Tree)
```text
src
├── config          # Configurações globais (Env vars, Axios instances)
├── modules         # Separação por Domínio
│   ├── charging    # Integração com OpenChargeMap
│   ├── trip        # Integração com OpenStreetMap/OSRM
│   ├── efficiency  # Lógica de simulação de telemetria
│   └── chatbot     # Integração com Google Gemini AI
├── app.ts          # Configuração do Express (Middlewares)
└── server.ts       # Entry point do servidor
```

### 3.3. Diagrama de Fluxo de Dados (Sugestão para Diagramas)
Para criar diagramas de sequência, considere o fluxo padrão:
1.  **Client** envia Request (JSON).
2.  **Router** direciona para o Controller específico.
3.  **Controller** converte Request em DTO e chama o Service.
4.  **Service** processa regras e chama API Externa (se necessário).
5.  **Service** formata os dados brutos da API Externa para o modelo do domínio.
6.  **Controller** devolve Response padronizado (JSON).

---

## 4. Stack Tecnológico

*   **Runtime:** Node.js (LTS)
*   **Linguagem:** TypeScript
*   **Framework Web:** Express.js
*   **AI Engine:** Google Gemini (Generative AI SDK)
*   **Maps & Routing:** OpenStreetMap (Nominatim) & OSRM
*   **Charging Data:** OpenChargeMap API
*   **Utilitários:** Axios (HTTP Client), Dotenv, Cors, Nodemon.

---

## 5. Documentação das Rotas (API Endpoints)

### 🔌 Módulo: Charging (Pontos de Recarga)
**GET** `/api/charging/stations`
*   **Descrição:** Busca estações de recarga próximas a uma coordenada.
*   **Query Params:**
    *   `lat` (number): Latitude.
    *   `lon` (number): Longitude.
    *   `range` (number, opcional): Raio de busca em KM.
*   **Exemplo de Resposta:**
    ```json
    { "success": true, "data": [{ "name": "Posto Shell Recharge", "address": {...} }] }
    ```

### 🗺️ Módulo: Trip (Planejamento)
**POST** `/api/trip/plan`
*   **Descrição:** Calcula rota, distância e paradas necessárias.
*   **Body:**
    ```json
    { "origin": "São Paulo, SP", "destination": "Rio de Janeiro, RJ", "autonomy": 400 }
    ```
*   **Exemplo de Resposta:**
    ```json
    { "success": true, "data": { "distanceTotal": 430, "requiredStops": 1, "routeGeometry": "..." } }
    ```

### ⚡ Módulo: Efficiency (Dashboard)
**GET** `/api/efficiency/dashboard`
*   **Descrição:** Retorna métricas simuladas de consumo e custo.
*   **Query Params:** `dist` (distância), `bat` (% bateria).
*   **Exemplo de Resposta:**
    ```json
    { "success": true, "data": { "estimatedCost": 45.90, "consumptionGraph": [...] } }
    ```

### 🤖 Módulo: Chatbot (AI Assistant)
**POST** `/api/chatbot`
*   **Descrição:** Envia pergunta para o Gemini AI e retorna resposta estruturada.
*   **Body:**
    ```json
    { "message": "Qual a melhor forma de economizar bateria na estrada?" }
    ```
*   **Exemplo de Resposta:**
    ```json
    { "success": true, "data": { "response": "Mantenha velocidade constante...", "suggestedActions": ["Ver Dicas", "Calcular Rota"] } }
    ```

---