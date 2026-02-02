# EV Trip Assistant

Aplicação web para planejamento de viagens em veículos elétricos que integra cálculo de rotas com autonomia da bateria e um chatbot baseado em IA generativa para apoio à tomada de decisão do motorista.

---

## Visão Geral

O EV Trip Assistant é um protótipo de assistente inteligente que ajuda motoristas de veículos elétricos a planejar viagens considerando distância, consumo de energia e necessidade de recarga.  
O sistema combina serviços externos de mapas e estações de carregamento com um modelo de linguagem (LLM) para gerar recomendações e responder perguntas técnicas.

---

## Funcionalidades

- Planejamento de viagem considerando autonomia da bateria  
- Sugestão de paradas para recarga  
- Estimativa de tempo e consumo  
- Chatbot especialista em veículos elétricos  
- Recomendações de uso e preservação da bateria  

---

## Arquitetura

- Frontend: Aplicação web  
- Backend: API de processamento e integração  
- Serviços externos:
  - Google Maps API + HERE Maps (rotas)
  - Open Charge Map (estações de recarga)
  - Gemini API (IA generativa)

Fluxo básico:

Usuário → Interface Web → Backend → APIs externas / IA → Resultados → Interface Web

---

## Tecnologias

- Framework web (ex.: Streamlit ou similar)  
- FastAPI ou equivalente para backend  
- Gemini API (LLM)  
- Google Maps API  
- Open Charge Map API  

---

