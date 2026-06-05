import { Request, Response } from 'express'
import prisma from '../prisma/client'

const includeAll = {
  pecas: true,
  testes: true,
  etapas: {
    include: { funcionarios: { include: { funcionario: { select: { id: true, nome: true } } } } },
    orderBy: { ordem: 'asc' as const },
  },
  responsavel: { select: { id: true, nome: true } },
}

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
  const { codigo, modelo, matricula, fabricante, anoFabricacao, tipo, capacidade, alcance, status, progresso, responsavelId } = req.body
  if (!modelo || !matricula || !fabricante) {
    return res.status(400).json({ error: 'Modelo, matrícula e fabricante são obrigatórios.' })
  }

  // Gera código automático se não fornecido
  const codigoFinal = codigo || `${matricula.replace(/[^A-Z0-9]/g, '')}-${Date.now()}`

  const aeronave = await prisma.aeronave.create({
    data: {
      codigo: codigoFinal,
      modelo, matricula, fabricante,
      anoFabricacao: parseInt(anoFabricacao) || new Date().getFullYear(),
      tipo: tipo || 'COMERCIAL',
      capacidade: parseInt(capacidade) || 0,
      alcance: parseInt(alcance) || 0,
      status: status || 'aguardando',
      progresso: parseInt(progresso) || 0,
      responsavelId: responsavelId ? parseInt(responsavelId) : null,
    },
    include: includeAll,
  })
  return res.status(201).json(aeronave)
}

export async function atualizar(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const existe = await prisma.aeronave.findUnique({ where: { id } })
  if (!existe) return res.status(404).json({ error: 'Aeronave não encontrada.' })

  const { modelo, matricula, fabricante, anoFabricacao, tipo, capacidade, alcance, status, progresso, responsavelId } = req.body
  const data: any = {}
  if (modelo) data.modelo = modelo
  if (matricula) data.matricula = matricula
  if (fabricante) data.fabricante = fabricante
  if (anoFabricacao !== undefined) data.anoFabricacao = parseInt(anoFabricacao)
  if (tipo) data.tipo = tipo
  if (capacidade !== undefined) data.capacidade = parseInt(capacidade)
  if (alcance !== undefined) data.alcance = parseInt(alcance)
  if (status) data.status = status
  if (progresso !== undefined) data.progresso = parseInt(progresso)
  if (responsavelId !== undefined) data.responsavelId = responsavelId ? parseInt(responsavelId) : null

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
  const { nome, numero, quantidade, tipo, status, fornecedor } = req.body
  if (!nome || !numero) return res.status(400).json({ error: 'Nome e número são obrigatórios.' })
  const peca = await prisma.peca.create({
    data: {
      nome, numero, aeronaveId,
      quantidade: parseInt(quantidade) || 1,
      tipo: tipo || 'NACIONAL',
      status: status || 'pendente',
      fornecedor: fornecedor || null,
    },
  })
  return res.status(201).json(peca)
}

export async function atualizarPeca(req: Request, res: Response) {
  const pecaId = parseInt(req.params.pecaId)
  const existe = await prisma.peca.findUnique({ where: { id: pecaId } })
  if (!existe) return res.status(404).json({ error: 'Peça não encontrada.' })
  const { nome, numero, quantidade, tipo, status, fornecedor } = req.body
  const data: any = {}
  if (nome) data.nome = nome
  if (numero) data.numero = numero
  if (quantidade !== undefined) data.quantidade = parseInt(quantidade)
  if (tipo) data.tipo = tipo
  if (status) data.status = status
  if (fornecedor !== undefined) data.fornecedor = fornecedor
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
  const { nome, tipo, resultado, dataRealizacao, responsavel, observacoes } = req.body
  if (!nome) return res.status(400).json({ error: 'Nome do teste é obrigatório.' })
  const teste = await prisma.teste.create({
    data: {
      nome, aeronaveId,
      tipo: tipo || 'eletrico',
      resultado: resultado || 'pendente',
      dataRealizacao: dataRealizacao || null,
      responsavel: responsavel || null,
      observacoes: observacoes || null,
    },
  })
  return res.status(201).json(teste)
}

export async function atualizarTeste(req: Request, res: Response) {
  const testeId = parseInt(req.params.testeId)
  const existe = await prisma.teste.findUnique({ where: { id: testeId } })
  if (!existe) return res.status(404).json({ error: 'Teste não encontrado.' })
  const { nome, tipo, resultado, dataRealizacao, responsavel, observacoes } = req.body
  const data: any = {}
  if (nome) data.nome = nome
  if (tipo) data.tipo = tipo
  if (resultado) data.resultado = resultado
  if (dataRealizacao !== undefined) data.dataRealizacao = dataRealizacao
  if (responsavel !== undefined) data.responsavel = responsavel
  if (observacoes !== undefined) data.observacoes = observacoes
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

export async function listarEtapas(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const etapas = await prisma.etapa.findMany({
    where: { aeronaveId },
    include: { funcionarios: { include: { funcionario: { select: { id: true, nome: true } } } } },
    orderBy: { ordem: 'asc' },
  })
  return res.json(etapas)
}

export async function criarEtapa(req: Request, res: Response) {
  const aeronaveId = parseInt(req.params.id)
  const { nome, descricao, status, ordem, prazo, dataInicio, dataFim, responsavel } = req.body
  if (!nome) return res.status(400).json({ error: 'Nome da etapa é obrigatório.' })
  const etapa = await prisma.etapa.create({
    data: {
      nome, aeronaveId,
      descricao: descricao || null,
      status: status || 'pendente',
      ordem: parseInt(ordem) || 1,
      prazo: prazo || null,
      dataInicio: dataInicio || null,
      dataFim: dataFim || null,
      responsavel: responsavel || null,
    },
    include: { funcionarios: { include: { funcionario: { select: { id: true, nome: true } } } } },
  })
  return res.status(201).json(etapa)
}

export async function atualizarEtapa(req: Request, res: Response) {
  const etapaId = parseInt(req.params.etapaId)
  const existe = await prisma.etapa.findUnique({ where: { id: etapaId } })
  if (!existe) return res.status(404).json({ error: 'Etapa não encontrada.' })
  const { nome, descricao, status, ordem, prazo, dataInicio, dataFim, responsavel } = req.body
  const data: any = {}
  if (nome) data.nome = nome
  if (descricao !== undefined) data.descricao = descricao
  if (status) data.status = status
  if (ordem !== undefined) data.ordem = parseInt(ordem)
  if (prazo !== undefined) data.prazo = prazo
  if (dataInicio !== undefined) data.dataInicio = dataInicio
  if (dataFim !== undefined) data.dataFim = dataFim
  if (responsavel !== undefined) data.responsavel = responsavel
  const etapa = await prisma.etapa.update({
    where: { id: etapaId }, data,
    include: { funcionarios: { include: { funcionario: { select: { id: true, nome: true } } } } },
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
