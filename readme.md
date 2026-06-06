# ✈️ AeroCode — Sistema de Gestão da Produção Aeronáutica

Sistema web completo para gerenciamento da produção aeronáutica, desenvolvido com React, Node.js, TypeScript, MySQL e Prisma ORM.

Projeto desenvolvido como parte da Atividade de Avaliação Individual 3 (AV3) da disciplina de Programação Orientada a Objetos.



## 📋 Sobre o Projeto

O AeroCode é uma aplicação web para gerenciamento da produção de aeronaves, permitindo o controle de aeronaves, peças, testes, etapas de produção, funcionários e relatórios operacionais.

A aplicação representa a evolução do projeto desenvolvido nas avaliações anteriores:

- **AV1:** Sistema CLI em TypeScript
- **AV2:** Interface gráfica SPA em React
- **AV3:** Aplicação Web completa com banco de dados, API REST e autenticação

O sistema foi projetado considerando os requisitos de um ambiente crítico de produção aeronáutica, buscando escalabilidade, confiabilidade e facilidade de manutenção.



## 🏗️ Arquitetura

### Front-end

- React 18
- Context API
- CSS
- Lucide React

### Back-end

- Node.js
- Express
- TypeScript
- JWT Authentication

### Banco de Dados

- MySQL

### ORM

- Prisma ORM



## 🚀 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| React | Interface do usuário |
| TypeScript | Desenvolvimento tipado |
| Node.js | Ambiente de execução |
| Express | API REST |
| Prisma ORM | Persistência de dados |
| MySQL | Banco de dados |
| JWT | Autenticação |
| CSS | Estilização |
| Lucide React | Ícones |



## 📂 Estrutura do Projeto

```text
AV3-main/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```



## 🔐 Funcionalidades

### Login e Controle de Acesso

- Autenticação com JWT
- Controle de permissões por perfil
- Proteção de rotas

### Dashboard

- Indicadores gerais da produção
- Estatísticas operacionais
- Resumo de status das aeronaves

### Aeronaves

- Cadastro
- Consulta
- Atualização
- Exclusão

### Peças

- Controle de componentes
- Gestão de fornecedores
- Controle de status

### Testes

- Registro de testes
- Aprovação e reprovação
- Histórico de resultados

### Etapas de Produção

- Planejamento
- Acompanhamento
- Controle de progresso

### Funcionários

- Gestão de usuários
- Controle de cargos
- Controle de permissões

### Relatórios

- Relatórios operacionais
- Filtros personalizados

### Métricas de Qualidade

- Latência
- Tempo de Processamento
- Tempo de Resposta



## ⚙️ Instalação

### Pré-requisitos

- Node.js 18+
- MySQL 8+
- npm



### Backend

```bash
cd backend

npm install
```

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure a conexão com o MySQL:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"
JWT_SECRET_KEY=sua_chave_secreta
```

Execute as migrations:

```bash
npx prisma migrate deploy
```

Popule o banco:

```bash
npx prisma db seed
```

Inicie o servidor:

```bash
npm run dev
```

Servidor disponível em:

```text
http://localhost:3001
```


### Frontend

```bash
cd frontend

npm install
npm start
```

Aplicação disponível em:

```text
http://localhost:3000
```


## 📊 Métricas de Qualidade

O sistema possui monitoramento de métricas de desempenho para avaliação da qualidade da aplicação.

As medições foram realizadas considerando:

- 1 usuário simultâneo
- 5 usuários simultâneos
- 10 usuários simultâneos

Métricas avaliadas:

- Latência
- Tempo de Processamento
- Tempo de Resposta

Todos os resultados são apresentados em milissegundos (ms).


## 🖥️ Compatibilidade

- Windows 10 ou superior
- Ubuntu 24.04 ou superior
- Distribuições Linux derivadas do Ubuntu


## 👨‍💻 Autor

**Gustavo Garcia Gomes**

Curso de Análise e Desenvolvimento de Sistemas

Disciplina: Programação Orientada a Objetos

Professor: Eng. Dr. Gerson Penha

Instituição: FATEC São José dos Campos - Prof. Jessen Vidal