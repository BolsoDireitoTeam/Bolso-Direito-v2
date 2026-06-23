# Bolso Direito

Aplicação web de controle financeiro pessoal. Permite registrar ganhos e gastos, acompanhar o saldo, gerenciar faturas de cartão de crédito, definir metas de economia e simular investimentos.

## Funcionalidades

- Registro de ganhos e gastos (débito e crédito) com categorização
- Controle de faturas de cartão com parcelamento
- Transações recorrentes (ganhos e gastos mensais)
- Dashboard com visão geral do mês e gráficos
- Relatório anual de receitas e despesas
- Metas financeiras com acompanhamento de progresso (PRO)
- Carteira de investimentos com simulação de rendimento (PRO)
- Importação de extratos e faturas
- Virada automática de mês

## Tecnologias

**Frontend:** React 19, Vite, Redux Toolkit, React Router, Chart.js, Bootstrap Icons

**Backend:** Node.js, Express 5, armazenamento em memória (sem banco de dados externo)

## Como rodar

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor inicia na porta `5000`.

### Frontend

Em outro terminal, na raiz do projeto:

```bash
npm install
npm run dev
```

O frontend inicia na porta `5173` e se comunica com o backend via `http://localhost:5000/api`.

> O backend usa armazenamento em memória. Os dados são perdidos ao reiniciar o servidor.

## Estrutura

```
├── backend/
│   └── src/
│       ├── controllers/    # Lógica das rotas
│       ├── models/         # Modelos in-memory (simulam MongoDB)
│       ├── routes/         # Definição das rotas da API
│       └── middlewares/    # Tratamento de erros
├── src/
│   ├── components/         # Componentes reutilizáveis (UI, layout, charts)
│   ├── pages/              # Telas da aplicação
│   ├── store/              # Redux (slices e configuração)
│   ├── services/           # Clientes HTTP (api.js, BolsoDB.js, MetaDB.js)
│   ├── hooks/              # Hooks customizados
│   ├── styles/             # CSS
│   ├── utils/              # Funções utilitárias (formatação, datas)
│   └── validation/         # Schemas de validação (Yup)
└── package.json
```
