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

## 6. Fluxo de Informações do Sistema (Data Flow)

Esta seção descreve como os dados trafegam desde o clique do usuário no Front-end até o processamento no Back-end e o retorno da resposta. Este fluxo segue o padrão **MVC/Clean Architecture**.

### 🔄 Fluxo Genérico (Padrão para todas as rotas)
1.  **Interação do Usuário:** O usuário preenche um formulário ou clica em um botão na interface (Front-end).
2.  **Requisição HTTP:** O Front-end envia um pacote de dados (JSON) via `GET` ou `POST` para a API.
3.  **Roteamento (Router):** O arquivo de rotas intercepta a URL e direciona para o Controller responsável.
4.  **Controlador (Controller):**
    *   Recebe o `Request`.
    *   Valida se os dados obrigatórios estão presentes.
    *   Aciona o Serviço (`Service`).
5.  **Serviço (Service):**
    *   Contém a "inteligência" e regras de negócio.
    *   Faz chamadas para APIs externas (Google, OpenStreet, etc.).
    *   Processa e formata os dados brutos.
6.  **Resposta (Response):** O Controller recebe os dados processados do Service e devolve um JSON padronizado para o Front-end.

---

### 📍 Fluxo Específico: Planejamento de Viagem (Módulo Trip)
*Cenário: Usuário digita "São Paulo" e "Rio de Janeiro" e clica em "Calcular Rota".*

1.  **Entrada:** `POST /api/trip/plan` com body `{ origin: "SP", destination: "RJ", autonomy: 300 }`.
2.  **Service - Passo A (Geocoding):**
    *   O sistema chama a API **Nominatim (OpenStreetMap)** para "São Paulo".
    *   *Retorno:* Latitude -23.55, Longitude -46.63.
    *   Repete o processo para "Rio de Janeiro".
3.  **Service - Passo B (Routing):**
    *   O sistema envia as duas coordenadas para a API **OSRM**.
    *   *Retorno:* Distância (430km), Tempo (5h) e Geometria da rota.
4.  **Service - Passo C (Cálculo Interno):**
    *   Aplica a regra: `Distância / Autonomia` = 430 / 300 = 1.43.
    *   *Conclusão:* Necessário **1 parada** de recarga.
5.  **Saída:** Retorna JSON com coordenadas, distância exata e paradas sugeridas.

---

### 🤖 Fluxo Específico: Chatbot Inteligente (Módulo Chatbot)
*Cenário: Usuário pergunta "Como economizar bateria?"*

1.  **Entrada:** `POST /api/chatbot/message` com body `{ message: "..." }`.
2.  **Service:**
    *   Constrói um **Prompt de Engenharia** (instruindo a IA a agir como especialista em VEs).
    *   Envia o prompt + mensagem do usuário para a API **Google Gemini**.
3.  **Processamento Externo (IA):** O Google Gemini processa a linguagem natural.
4.  **Service:** Recebe o texto, faz o tratamento para JSON e adiciona sugestões de ação.
5.  **Saída:** Retorna a resposta textual e uma lista de botões sugeridos (ex: "Ver Dicas").

---
---

## 7. Ferramentas Utilizadas

- 🤖 **ChatGPT 5.2** – Apoio no desenvolvimento, ideação e geração de conteúdo
- 🧠 **DeepSeek v3.2** – Suporte à análise e geração de código
- 🧪 **IA Studio** – Ambiente para experimentação e prototipação com IA
- 🎨 **Lovable** – Geração e design inicial da interface da aplicação
- 🌐 **Gemini 3 Pro Preview** – Uso de IA generativa para suporte e testes
- 🔌 **Open Charge Map API** – Consulta de estações de recarga para veículos elétricos
- 🗂️ **GitHub** – Versionamento e gerenciamento do código-fonte
- 🔑 **API Key (Gemini)** – Autenticação para acesso aos serviços de IA
- ☁️ **Render** – Deploy e hospedagem do backend da aplicação

## 8. Documentação da Cadeia Lógica de Prompts (Logbook)

Este documento registra a evolução do projeto através da interação com a IA generativa. Ele demonstra como os requisitos foram traduzidos em código e como problemas técnicos foram solucionados incrementalmente.

| Etapa | Intenção do Prompt (O que foi pedido) | Lógica de Construção & Decisões Tomadas | Resultado Alcançado |
| :--- | :--- | :--- | :--- |
| **1. Fundação** | **Definição de Arquitetura:** Solicitação de um back-end modular baseado em um front-end existente (Lovable), seguindo uma estrutura de pastas específica (Clean Architecture). | A IA analisou a árvore de arquivos de referência e propôs uma estrutura separada por domínios (`modules/charging`, `modules/trip`, etc.) para garantir escalabilidade e organização, configurando o ambiente TypeScript inicial. | Estrutura de pastas criada e servidor Express configurado. |
| **2. Integração** | **Módulo de Carregamento:** Implementação da busca de postos de recarga usando uma API Key fornecida (OpenChargeMap). | Foco na separação de responsabilidades (SoC). Criação de DTOs (Types) para tipar a resposta externa e isolamento da chamada de API no `Service`, deixando o `Controller` limpo. | Rota `/charging/stations` funcional retornando dados reais. |
| **3. Debugging** | **Correção de Ambiente:** Solução para erros de execução (`missing script` e erros de compilação TS). | Identificação de conflito entre configurações estritas do TypeScript (`verbatimModuleSyntax`) e o ambiente Node.js comum. Ajuste do `tsconfig.json` e `package.json`. | Ambiente de desenvolvimento (`npm run dev`) estável e rodando. |
| **4. Padronização** | **Convenção de Nomes:** Ajuste na nomenclatura dos arquivos (de `ponto.nome.ts` para `CamelCase.ts`). | O usuário solicitou mudança no padrão de nomes. A IA reescreveu os imports e nomes de arquivos para manter a consistência do projeto sem quebrar as referências cruzadas. | Código refatorado seguindo preferência de estilo do desenvolvedor. |
| **5. Core Business** | **Planejamento de Viagem:** Implementação da lógica de conversão de endereços e cálculo de rotas. | Decisão de usar APIs gratuitas (Nominatim/OSRM) para viabilizar o projeto sem custos extras. Implementação de algoritmo matemático simples para calcular paradas necessárias (Distância / Autonomia). | Rota `/trip/plan` capaz de traçar rotas entre cidades reais. |
| **6. Simulação** | **Dashboard de Eficiência:** Criação de dados para alimentar gráficos do front-end. | Como não há carro físico conectado, a estratégia foi criar um `Service` que gera dados "mockados" (fictícios mas realistas) com variação aleatória para simular consumo de bateria e custo. | Rota `/efficiency/dashboard` pronta para testes de UI. |
| **7. Suporte** | **Correção de Testes:** Ajuda com erro "Connection Refused" no Postman. | Diagnóstico de erro humano no uso da ferramenta de teste (colocar JSON no body de um GET). Orientação passo a passo para correção. | Usuário habilitado a testar rotas corretamente. |
| **8. Inovação** | **IA Generativa:** Substituição do chatbot baseado em regras (If/Else) pela API do Google Gemini. | Upgrade tecnológico. Integração do SDK do Google Generative AI. Criação de um "System Prompt" (Persona) para garantir que a IA responda apenas sobre carros elétricos e retorne JSON estruturado. | Chatbot avançado capaz de responder perguntas complexas em linguagem natural. |
| **9. Entrega** | **Documentação Final:** Solicitação de documentação técnica, user stories e instruções de instalação. | Compilação de todo o conhecimento gerado em um formato de entrega acadêmica/profissional, facilitando a avaliação e futura manutenção. | Manual completo do sistema (README). |

---

### Resumo da Metodologia Adotada
O projeto foi desenvolvido utilizando uma abordagem **Iterativa e Incremental**:
1.  **Planejamento:** Definição da arquitetura.
2.  **Implementação Modular:** Construção de um módulo por vez (Charging -> Trip -> Efficiency -> Chatbot).
3.  **Refatoração Contínua:** Ajustes de configuração e padrões de código conforme feedback.
4.  **Validação:** Testes manuais de cada rota antes de prosseguir para a próxima.
