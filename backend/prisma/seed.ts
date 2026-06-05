import { PrismaClient, NivelPermissao } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Funcionários ──────────────────────────────────────────────────────────
  const senhaHash = await bcrypt.hash('1234', 10)
  const adminHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.funcionario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nome: 'Carlos Mendes',
      email: 'admin@aerotech.com',
      usuario: 'admin@aerotech.com',
      senha: senhaHash,
      cargo: 'Administrador',
      departamento: 'Engenharia',
      nivelPermissao: NivelPermissao.ADMINISTRADOR,
      status: 'ativo',
    },
  })

  const eng = await prisma.funcionario.upsert({
    where: { usuario: 'engenheiro@aerotech.com' },
    update: {},
    create: {
      nome: 'Ana Souza',
      email: 'engenheiro@aerotech.com',
      usuario: 'engenheiro@aerotech.com',
      senha: senhaHash,
      cargo: 'Engenheira de Produção',
      departamento: 'Projetos',
      nivelPermissao: NivelPermissao.ENGENHEIRO,
      status: 'ativo',
    },
  })

  await prisma.funcionario.upsert({
    where: { usuario: 'operador@aerotech.com' },
    update: {},
    create: {
      nome: 'Roberto Lima',
      email: 'operador@aerotech.com',
      usuario: 'operador@aerotech.com',
      senha: senhaHash,
      cargo: 'Operador Técnico',
      departamento: 'Manutenção',
      nivelPermissao: NivelPermissao.OPERADOR,
      status: 'ativo',
    },
  })

  await prisma.funcionario.upsert({
    where: { usuario: 'fernanda@aerotech.com' },
    update: {},
    create: {
      nome: 'Fernanda Costa',
      email: 'fernanda@aerotech.com',
      usuario: 'fernanda@aerotech.com',
      senha: senhaHash,
      cargo: 'Analista de Qualidade',
      departamento: 'Qualidade',
      nivelPermissao: NivelPermissao.OPERADOR,
      status: 'ativo',
    },
  })

  // ── Aeronave 1 ──────────────────────────────────────────────────────────────
  const a1 = await prisma.aeronave.upsert({
    where: { codigo: 'E175-001' },
    update: {},
    create: {
      codigo: 'E175-001',
      modelo: 'Embraer E175',
      matricula: 'PR-AER',
      fabricante: 'Embraer',
      anoFabricacao: 2019,
      tipo: 'COMERCIAL',
      capacidade: 80,
      alcance: 3735,
      status: 'em_producao',
      progresso: 72,
      responsavelId: eng.id,
      pecas: {
        create: [
          { nome: 'Motor CFM56-7B', numero: 'ENG-001', quantidade: 2, status: 'aprovado', fornecedor: 'CFM International', tipo: 'IMPORTADA' },
          { nome: 'Trem de Pouso Principal', numero: 'LG-002', quantidade: 1, status: 'em_teste', fornecedor: 'Safran Landing Systems', tipo: 'IMPORTADA' },
          { nome: 'Asa Direita', numero: 'WNG-003', quantidade: 1, status: 'pendente', fornecedor: 'Embraer', tipo: 'NACIONAL' },
          { nome: 'Fuselagem Central', numero: 'FUS-001', quantidade: 1, status: 'aprovado', fornecedor: 'Embraer', tipo: 'NACIONAL' },
        ],
      },
      testes: {
        create: [
          { nome: 'Teste de Pressurização', tipo: 'pressao', resultado: 'aprovado', dataRealizacao: '2024-03-10', responsavel: 'Ana Souza', observacoes: 'Todos os parâmetros dentro do esperado.' },
          { nome: 'Teste de Sistemas Elétricos', tipo: 'eletrico', resultado: 'aprovado', dataRealizacao: '2024-03-15', responsavel: 'Roberto Lima' },
          { nome: 'Teste de Motores', tipo: 'motor', resultado: 'pendente', responsavel: 'Ana Souza' },
          { nome: 'Inspeção Estrutural', tipo: 'estrutural', resultado: 'reprovado', dataRealizacao: '2024-03-20', responsavel: 'Carlos Mendes', observacoes: 'Revisar fixação do trem de pouso.' },
        ],
      },
      etapas: {
        create: [
          { nome: 'Projeto e Design', descricao: 'Desenvolvimento do projeto técnico', status: 'concluida', ordem: 1, dataInicio: '2024-01-05', dataFim: '2024-01-30', responsavel: 'Ana Souza' },
          { nome: 'Fabricação de Peças', descricao: 'Produção e aquisição de componentes', status: 'concluida', ordem: 2, dataInicio: '2024-02-01', dataFim: '2024-02-28', responsavel: 'Roberto Lima' },
          { nome: 'Montagem da Estrutura', descricao: 'Montagem principal da fuselagem e asas', status: 'em_andamento', ordem: 3, dataInicio: '2024-03-01', responsavel: 'Carlos Mendes' },
          { nome: 'Instalação de Sistemas', descricao: 'Instalação de sistemas elétricos, hidráulicos e aviônicos', status: 'pendente', ordem: 4, responsavel: 'Ana Souza' },
          { nome: 'Testes e Certificação', descricao: 'Realização de todos os testes obrigatórios', status: 'pendente', ordem: 5, responsavel: 'Ana Souza' },
        ],
      },
    },
  })

  // ── Aeronave 2 ─────────────────────────────────────────────────────────────
  await prisma.aeronave.upsert({
    where: { codigo: 'CES-XLS-001' },
    update: {},
    create: {
      codigo: 'CES-XLS-001',
      modelo: 'Cessna Citation XLS',
      matricula: 'PP-CES',
      fabricante: 'Cessna',
      anoFabricacao: 2021,
      tipo: 'COMERCIAL',
      capacidade: 9,
      alcance: 3700,
      status: 'concluida',
      progresso: 100,
      responsavelId: admin.id,
      pecas: {
        create: [
          { nome: 'Motor Williams FJ44', numero: 'ENG-010', quantidade: 2, status: 'aprovado', fornecedor: 'Williams International', tipo: 'IMPORTADA' },
          { nome: 'Avionics Suite', numero: 'AV-005', quantidade: 1, status: 'aprovado', fornecedor: 'Garmin', tipo: 'IMPORTADA' },
        ],
      },
      testes: {
        create: [
          { nome: 'Voo de Certificação', tipo: 'voo', resultado: 'aprovado', dataRealizacao: '2024-02-20', responsavel: 'Carlos Mendes', observacoes: 'Aeronave aprovada para operação.' },
        ],
      },
      etapas: {
        create: [
          { nome: 'Projeto e Design', status: 'concluida', ordem: 1, dataInicio: '2023-08-01', dataFim: '2023-09-30', responsavel: 'Ana Souza' },
          { nome: 'Fabricação', status: 'concluida', ordem: 2, dataInicio: '2023-10-01', dataFim: '2024-01-15', responsavel: 'Roberto Lima' },
          { nome: 'Testes', status: 'concluida', ordem: 3, dataInicio: '2024-01-20', dataFim: '2024-02-20', responsavel: 'Carlos Mendes' },
        ],
      },
    },
  })

  // ── Aeronave 3 ─────────────────────────────────────────────────────────────
  await prisma.aeronave.upsert({
    where: { codigo: 'BOE-737-001' },
    update: {},
    create: {
      codigo: 'BOE-737-001',
      modelo: 'Boeing 737 MAX',
      matricula: 'PT-BOE',
      fabricante: 'Boeing',
      anoFabricacao: 2023,
      tipo: 'COMERCIAL',
      capacidade: 180,
      alcance: 6570,
      status: 'aguardando',
      progresso: 5,
      etapas: {
        create: [
          { nome: 'Análise Inicial', descricao: 'Levantamento de requisitos e análise inicial', status: 'em_andamento', ordem: 1, dataInicio: '2024-03-25' },
        ],
      },
    },
  })

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
