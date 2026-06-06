import { PrismaClient, NivelPermissao } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const adminHash = await bcrypt.hash('admin123', 10)
  const hash = await bcrypt.hash('1234', 10)

  // ── Funcionários ──────────────────────────────────────────────────────────
  await prisma.funcionario.upsert({
    where: { id: '0001' },
    update: { usuario: 'admin', senha: adminHash, nivelPermissao: NivelPermissao.ADMINISTRADOR },
    create: { id: '0001', nome: 'Carlos Mendes', telefone: '(11) 99999-0001', endereco: 'Rua das Aeronaves, 1', usuario: 'admin', senha: adminHash, nivelPermissao: NivelPermissao.ADMINISTRADOR },
  })
  await prisma.funcionario.upsert({
    where: { id: '0002' },
    update: { usuario: 'ana', senha: hash, nivelPermissao: NivelPermissao.ENGENHEIRO },
    create: { id: '0002', nome: 'Ana Souza', telefone: '(11) 99999-0002', endereco: 'Rua dos Projetos, 2', usuario: 'ana', senha: hash, nivelPermissao: NivelPermissao.ENGENHEIRO },
  })
  await prisma.funcionario.upsert({
    where: { id: '0003' },
    update: { usuario: 'roberto', senha: hash, nivelPermissao: NivelPermissao.OPERADOR },
    create: { id: '0003', nome: 'Roberto Lima', telefone: '(11) 99999-0003', endereco: 'Rua da Manutenção, 3', usuario: 'roberto', senha: hash, nivelPermissao: NivelPermissao.OPERADOR },
  })

  // ── Aeronaves ─────────────────────────────────────────────────────────────
  const aeronaves = [
    {
      codigo: 'E175-001', modelo: 'Embraer E175', tipo: 'COMERCIAL' as const, capacidade: 80, alcance: 3735,
      pecas: [
        { nome: 'Motor CF34-8E', tipo: 'IMPORTADA' as const, fornecedor: 'GE Aviation', status: 'PRONTA' as const },
        { nome: 'Trem de Pouso Principal', tipo: 'IMPORTADA' as const, fornecedor: 'Safran Landing Systems', status: 'EM_TRANSPORTE' as const },
        { nome: 'Asa Direita', tipo: 'NACIONAL' as const, fornecedor: 'Embraer', status: 'EM_PRODUCAO' as const },
        { nome: 'Computador de Voo FMS', tipo: 'IMPORTADA' as const, fornecedor: 'Honeywell', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'REPROVADO' as const },
      ],
      etapas: [
        { nome: 'Projeto e Design', prazo: '2024-01-30', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação de Componentes', prazo: '2024-04-15', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Montagem da Estrutura', prazo: '2024-06-30', status: 'ANDAMENTO' as const, funcs: ['0001', '0002'] },
        { nome: 'Instalação de Sistemas Elétricos', prazo: '2024-09-10', status: 'PENDENTE' as const, funcs: ['0003'] },
        { nome: 'Testes em Solo', prazo: '2024-11-20', status: 'PENDENTE' as const, funcs: ['0001', '0002', '0003'] },
        { nome: 'Pintura e Acabamento', prazo: '2025-01-15', status: 'PENDENTE' as const, funcs: ['0003'] },
        { nome: 'Inspeção Final', prazo: '2025-02-28', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'E195-002', modelo: 'Embraer E195-E2', tipo: 'COMERCIAL' as const, capacidade: 146, alcance: 4800,
      pecas: [
        { nome: 'Motor PW1900G', tipo: 'IMPORTADA' as const, fornecedor: 'Pratt & Whitney', status: 'PRONTA' as const },
        { nome: 'Winglet Sharklet', tipo: 'NACIONAL' as const, fornecedor: 'Embraer', status: 'PRONTA' as const },
        { nome: 'Sistema FADEC', tipo: 'IMPORTADA' as const, fornecedor: 'BAE Systems', status: 'EM_PRODUCAO' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Projeto Conceitual', prazo: '2023-08-01', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Projeto Detalhado', prazo: '2023-12-20', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação da Fuselagem', prazo: '2024-05-10', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Integração de Motores', prazo: '2024-08-30', status: 'ANDAMENTO' as const, funcs: ['0001', '0003'] },
        { nome: 'Sistemas de Aviónica', prazo: '2024-11-15', status: 'PENDENTE' as const, funcs: ['0002'] },
        { nome: 'Testes de Pressurização', prazo: '2025-01-20', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
      ],
    },
    {
      codigo: 'KC390-003', modelo: 'Embraer KC-390', tipo: 'MILITAR' as const, capacidade: 26000, alcance: 2800,
      pecas: [
        { nome: 'Motor CFM LEAP-1A', tipo: 'IMPORTADA' as const, fornecedor: 'CFM International', status: 'PRONTA' as const },
        { nome: 'Rampa de Carga Traseira', tipo: 'NACIONAL' as const, fornecedor: 'Embraer Defesa', status: 'PRONTA' as const },
        { nome: 'Sistema de Reabastecimento', tipo: 'IMPORTADA' as const, fornecedor: 'Cobham', status: 'EM_TRANSPORTE' as const },
        { nome: 'Radar Meteorológico', tipo: 'IMPORTADA' as const, fornecedor: 'Rockwell Collins', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Requisitos Militares', prazo: '2022-06-01', status: 'CONCLUIDA' as const, funcs: ['0001'] },
        { nome: 'Projeto e Homologação', prazo: '2023-02-28', status: 'CONCLUIDA' as const, funcs: ['0001', '0002'] },
        { nome: 'Fabricação de Estrutura', prazo: '2023-09-15', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação Sistema de Carga', prazo: '2023-12-30', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Integração Sistemas de Defesa', prazo: '2024-04-20', status: 'CONCLUIDA' as const, funcs: ['0001'] },
        { nome: 'Testes Militares Certificados', prazo: '2024-07-01', status: 'ANDAMENTO' as const, funcs: ['0001', '0002'] },
        { nome: 'Entrega à FAB', prazo: '2024-10-30', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'B737-004', modelo: 'Boeing 737 MAX 8', tipo: 'COMERCIAL' as const, capacidade: 178, alcance: 6570,
      pecas: [
        { nome: 'Motor CFM LEAP-1B', tipo: 'IMPORTADA' as const, fornecedor: 'CFM International', status: 'PRONTA' as const },
        { nome: 'Winglet AT', tipo: 'IMPORTADA' as const, fornecedor: 'Aviation Partners Boeing', status: 'PRONTA' as const },
        { nome: 'Fuselagem Seção 41', tipo: 'IMPORTADA' as const, fornecedor: 'Spirit AeroSystems', status: 'EM_PRODUCAO' as const },
        { nome: 'Sistema MCAS', tipo: 'IMPORTADA' as const, fornecedor: 'Boeing', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Recertificação MCAS', prazo: '2023-03-01', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Revisão de Software de Voo', prazo: '2023-07-15', status: 'CONCLUIDA' as const, funcs: ['0001', '0002'] },
        { nome: 'Montagem Fuselagem', prazo: '2023-11-30', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação de Motores', prazo: '2024-02-20', status: 'ANDAMENTO' as const, funcs: ['0002', '0003'] },
        { nome: 'Testes de Voo FAA', prazo: '2024-07-10', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação Final', prazo: '2024-09-30', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'A320-005', modelo: 'Airbus A320neo', tipo: 'COMERCIAL' as const, capacidade: 165, alcance: 6300,
      pecas: [
        { nome: 'Motor CFM LEAP-1A', tipo: 'IMPORTADA' as const, fornecedor: 'CFM International', status: 'PRONTA' as const },
        { nome: 'Sharklet Asa', tipo: 'IMPORTADA' as const, fornecedor: 'Airbus', status: 'PRONTA' as const },
        { nome: 'Sistema Fly-by-Wire', tipo: 'IMPORTADA' as const, fornecedor: 'Thales', status: 'PRONTA' as const },
        { nome: 'Trem de Pouso Nariz', tipo: 'IMPORTADA' as const, fornecedor: 'Liebherr', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'REPROVADO' as const },
      ],
      etapas: [
        { nome: 'Recepção de Componentes', prazo: '2023-05-10', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Montagem da Cabine', prazo: '2023-09-20', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Instalação Fly-by-Wire', prazo: '2024-01-15', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Correção de Falha Aerodinâmica', prazo: '2024-05-30', status: 'ANDAMENTO' as const, funcs: ['0001', '0002'] },
        { nome: 'Novo Teste Aerodinâmico', prazo: '2024-08-20', status: 'PENDENTE' as const, funcs: ['0001', '0002', '0003'] },
        { nome: 'Aprovação ANAC', prazo: '2024-11-01', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'A350-006', modelo: 'Airbus A350-900', tipo: 'COMERCIAL' as const, capacidade: 314, alcance: 15000,
      pecas: [
        { nome: 'Motor Trent XWB-84', tipo: 'IMPORTADA' as const, fornecedor: 'Rolls-Royce', status: 'PRONTA' as const },
        { nome: 'Fuselagem Fibra de Carbono', tipo: 'IMPORTADA' as const, fornecedor: 'Airbus', status: 'PRONTA' as const },
        { nome: 'Sistema de Entretenimento', tipo: 'IMPORTADA' as const, fornecedor: 'Panasonic Avionics', status: 'EM_PRODUCAO' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Design Estrutural CFRP', prazo: '2022-11-01', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação Fuselagem', prazo: '2023-06-15', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Integração de Motores Trent', prazo: '2023-10-30', status: 'CONCLUIDA' as const, funcs: ['0001', '0002'] },
        { nome: 'Cabine Premium e IFE', prazo: '2024-03-20', status: 'ANDAMENTO' as const, funcs: ['0002', '0003'] },
        { nome: 'Testes Long-Haul', prazo: '2024-08-10', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação EASA', prazo: '2024-12-01', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'F39-007', modelo: 'F-39 Gripen E', tipo: 'MILITAR' as const, capacidade: 1, alcance: 3000,
      pecas: [
        { nome: 'Motor GE F414G', tipo: 'IMPORTADA' as const, fornecedor: 'GE Aviation', status: 'PRONTA' as const },
        { nome: 'Radar AESA PS-05/A Mk4', tipo: 'IMPORTADA' as const, fornecedor: 'Leonardo', status: 'PRONTA' as const },
        { nome: 'Cockpit Multifuncional', tipo: 'NACIONAL' as const, fornecedor: 'Atech', status: 'PRONTA' as const },
        { nome: 'Míssil A-Darter', tipo: 'NACIONAL' as const, fornecedor: 'Denel / Mectron', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Adaptações para FAB', prazo: '2022-09-01', status: 'CONCLUIDA' as const, funcs: ['0001'] },
        { nome: 'Integração Radar AESA', prazo: '2023-03-15', status: 'CONCLUIDA' as const, funcs: ['0001', '0002'] },
        { nome: 'Software de Combate Nacional', prazo: '2023-08-20', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Armamento e Integração A-Darter', prazo: '2023-12-10', status: 'CONCLUIDA' as const, funcs: ['0001', '0003'] },
        { nome: 'Testes de Combate Simulado', prazo: '2024-04-01', status: 'ANDAMENTO' as const, funcs: ['0001'] },
        { nome: 'Qualificação Operacional FAB', prazo: '2024-09-15', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
      ],
    },
    {
      codigo: 'B787-008', modelo: 'Boeing 787-9 Dreamliner', tipo: 'COMERCIAL' as const, capacidade: 296, alcance: 14140,
      pecas: [
        { nome: 'Motor GEnx-1B', tipo: 'IMPORTADA' as const, fornecedor: 'GE Aviation', status: 'PRONTA' as const },
        { nome: 'Asa Fibra de Carbono', tipo: 'IMPORTADA' as const, fornecedor: 'Mitsubishi Heavy Industries', status: 'PRONTA' as const },
        { nome: 'Janela Electrocrômica', tipo: 'IMPORTADA' as const, fornecedor: 'PPG Aerospace', status: 'EM_PRODUCAO' as const },
        { nome: 'APU APS5000', tipo: 'IMPORTADA' as const, fornecedor: 'Honeywell', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Fabricação Asa MHI', prazo: '2023-04-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Montagem Fuselagem em Seções', prazo: '2023-08-15', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Instalação Janelas Eletrocrômicas', prazo: '2024-01-20', status: 'ANDAMENTO' as const, funcs: ['0002'] },
        { nome: 'Instalação de Cabine', prazo: '2024-05-10', status: 'PENDENTE' as const, funcs: ['0003'] },
        { nome: 'Testes de Voo Longo Alcance', prazo: '2024-09-30', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Entrega à Companhia Aérea', prazo: '2025-01-15', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'CES-XLS-009', modelo: 'Cessna Citation XLS+', tipo: 'COMERCIAL' as const, capacidade: 9, alcance: 3700,
      pecas: [
        { nome: 'Motor Williams FJ44-4A', tipo: 'IMPORTADA' as const, fornecedor: 'Williams International', status: 'PRONTA' as const },
        { nome: 'Avionics Garmin G5000', tipo: 'IMPORTADA' as const, fornecedor: 'Garmin', status: 'PRONTA' as const },
        { nome: 'Trem de Pouso Retrátil', tipo: 'IMPORTADA' as const, fornecedor: 'Cessna', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Montagem da Estrutura', prazo: '2023-07-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação Garmin G5000', prazo: '2023-10-15', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Aguardando Trem de Pouso', prazo: '2024-03-10', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Integração Final', prazo: '2024-06-30', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação FAA Part 25', prazo: '2024-09-20', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'LR45-010', modelo: 'Learjet 45XR', tipo: 'COMERCIAL' as const, capacidade: 9, alcance: 3852,
      pecas: [
        { nome: 'Motor TFE731-20AR', tipo: 'IMPORTADA' as const, fornecedor: 'Honeywell', status: 'PRONTA' as const },
        { nome: 'Sistema Anti-Gelo', tipo: 'IMPORTADA' as const, fornecedor: 'Bombardier', status: 'EM_PRODUCAO' as const },
      ],
      testes: [
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'REPROVADO' as const },
      ],
      etapas: [
        { nome: 'Revisão Sistema Elétrico', prazo: '2024-02-01', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Substituição Componentes Elétricos', prazo: '2024-04-15', status: 'ANDAMENTO' as const, funcs: ['0002', '0003'] },
        { nome: 'Fabricação Sistema Anti-Gelo', prazo: '2024-07-20', status: 'PENDENTE' as const, funcs: ['0003'] },
        { nome: 'Novo Teste Elétrico', prazo: '2024-09-10', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Inspeção de Aeronavegabilidade', prazo: '2024-11-30', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'GLF650-011', modelo: 'Gulfstream G650ER', tipo: 'COMERCIAL' as const, capacidade: 19, alcance: 13890,
      pecas: [
        { nome: 'Motor Rolls-Royce BR725', tipo: 'IMPORTADA' as const, fornecedor: 'Rolls-Royce', status: 'PRONTA' as const },
        { nome: 'Winglet Ativo', tipo: 'IMPORTADA' as const, fornecedor: 'Gulfstream', status: 'PRONTA' as const },
        { nome: 'Cabine Pressurizadora', tipo: 'IMPORTADA' as const, fornecedor: 'Gulfstream', status: 'PRONTA' as const },
        { nome: 'Avionics PlaneView II', tipo: 'IMPORTADA' as const, fornecedor: 'Honeywell', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Design Cabine VIP', prazo: '2023-05-20', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação Estrutura', prazo: '2023-09-10', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação Motores BR725', prazo: '2023-12-20', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Personalização Interior', prazo: '2024-04-05', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Instalação PlaneView II', prazo: '2024-07-15', status: 'PENDENTE' as const, funcs: ['0002'] },
        { nome: 'Testes e Entrega Cliente', prazo: '2024-10-30', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
      ],
    },
    {
      codigo: 'ATR72-012', modelo: 'ATR 72-600', tipo: 'COMERCIAL' as const, capacidade: 70, alcance: 1528,
      pecas: [
        { nome: 'Motor PW127M', tipo: 'IMPORTADA' as const, fornecedor: 'Pratt & Whitney Canada', status: 'PRONTA' as const },
        { nome: 'Hélice Hamilton Sundstrand', tipo: 'IMPORTADA' as const, fornecedor: 'Hamilton Sundstrand', status: 'PRONTA' as const },
        { nome: 'Estrutura Asa CFRP', tipo: 'IMPORTADA' as const, fornecedor: 'ATR', status: 'EM_PRODUCAO' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Fabricação Asa CFRP', prazo: '2024-03-01', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Montagem Fuselagem', prazo: '2024-06-15', status: 'PENDENTE' as const, funcs: ['0002', '0003'] },
        { nome: 'Instalação de Turbohélices', prazo: '2024-09-01', status: 'PENDENTE' as const, funcs: ['0002'] },
        { nome: 'Aviónica e Sistemas', prazo: '2024-11-20', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Testes de Voo Regional', prazo: '2025-02-10', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'PC12-013', modelo: 'Pilatus PC-12 NGX', tipo: 'COMERCIAL' as const, capacidade: 9, alcance: 3417,
      pecas: [
        { nome: 'Motor PT6A-67P', tipo: 'IMPORTADA' as const, fornecedor: 'Pratt & Whitney Canada', status: 'PRONTA' as const },
        { nome: 'Hélice Hartzell', tipo: 'IMPORTADA' as const, fornecedor: 'Hartzell', status: 'PRONTA' as const },
        { nome: 'Avionics Honeywell Apex', tipo: 'IMPORTADA' as const, fornecedor: 'Honeywell', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Montagem Estrutural', prazo: '2023-11-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação Turbohélice PT6A', prazo: '2024-01-20', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Recepção Avionics Apex', prazo: '2024-04-10', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Integração e Calibração', prazo: '2024-06-30', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação EASA CS-23', prazo: '2024-09-15', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'C295-014', modelo: 'Airbus C295', tipo: 'MILITAR' as const, capacidade: 9200, alcance: 4800,
      pecas: [
        { nome: 'Motor PW127G', tipo: 'IMPORTADA' as const, fornecedor: 'Pratt & Whitney Canada', status: 'PRONTA' as const },
        { nome: 'Sistema de Guerra Eletrônica', tipo: 'IMPORTADA' as const, fornecedor: 'Indra', status: 'EM_PRODUCAO' as const },
        { nome: 'Rampa de Carga', tipo: 'NACIONAL' as const, fornecedor: 'OGMA', status: 'PRONTA' as const },
        { nome: 'Sistema de Navegação INS', tipo: 'IMPORTADA' as const, fornecedor: 'Thales', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'REPROVADO' as const },
      ],
      etapas: [
        { nome: 'Requisito FAB Patrulha', prazo: '2023-02-01', status: 'CONCLUIDA' as const, funcs: ['0001'] },
        { nome: 'Fabricação Fuselagem', prazo: '2023-07-15', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Integração Guerra Eletrônica', prazo: '2024-01-10', status: 'ANDAMENTO' as const, funcs: ['0001', '0002'] },
        { nome: 'Correção Sistema Elétrico', prazo: '2024-05-20', status: 'PENDENTE' as const, funcs: ['0002', '0003'] },
        { nome: 'Novos Testes Elétricos', prazo: '2024-08-15', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Homologação Militar', prazo: '2024-12-01', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'P3C-015', modelo: 'Super Tucano A-29B', tipo: 'MILITAR' as const, capacidade: 2, alcance: 1330,
      pecas: [
        { nome: 'Motor PT6A-68C', tipo: 'IMPORTADA' as const, fornecedor: 'Pratt & Whitney Canada', status: 'PRONTA' as const },
        { nome: 'Sistema de Mira FLIR', tipo: 'IMPORTADA' as const, fornecedor: 'FLIR Systems', status: 'PRONTA' as const },
        { nome: 'Estrutura Fuselagem', tipo: 'NACIONAL' as const, fornecedor: 'Embraer Defesa', status: 'PRONTA' as const },
        { nome: 'Ejetor Martin Baker', tipo: 'IMPORTADA' as const, fornecedor: 'Martin Baker', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Fabricação Nacional Fuselagem', prazo: '2023-04-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação FLIR e Armamento', prazo: '2023-08-20', status: 'CONCLUIDA' as const, funcs: ['0001', '0002'] },
        { nome: 'Aguardando Ejetor Martin Baker', prazo: '2024-02-15', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Testes de Missão CAS', prazo: '2024-06-01', status: 'PENDENTE' as const, funcs: ['0001'] },
        { nome: 'Entrega ao Esquadrão', prazo: '2024-08-30', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
      ],
    },
    {
      codigo: 'A330-016', modelo: 'Airbus A330-300', tipo: 'COMERCIAL' as const, capacidade: 277, alcance: 11750,
      pecas: [
        { nome: 'Motor Trent 700', tipo: 'IMPORTADA' as const, fornecedor: 'Rolls-Royce', status: 'PRONTA' as const },
        { nome: 'Trem de Pouso Principal', tipo: 'IMPORTADA' as const, fornecedor: 'Messier-Dowty', status: 'PRONTA' as const },
        { nome: 'APU GTCP 331-600', tipo: 'IMPORTADA' as const, fornecedor: 'Honeywell', status: 'EM_PRODUCAO' as const },
      ],
      testes: [
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Fabricação Asa e Fuselagem', prazo: '2023-06-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Integração Motores Trent 700', prazo: '2023-10-15', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Instalação APU e Sistemas', prazo: '2024-02-20', status: 'ANDAMENTO' as const, funcs: ['0002'] },
        { nome: 'Configuração de Cabine', prazo: '2024-06-10', status: 'PENDENTE' as const, funcs: ['0003'] },
        { nome: 'Testes Long-Range', prazo: '2024-10-01', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação EASA', prazo: '2025-01-20', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'B747-017', modelo: 'Boeing 747-8F', tipo: 'COMERCIAL' as const, capacidade: 140000, alcance: 8130,
      pecas: [
        { nome: 'Motor GEnx-2B67', tipo: 'IMPORTADA' as const, fornecedor: 'GE Aviation', status: 'PRONTA' as const },
        { nome: 'Winglet Raked', tipo: 'IMPORTADA' as const, fornecedor: 'Boeing', status: 'PRONTA' as const },
        { nome: 'Piso de Carga Principal', tipo: 'IMPORTADA' as const, fornecedor: 'Boeing', status: 'EM_TRANSPORTE' as const },
        { nome: 'Sistema ILS Cat III', tipo: 'IMPORTADA' as const, fornecedor: 'Rockwell Collins', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Adaptação para Versão Cargueira', prazo: '2023-03-15', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação Piso de Carga', prazo: '2023-07-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação Sistema de Carga', prazo: '2024-01-10', status: 'ANDAMENTO' as const, funcs: ['0002', '0003'] },
        { nome: 'Testes de Capacidade de Carga', prazo: '2024-05-20', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação FAA Cargo', prazo: '2024-09-01', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'DA42-018', modelo: 'Diamond DA42 Twin Star', tipo: 'COMERCIAL' as const, capacidade: 4, alcance: 1700,
      pecas: [
        { nome: 'Motor Austro AE300', tipo: 'IMPORTADA' as const, fornecedor: 'Austro Engine', status: 'PRONTA' as const },
        { nome: 'Hélice MT-Propeller', tipo: 'IMPORTADA' as const, fornecedor: 'MT-Propeller', status: 'PRONTA' as const },
        { nome: 'Avionics Garmin G1000', tipo: 'IMPORTADA' as const, fornecedor: 'Garmin', status: 'EM_PRODUCAO' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Montagem Estrutura Composta', prazo: '2023-09-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação Motores Diesel', prazo: '2023-12-10', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Integração Garmin G1000', prazo: '2024-04-20', status: 'ANDAMENTO' as const, funcs: ['0002', '0003'] },
        { nome: 'Testes de Certificação CS-23', prazo: '2024-07-30', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Entrega ao Operador', prazo: '2024-10-15', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'EC135-019', modelo: 'Airbus H135 (Helicóptero)', tipo: 'COMERCIAL' as const, capacidade: 7, alcance: 635,
      pecas: [
        { nome: 'Motor Turbomeca Arrius 2B2', tipo: 'IMPORTADA' as const, fornecedor: 'Safran Helicopter Engines', status: 'PRONTA' as const },
        { nome: 'Rotor Principal Fenestron', tipo: 'IMPORTADA' as const, fornecedor: 'Airbus Helicopters', status: 'PRONTA' as const },
        { nome: 'Sistema de Controle AFCS', tipo: 'IMPORTADA' as const, fornecedor: 'Thales', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'REPROVADO' as const },
      ],
      etapas: [
        { nome: 'Fabricação Rotor Fenestron', prazo: '2023-06-15', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Instalação Motores Safran', prazo: '2023-10-01', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Análise Falha Aerodinâmica', prazo: '2024-02-20', status: 'CONCLUIDA' as const, funcs: ['0001', '0002'] },
        { nome: 'Correção Sistema de Rotor', prazo: '2024-05-10', status: 'ANDAMENTO' as const, funcs: ['0002'] },
        { nome: 'Recepção AFCS Thales', prazo: '2024-08-01', status: 'PENDENTE' as const, funcs: ['0003'] },
        { nome: 'Novo Teste Aerodinâmico', prazo: '2024-10-20', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação EASA Rotorcraft', prazo: '2025-01-10', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'P68-020', modelo: 'Partenavia P.68C', tipo: 'COMERCIAL' as const, capacidade: 6, alcance: 1900,
      pecas: [
        { nome: 'Motor Lycoming IO-360', tipo: 'IMPORTADA' as const, fornecedor: 'Lycoming', status: 'PRONTA' as const },
        { nome: 'Hélice Sensenich', tipo: 'IMPORTADA' as const, fornecedor: 'Sensenich', status: 'EM_PRODUCAO' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Revisão Estrutural', prazo: '2024-01-15', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação Hélice Sensenich', prazo: '2024-04-01', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Integração e Balanceamento', prazo: '2024-07-10', status: 'PENDENTE' as const, funcs: ['0002', '0003'] },
        { nome: 'Testes de Voo VFR', prazo: '2024-09-20', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'C17-021', modelo: 'Boeing C-17 Globemaster III', tipo: 'MILITAR' as const, capacidade: 77519, alcance: 4630,
      pecas: [
        { nome: 'Motor PW2040', tipo: 'IMPORTADA' as const, fornecedor: 'Pratt & Whitney', status: 'PRONTA' as const },
        { nome: 'Sistema de Carga Palletizado', tipo: 'IMPORTADA' as const, fornecedor: 'Boeing', status: 'PRONTA' as const },
        { nome: 'Asa Supercrítica', tipo: 'IMPORTADA' as const, fornecedor: 'Boeing', status: 'EM_PRODUCAO' as const },
        { nome: 'Radar de Terreno TAWS', tipo: 'IMPORTADA' as const, fornecedor: 'Honeywell', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Fabricação Asa Supercrítica', prazo: '2023-08-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Montagem Fuselagem Militar', prazo: '2023-12-15', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Sistema de Carga Palletizado', prazo: '2024-04-20', status: 'ANDAMENTO' as const, funcs: ['0002'] },
        { nome: 'Integração Sistemas Táticos', prazo: '2024-08-10', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Testes de Carga Máxima', prazo: '2024-11-01', status: 'PENDENTE' as const, funcs: ['0001'] },
        { nome: 'Qualificação USAF', prazo: '2025-02-15', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
      ],
    },
    {
      codigo: 'ICON-022', modelo: 'ICON A5', tipo: 'COMERCIAL' as const, capacidade: 2, alcance: 815,
      pecas: [
        { nome: 'Motor Rotax 912 iS', tipo: 'IMPORTADA' as const, fornecedor: 'Rotax', status: 'PRONTA' as const },
        { nome: 'Flutuadores Anfíbios', tipo: 'IMPORTADA' as const, fornecedor: 'ICON Aircraft', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Fabricação Estrutura Anfíbia', prazo: '2024-02-01', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Recepção Flutuadores', prazo: '2024-05-15', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Instalação e Alinhamento', prazo: '2024-08-01', status: 'PENDENTE' as const, funcs: ['0002', '0003'] },
        { nome: 'Testes Aquáticos e de Voo', prazo: '2024-10-20', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
      ],
    },
    {
      codigo: 'E190-023', modelo: 'Embraer E190-E2', tipo: 'COMERCIAL' as const, capacidade: 106, alcance: 5278,
      pecas: [
        { nome: 'Motor PW1900G', tipo: 'IMPORTADA' as const, fornecedor: 'Pratt & Whitney', status: 'PRONTA' as const },
        { nome: 'Asa Supercrítica', tipo: 'NACIONAL' as const, fornecedor: 'Embraer', status: 'PRONTA' as const },
        { nome: 'Painel EFIS', tipo: 'IMPORTADA' as const, fornecedor: 'Rockwell Collins', status: 'EM_PRODUCAO' as const },
        { nome: 'Trem de Pouso Elétrico', tipo: 'NACIONAL' as const, fornecedor: 'Embraer', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'REPROVADO' as const },
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Projeto Asa Supercrítica Nacional', prazo: '2023-05-01', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação Nacional Asa', prazo: '2023-09-15', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Integração Motores PW1900G', prazo: '2024-01-20', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Correção Sistema Hidráulico', prazo: '2024-05-10', status: 'ANDAMENTO' as const, funcs: ['0002'] },
        { nome: 'Fabricação Painel EFIS e Trem', prazo: '2024-08-30', status: 'PENDENTE' as const, funcs: ['0003'] },
        { nome: 'Novo Teste Hidráulico', prazo: '2024-11-15', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação ANAC E2', prazo: '2025-02-01', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
    {
      codigo: 'AH2-024', modelo: 'AH-2 Sabre (AS.550 U2)', tipo: 'MILITAR' as const, capacidade: 2, alcance: 720,
      pecas: [
        { nome: 'Motor Turbomeca Arriel 2C2', tipo: 'IMPORTADA' as const, fornecedor: 'Safran Helicopter Engines', status: 'PRONTA' as const },
        { nome: 'Rotor Anticonjugado', tipo: 'IMPORTADA' as const, fornecedor: 'Airbus Helicopters', status: 'PRONTA' as const },
        { nome: 'Canhão M230 Chain Gun', tipo: 'IMPORTADA' as const, fornecedor: 'Northrop Grumman', status: 'EM_TRANSPORTE' as const },
      ],
      testes: [
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Conversão para Configuração de Ataque', prazo: '2023-07-01', status: 'CONCLUIDA' as const, funcs: ['0001'] },
        { nome: 'Integração Canhão M230', prazo: '2024-01-15', status: 'ANDAMENTO' as const, funcs: ['0001', '0003'] },
        { nome: 'Testes de Armamento em Terra', prazo: '2024-05-20', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Testes de Voo Tático', prazo: '2024-08-10', status: 'PENDENTE' as const, funcs: ['0001'] },
        { nome: 'Qualificação Operacional', prazo: '2024-11-01', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
      ],
    },
    {
      codigo: 'E170-025', modelo: 'Embraer E170-SU', tipo: 'COMERCIAL' as const, capacidade: 72, alcance: 3735,
      pecas: [
        { nome: 'Motor CF34-8E5A1', tipo: 'IMPORTADA' as const, fornecedor: 'GE Aviation', status: 'PRONTA' as const },
        { nome: 'Winglet Retrátil', tipo: 'NACIONAL' as const, fornecedor: 'Embraer', status: 'EM_PRODUCAO' as const },
        { nome: 'Estrutura Fuselagem Composta', tipo: 'NACIONAL' as const, fornecedor: 'Embraer', status: 'PRONTA' as const },
        { nome: 'Sistema ILS/VOR', tipo: 'IMPORTADA' as const, fornecedor: 'Thales', status: 'PRONTA' as const },
      ],
      testes: [
        { tipo: 'AERODINAMICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'ELETRICO' as const, resultado: 'APROVADO' as const },
        { tipo: 'HIDRAULICO' as const, resultado: 'APROVADO' as const },
      ],
      etapas: [
        { nome: 'Projeto Winglet Nacional', prazo: '2023-04-01', status: 'CONCLUIDA' as const, funcs: ['0002'] },
        { nome: 'Fabricação Fuselagem Composta', prazo: '2023-08-20', status: 'CONCLUIDA' as const, funcs: ['0003'] },
        { nome: 'Integração Motores CF34', prazo: '2023-12-10', status: 'CONCLUIDA' as const, funcs: ['0002', '0003'] },
        { nome: 'Fabricação Winglet Retrátil', prazo: '2024-04-15', status: 'ANDAMENTO' as const, funcs: ['0003'] },
        { nome: 'Testes de Desempenho', prazo: '2024-08-01', status: 'PENDENTE' as const, funcs: ['0001', '0002'] },
        { nome: 'Certificação Final ANAC', prazo: '2024-11-20', status: 'PENDENTE' as const, funcs: ['0001'] },
      ],
    },
  ]

  for (const av of aeronaves) {
    const { etapas, ...avData } = av
    await prisma.aeronave.upsert({
      where: { codigo: avData.codigo },
      update: {},
      create: {
        codigo: avData.codigo,
        modelo: avData.modelo,
        tipo: avData.tipo,
        capacidade: avData.capacidade,
        alcance: avData.alcance,
        pecas: { create: avData.pecas },
        testes: { create: avData.testes },
      },
    })
  }

  // ── Etapas por aeronave ───────────────────────────────────────────────────
  for (const av of aeronaves) {
    const aeronave = await prisma.aeronave.findUnique({ where: { codigo: av.codigo } })
    if (!aeronave) continue

    const etapaCount = await prisma.etapa.count({ where: { aeronaveId: aeronave.id } })
    if (etapaCount > 0) continue

    for (const etapa of av.etapas) {
      const { funcs, ...etapaData } = etapa
      const created = await prisma.etapa.create({
        data: { ...etapaData, aeronave: { connect: { id: aeronave.id } } },
      })
      for (const funcId of funcs) {
        await prisma.etapaFuncionario.create({
          data: { etapaId: created.id, funcionarioId: funcId },
        })
      }
    }
  }

  const totalEtapas = aeronaves.reduce((s, a) => s + a.etapas.length, 0)
  console.log(`✅ Seed concluído! 25 aeronaves e ${totalEtapas} etapas inseridas.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })