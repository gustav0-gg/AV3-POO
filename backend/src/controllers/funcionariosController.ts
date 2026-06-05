import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prisma/client'

export async function listar(req: Request, res: Response) {
  const funcionarios = await prisma.funcionario.findMany({
    select: {
      id: true, nome: true, email: true, usuario: true,
      cargo: true, departamento: true, nivelPermissao: true,
      status: true, telefone: true, endereco: true, createdAt: true,
    },
    orderBy: { nome: 'asc' },
  })
  return res.json(funcionarios)
}

export async function buscarPorId(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const func = await prisma.funcionario.findUnique({
    where: { id },
    select: {
      id: true, nome: true, email: true, usuario: true,
      cargo: true, departamento: true, nivelPermissao: true,
      status: true, telefone: true, endereco: true,
    },
  })
  if (!func) return res.status(404).json({ error: 'Funcionário não encontrado.' })
  return res.json(func)
}

export async function criar(req: Request, res: Response) {
  const { nome, email, senha, cargo, departamento, nivelPermissao, status, telefone, endereco } = req.body
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' })
  }
  const existe = await prisma.funcionario.findFirst({ where: { OR: [{ email }, { usuario: email }] } })
  if (existe) return res.status(409).json({ error: 'E-mail já cadastrado.' })

  const hash = await bcrypt.hash(senha, 10)
  const func = await prisma.funcionario.create({
    data: {
      nome, email, usuario: email, senha: hash,
      cargo: cargo || null,
      departamento: departamento || null,
      nivelPermissao: nivelPermissao || 'OPERADOR',
      status: status || 'ativo',
      telefone: telefone || null,
      endereco: endereco || null,
    },
    select: {
      id: true, nome: true, email: true, cargo: true,
      departamento: true, nivelPermissao: true, status: true,
    },
  })
  return res.status(201).json(func)
}

export async function atualizar(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const { nome, email, senha, cargo, departamento, nivelPermissao, status, telefone, endereco } = req.body

  const existe = await prisma.funcionario.findUnique({ where: { id } })
  if (!existe) return res.status(404).json({ error: 'Funcionário não encontrado.' })

  const data: any = {}
  if (nome) data.nome = nome
  if (email) { data.email = email; data.usuario = email }
  if (senha) data.senha = await bcrypt.hash(senha, 10)
  if (cargo !== undefined) data.cargo = cargo
  if (departamento !== undefined) data.departamento = departamento
  if (nivelPermissao) data.nivelPermissao = nivelPermissao
  if (status) data.status = status
  if (telefone !== undefined) data.telefone = telefone
  if (endereco !== undefined) data.endereco = endereco

  const func = await prisma.funcionario.update({
    where: { id },
    data,
    select: {
      id: true, nome: true, email: true, cargo: true,
      departamento: true, nivelPermissao: true, status: true,
    },
  })
  return res.json(func)
}

export async function deletar(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const existe = await prisma.funcionario.findUnique({ where: { id } })
  if (!existe) return res.status(404).json({ error: 'Funcionário não encontrado.' })
  await prisma.funcionario.delete({ where: { id } })
  return res.json({ message: 'Funcionário excluído com sucesso.' })
}
