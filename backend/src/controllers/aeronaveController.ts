import { Request, Response } from 'express'
import prisma from '../prisma/client'

const includeAll = {
  pecas: true,
  testes: true,
  etapas: {
    include: {
      funcionarios: {
        include: { funcionario: { select: { id: true, nome: true } } },
      },
    },
    orderBy: { id: 'asc' as const },
  },
}

// ── Aeronaves ─────────────────────────────────────────────────────────────────

export async function listar(req: Request, res: Response) {
  const aeronaves = await prisma.aeronave.findMany({
    include: includeAll,
    orderBy: { createdAt: 'desc' },
  })
  return res.json(aeronaves)
}

export async function buscarPorId(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const aeronave = await prisma.aeronave.findUnique({ where: { id }, include: includeAll })
  if (!aeronave) return res.status(404).json({ error: 'Aeronave não encontrada.' })
  return res.json(aeronave)
}

export async function criar(req: Request, res: Response) {
  const { codigo, modelo, tipo, capacidade, alcance } = req.body
  if (!codigo || !modelo) {
    return res.status(400).json({ error: 'Código e modelo são obrigatórios.' })
  }

  const existe = await prisma.aeronave.findUnique({ where: { codigo } })
  if (existe) return res.status(409).json({ error: 'Já existe uma aeronave com este código.' })

  const aeronave = await prisma.aeronave.create({
    data: {
      codigo,
      modelo,
      tipo: tipo || 'COMERCIAL',
      capacidade: parseInt(capacidade) || 0,
      alcance: parseInt(alcance) || 0,
    },
    include: includeAll,
  })
  return res.status(201).json(aeronave)
}

export async function atualizar(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const existe = await prisma.aeronave.findUnique({ where: { id } })
  if (!existe) return res.status(404).json({ error: 'Aeronave não encontrada.' })

  const { modelo, tipo, capacidade, alcance } = req.body
  const data: any = {}
  if (modelo) data.modelo = modelo
  if (tipo) data.tipo = tipo
  if (capacidade !== undefined) data.capacidade = parseInt(capacidade)
  if (alcance !== undefined) data.alcance = parseInt(alcance)

  const aeronave = await prisma.aeronave.update({ where: { id }, data, include: includeAll })
  return res.json(aeronave)
}

export async function deletar(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const existe = await prisma.aeronave.findUnique({ where: { id } })
  if (!existe) return res.status(404).json({ error: 'Aeronave não encontrada.' })
  await prisma.aeronave.delete({ where: { id } })
  return res.json({ message: 'Aeronave excluída com sucesso.' })
}

// ── Peças ─────────────────────────────────────────────────────────────────────

export async function listarPecas(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const pecas = await prisma.peca.findMany({ where: { aeronaveId }, orderBy: { createdAt: 'asc' } })
  return res.json(pecas)
}

export async function criarPeca(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const { nome, tipo, fornecedor, status } = req.body
  if (!nome || !fornecedor) return res.status(400).json({ error: 'Nome e fornecedor são obrigatórios.' })
  const peca = await prisma.peca.create({
    data: {
      nome,
      aeronaveId,
      tipo: tipo || 'NACIONAL',
      fornecedor,
      status: status || 'EM_PRODUCAO',
    },
  })
  return res.status(201).json(peca)
}

export async function atualizarPeca(req: Request, res: Response) {
  const pecaId = parseInt(req.params.pecaId)
  const existe = await prisma.peca.findUnique({ where: { id: pecaId } })
  if (!existe) return res.status(404).json({ error: 'Peça não encontrada.' })
  const { nome, tipo, fornecedor, status } = req.body
  const data: any = {}
  if (nome) data.nome = nome
  if (tipo) data.tipo = tipo
  if (fornecedor !== undefined) data.fornecedor = fornecedor
  if (status) data.status = status
  const peca = await prisma.peca.update({ where: { id: pecaId }, data })
  return res.json(peca)
}

export async function deletarPeca(req: Request, res: Response) {
  const pecaId = parseInt(req.params.pecaId)
  const existe = await prisma.peca.findUnique({ where: { id: pecaId } })
  if (!existe) return res.status(404).json({ error: 'Peça não encontrada.' })
  await prisma.peca.delete({ where: { id: pecaId } })
  return res.json({ message: 'Peça excluída.' })
}

// ── Testes ────────────────────────────────────────────────────────────────────

export async function listarTestes(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const testes = await prisma.teste.findMany({ where: { aeronaveId }, orderBy: { createdAt: 'asc' } })
  return res.json(testes)
}

export async function criarTeste(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const { tipo, resultado } = req.body
  if (!tipo || !resultado) return res.status(400).json({ error: 'Tipo e resultado são obrigatórios.' })
  const teste = await prisma.teste.create({
    data: {
      aeronaveId,
      tipo: tipo || 'ELETRICO',
      resultado: resultado || 'APROVADO',
    },
  })
  return res.status(201).json(teste)
}

export async function atualizarTeste(req: Request, res: Response) {
  const testeId = parseInt(req.params.testeId)
  const existe = await prisma.teste.findUnique({ where: { id: testeId } })
  if (!existe) return res.status(404).json({ error: 'Teste não encontrado.' })
  const { tipo, resultado } = req.body
  const data: any = {}
  if (tipo) data.tipo = tipo
  if (resultado) data.resultado = resultado
  const teste = await prisma.teste.update({ where: { id: testeId }, data })
  return res.json(teste)
}

export async function deletarTeste(req: Request, res: Response) {
  const testeId = parseInt(req.params.testeId)
  const existe = await prisma.teste.findUnique({ where: { id: testeId } })
  if (!existe) return res.status(404).json({ error: 'Teste não encontrado.' })
  await prisma.teste.delete({ where: { id: testeId } })
  return res.json({ message: 'Teste excluído.' })
}

// ── Etapas ────────────────────────────────────────────────────────────────────

const includeEtapa = {
  funcionarios: {
    include: { funcionario: { select: { id: true, nome: true } } },
  },
}

export async function listarEtapas(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const etapas = await prisma.etapa.findMany({
    where: { aeronaveId },
    include: includeEtapa,
    orderBy: { id: 'asc' },
  })
  return res.json(etapas)
}

export async function criarEtapa(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const { nome, prazo, status, funcionarioIds } = req.body
  if (!nome || !prazo) return res.status(400).json({ error: 'Nome e prazo são obrigatórios.' })

  const etapa = await prisma.etapa.create({
    data: {
      nome,
      prazo,
      aeronaveId,
      status: status || 'PENDENTE',
      funcionarios: funcionarioIds?.length
        ? { create: funcionarioIds.map((fid: string) => ({ funcionarioId: fid })) }
        : undefined,
    },
    include: includeEtapa,
  })
  return res.status(201).json(etapa)
}

export async function atualizarEtapa(req: Request, res: Response) {
  const etapaId = parseInt(req.params.etapaId)
  const existe = await prisma.etapa.findUnique({ where: { id: etapaId } })
  if (!existe) return res.status(404).json({ error: 'Etapa não encontrada.' })

  const { nome, prazo, status, funcionarioIds } = req.body
  const data: any = {}
  if (nome) data.nome = nome
  if (prazo !== undefined) data.prazo = prazo
  if (status) data.status = status

  // Se funcionarioIds foi enviado, substituir os vínculos
  if (funcionarioIds !== undefined) {
    await prisma.etapaFuncionario.deleteMany({ where: { etapaId } })
    if (funcionarioIds.length) {
      await prisma.etapaFuncionario.createMany({
        data: funcionarioIds.map((fid: string) => ({ etapaId, funcionarioId: fid })),
      })
    }
  }

  const etapa = await prisma.etapa.update({
    where: { id: etapaId },
    data,
    include: includeEtapa,
  })
  return res.json(etapa)
}

export async function deletarEtapa(req: Request, res: Response) {
  const etapaId = parseInt(req.params.etapaId)
  const existe = await prisma.etapa.findUnique({ where: { id: etapaId } })
  if (!existe) return res.status(404).json({ error: 'Etapa não encontrada.' })
  await prisma.etapa.delete({ where: { id: etapaId } })
  return res.json({ message: 'Etapa excluída.' })
}

// ── Associar/desassociar funcionário de etapa ─────────────────────────────────

export async function associarFuncionarioEtapa(req: Request, res: Response) {
  const etapaId = parseInt(req.params.etapaId)
  const { funcionarioId } = req.body
  if (!funcionarioId) return res.status(400).json({ error: 'funcionarioId é obrigatório.' })

  const existe = await prisma.etapaFuncionario.findUnique({
    where: { etapaId_funcionarioId: { etapaId, funcionarioId } },
  })
  if (existe) return res.status(409).json({ error: 'Funcionário já associado a esta etapa.' })

  await prisma.etapaFuncionario.create({ data: { etapaId, funcionarioId } })
  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId }, include: includeEtapa })
  return res.json(etapa)
}

export async function desassociarFuncionarioEtapa(req: Request, res: Response) {
  const etapaId = parseInt(req.params.etapaId)
  const { funcionarioId } = req.params
  await prisma.etapaFuncionario.deleteMany({ where: { etapaId, funcionarioId } })
  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId }, include: includeEtapa })
  return res.json(etapa)
}
