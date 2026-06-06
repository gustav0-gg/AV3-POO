import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prisma/client'

export async function listar(req: Request, res: Response) {
  const funcionarios = await prisma.funcionario.findMany({
    select: {
      id: true, nome: true, telefone: true, endereco: true,
      usuario: true, nivelPermissao: true, createdAt: true,
    },
    orderBy: { nome: 'asc' },
  })
  return res.json(funcionarios)
}

export async function buscarPorId(req: Request, res: Response) {
  const { id } = req.params
  const func = await prisma.funcionario.findUnique({
    where: { id },
    select: {
      id: true, nome: true, telefone: true, endereco: true,
      usuario: true, nivelPermissao: true,
    },
  })
  if (!func) return res.status(404).json({ error: 'Funcionário não encontrado.' })
  return res.json(func)
}

export async function criar(req: Request, res: Response) {
  const { id, nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body
  if (!id || !nome || !telefone || !endereco || !usuario || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: id, nome, telefone, endereco, usuario, senha.' })
  }

  const existeId = await prisma.funcionario.findUnique({ where: { id } })
  if (existeId) return res.status(409).json({ error: 'Já existe um funcionário com este ID.' })

  const existeUsuario = await prisma.funcionario.findUnique({ where: { usuario } })
  if (existeUsuario) return res.status(409).json({ error: 'Usuário já cadastrado.' })

  const hash = await bcrypt.hash(senha, 10)
  const func = await prisma.funcionario.create({
    data: {
      id,
      nome,
      telefone,
      endereco,
      usuario,
      senha: hash,
      nivelPermissao: nivelPermissao || 'OPERADOR',
    },
    select: {
      id: true, nome: true, telefone: true, endereco: true,
      usuario: true, nivelPermissao: true,
    },
  })
  return res.status(201).json(func)
}

export async function atualizar(req: Request, res: Response) {
  const { id } = req.params
  const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body

  const existe = await prisma.funcionario.findUnique({ where: { id } })
  if (!existe) return res.status(404).json({ error: 'Funcionário não encontrado.' })

  const data: any = {}
  if (nome) data.nome = nome
  if (telefone) data.telefone = telefone
  if (endereco) data.endereco = endereco
  if (usuario) data.usuario = usuario
  if (senha) data.senha = await bcrypt.hash(senha, 10)
  if (nivelPermissao) data.nivelPermissao = nivelPermissao

  const func = await prisma.funcionario.update({
    where: { id },
    data,
    select: {
      id: true, nome: true, telefone: true, endereco: true,
      usuario: true, nivelPermissao: true,
    },
  })
  return res.json(func)
}

export async function deletar(req: Request, res: Response) {
  const { id } = req.params
  const existe = await prisma.funcionario.findUnique({ where: { id } })
  if (!existe) return res.status(404).json({ error: 'Funcionário não encontrado.' })
  await prisma.funcionario.delete({ where: { id } })
  return res.json({ message: 'Funcionário excluído com sucesso.' })
}
