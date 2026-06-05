# ✈️ AeroCode — Sistema de Gestão da Produção Aeronáutica

Sistema web desenvolvido como SPA (Single Page Application) em React para gerenciamento da produção de aeronaves. Desenvolvido como parte da Atividade de Avaliação Individual 2 (AV2) da disciplina de Programação Orientada a Objetos.

---

## 📋 Sobre o Projeto

O AeroCode é um protótipo navegável de interface gráfica (GUI) para o sistema de gestão da produção de aeronaves da **Aerocode**, substituindo a interface de linha de comando (CLI) existente. O objetivo é oferecer uma experiência visual intuitiva para engenheiros de produção e engenheiros aeronáuticos que atuam na gestão e acompanhamento da fabricação de aeronaves.

O sistema é desenvolvido exclusivamente como **front-end** (sem back-end), utilizando dados mockados, e pode ser executado localmente em servidores Windows 10+ e Linux Ubuntu 24.04+.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 18.2.0 | Framework principal (SPA) |
| react-scripts | 5.0.1 | Build e servidor de desenvolvimento |
| lucide-react | 0.383.0 | Ícones da interface |
| CSS puro | — | Estilização customizada |

---

## 🎨 Protótipo no figma

[Acesse aqui os 2 protótipos (Alta fidelidade e baixa fidelidade)](https://www.figma.com/design/fDcv3rT83pvovyxVrcbGP0/AV2---POO?node-id=0-1&p=f&t=66wKfX2LUmknQu5M-0)

---

## ⚙️ Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v16 ou superior
- npm (incluído com o Node.js)

### Instalação e execução

```bash
# Clone ou extraia o projeto
cd AV2-POO

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

O app abrirá automaticamente em `http://localhost:3000`.

---

## 🔐 Credenciais de Acesso

O sistema possui três perfis de usuário para teste:

| Perfil | E-mail | Senha | Permissões |
|---|---|---|---|
| Administrador | admin@aerotech.com | 1234 | Acesso total, incluindo gestão de funcionários |
| Engenheiro | engenheiro@aerotech.com | 1234 | Dashboard, aeronaves, etapas e relatórios |
| Operador | operador@aerotech.com | 1234 | Dashboard, aeronaves, etapas e relatórios |

---

## 🗺️ Funcionalidades

### Dashboard
Visão consolidada com cards de estatísticas (total de aeronaves, em produção, concluídas, peças cadastradas), tabela de aeronaves recentes e resumo de situação geral (testes reprovados, aguardando, funcionários ativos).

### Aeronaves
Listagem completa com busca por texto e filtro por status. Permite cadastrar, editar e excluir aeronaves. Cada aeronave possui modelo, matrícula, fabricante, ano, status, progresso e responsável.

### Detalhe da Aeronave
Acesso às três sub-seções de cada aeronave por abas:
- **Peças** — cadastro de componentes com código, quantidade, fornecedor e status
- **Testes** — registro de testes com tipo, resultado, data e observações
- **Etapas** — linha do tempo de produção com ordem, status e datas

### Etapas de Produção
Visão global de todas as etapas de todas as aeronaves, com filtro por status e link rápido para o detalhe de cada aeronave.

### Funcionários *(somente admin)*
Gerenciamento completo de funcionários com cargo, departamento e status (ativo/inativo).

### Relatórios
Geração de relatório configurável com filtros por aeronave e status. Permite incluir ou excluir seções de peças, testes e etapas.

---

## 📄 Contexto Acadêmico

Projeto desenvolvido para a disciplina ministrada pelo **Prof. Eng. Dr. Gerson Penha**, como parte da AV2 que propõe a migração do sistema CLI da Aerocode para uma GUI web moderna no formato SPA, utilizando React como framework principal.

**Requisitos atendidos:**
- SPA desenvolvida em React
- Protótipo navegável sem back-end
- Dados mockados em memória
- Controle de acesso por perfil de usuário
- Compatível com Windows 10+ e Linux Ubuntu 24.04+