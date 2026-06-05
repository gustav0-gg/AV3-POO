// ─── USUÁRIOS ──────────────────────────────────────────────────────────────
export const users = [
  { id: 1, nome: 'Carlos Mendes', email: 'admin@aerotech.com', senha: '1234', role: 'admin', cargo: 'Administrador' },
  { id: 2, nome: 'Ana Souza', email: 'engenheiro@aerotech.com', senha: '1234', role: 'engenheiro', cargo: 'Engenheira de Produção' },
  { id: 3, nome: 'Roberto Lima', email: 'operador@aerotech.com', senha: '1234', role: 'operador', cargo: 'Operador Técnico' },
];

// ─── FUNCIONÁRIOS ──────────────────────────────────────────────────────────
export const funcionariosIniciais = [
  { id: 1, nome: 'Carlos Mendes', email: 'carlos@aerotech.com', cargo: 'Gerente de Produção', departamento: 'Engenharia', status: 'ativo' },
  { id: 2, nome: 'Ana Souza', email: 'ana@aerotech.com', cargo: 'Engenheira Aeronáutica', departamento: 'Projetos', status: 'ativo' },
  { id: 3, nome: 'Roberto Lima', email: 'roberto@aerotech.com', cargo: 'Técnico Especializado', departamento: 'Manutenção', status: 'ativo' },
  { id: 4, nome: 'Fernanda Costa', email: 'fernanda@aerotech.com', cargo: 'Analista de Qualidade', departamento: 'Qualidade', status: 'ativo' },
  { id: 5, nome: 'Paulo Ribeiro', email: 'paulo@aerotech.com', cargo: 'Operador de Produção', departamento: 'Operações', status: 'inativo' },
];

// ─── AERONAVES ─────────────────────────────────────────────────────────────
export const aeronavesMock = [
  {
    id: 1,
    modelo: 'Embraer E175',
    matricula: 'PR-AER',
    fabricante: 'Embraer',
    anoFabricacao: 2019,
    status: 'em_producao',
    progresso: 72,
    responsavel: 'Ana Souza',
    pecas: [
      { id: 1, nome: 'Motor CFM56-7B', numero: 'ENG-001', status: 'pronta', fornecedor: 'CFM International' },
      { id: 2, nome: 'Trem de Pouso Principal', numero: 'LG-002', status: 'em_producao', fornecedor: 'Safran Landing Systems' },
      { id: 3, nome: 'Asa Direita', numero: 'WNG-003', status: 'pronta', fornecedor: 'Embraer' },
      { id: 4, nome: 'Fuselagem Central', numero: 'FUS-001', status: 'em_transporte', fornecedor: 'Embraer' },
    ],
    testes: [
      { id: 1, nome: 'Teste de Pressurização', tipo: 'aerodinamico', resultado: 'aprovado', dataRealizacao: '2024-03-10', observacoes: 'Todos os parâmetros dentro do esperado.' },
      { id: 2, nome: 'Teste de Sistemas Elétricos', tipo: 'eletrico', resultado: 'aprovado', dataRealizacao: '2024-03-15', observacoes: '' },
      { id: 3, nome: 'Teste de Motores', tipo: 'hidraulico', resultado: 'reprovado', dataRealizacao: '2025-12-15', observacoes: '' },
    ],
    etapas: [
      { id: 1, nome: 'Projeto e Design', descricao: 'Desenvolvimento do projeto técnico e design estrutural', status: 'concluida', dataInicio: '2024-01-05', dataFim: '2024-01-30', responsavel: 'Ana Souza', ordem: 1 },
      { id: 2, nome: 'Fabricação de Peças', descricao: 'Produção e aquisição de todos os componentes necessários', status: 'concluida', dataInicio: '2024-02-01', dataFim: '2024-02-28', responsavel: 'Roberto Lima', ordem: 2 },
      { id: 3, nome: 'Montagem da Estrutura', descricao: 'Montagem principal da fuselagem e asas', status: 'em_andamento', dataInicio: '2024-03-01', dataFim: '', responsavel: 'Carlos Mendes', ordem: 3 },
      { id: 4, nome: 'Instalação de Sistemas', descricao: 'Instalação de sistemas elétricos, hidráulicos e aviônicos', status: 'pendente', dataInicio: '', dataFim: '', responsavel: 'Ana Souza', ordem: 4 },
      { id: 5, nome: 'Testes e Certificação', descricao: 'Realização de todos os testes obrigatórios', status: 'pendente', dataInicio: '', dataFim: '', responsavel: 'Ana Souza', ordem: 5 },
    ],
  },
  {
    id: 2,
    modelo: 'Cessna Citation XLS',
    matricula: 'PP-CES',
    fabricante: 'Cessna',
    anoFabricacao: 2021,
    status: 'concluida',
    progresso: 100,
    responsavel: 'Carlos Mendes',
    pecas: [
      { id: 1, nome: 'Motor Williams FJ44', numero: 'ENG-010', status: 'em_transporte', fornecedor: 'Williams International' },
      { id: 2, nome: 'Avionics Suite', numero: 'AV-005', status: 'em_producao', fornecedor: 'Garmin' },
    ],
    testes: [
      { id: 1, nome: 'Voo de Certificação', tipo: 'hidraulico', resultado: 'aprovado', dataRealizacao: '2024-02-20', observacoes: 'Aeronave aprovada para operação.' },
    ],
    etapas: [
      { id: 1, nome: 'Projeto e Design', descricao: 'Projeto completo', status: 'concluida', dataInicio: '2023-08-01', dataFim: '2023-09-30', responsavel: 'Ana Souza', ordem: 1 },
      { id: 2, nome: 'Fabricação', descricao: 'Fabricação completa', status: 'concluida', dataInicio: '2023-10-01', dataFim: '2024-01-15', responsavel: 'Roberto Lima', ordem: 2 },
      { id: 3, nome: 'Testes', descricao: 'Todos os testes realizados', status: 'concluida', dataInicio: '2024-01-20', dataFim: '2024-02-20', responsavel: 'Carlos Mendes', ordem: 3 },
    ],
  },
  {
    id: 3,
    modelo: 'Boeing 737 MAX',
    matricula: 'PT-BOE',
    fabricante: 'Boeing',
    anoFabricacao: 2023,
    status: 'aguardando',
    progresso: 5,
    responsavel: 'Roberto Lima',
    pecas: [],
    testes: [],
    etapas: [
      { id: 1, nome: 'Análise Inicial', descricao: 'Levantamento de requisitos e análise inicial do projeto', status: 'em_andamento', dataInicio: '2024-03-25', dataFim: '', responsavel: 'Roberto Lima', ordem: 1 },
    ],
  },
];

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
export const dashboardStats = {
  totalAeronaves: 3,
  emProducao: 1,
  concluidas: 1,
  aguardando: 1,
  totalFuncionarios: 5,
  totalPecas: 6,
  testesAprovados: 3,
  testesReprovados: 1,
};