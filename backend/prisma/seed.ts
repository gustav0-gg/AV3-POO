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
    },
  ]

  for (const av of aeronaves) {
    await prisma.aeronave.upsert({
      where: { codigo: av.codigo },
      update: {},
      create: {
        codigo: av.codigo,
        modelo: av.modelo,
        tipo: av.tipo,
        capacidade: av.capacidade,
        alcance: av.alcance,
        pecas: { create: av.pecas },
        testes: { create: av.testes },
      },
    })
  }

  // ── Etapas da aeronave E175-001 ───────────────────────────────────────────
  const a1 = await prisma.aeronave.findUnique({ where: { codigo: 'E175-001' } })
  if (a1) {
    const etapaCount = await prisma.etapa.count({ where: { aeronaveId: a1.id } })
    if (etapaCount === 0) {
      const etapa1 = await prisma.etapa.create({ data: { nome: 'Projeto e Design', prazo: '2024-01-30', status: 'CONCLUIDA', aeronaveId: a1.id } })
      await prisma.etapaFuncionario.create({ data: { etapaId: etapa1.id, funcionarioId: '0002' } })
      const etapa2 = await prisma.etapa.create({ data: { nome: 'Montagem da Estrutura', prazo: '2024-06-30', status: 'ANDAMENTO', aeronaveId: a1.id } })
      await prisma.etapaFuncionario.create({ data: { etapaId: etapa2.id, funcionarioId: '0001' } })
      await prisma.etapaFuncionario.create({ data: { etapaId: etapa2.id, funcionarioId: '0002' } })
    }
  }

  console.log('✅ Seed concluído com sucesso! 25 aeronaves inseridas.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })