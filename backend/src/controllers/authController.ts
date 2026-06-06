import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'

export async function login(req: Request, res: Response) {
  const { usuario, senha } = req.body
  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' })
  }

  const func = await prisma.funcionario.findUnique({ where: { usuario } })
  if (!func) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' })
  }

  const senhaValida = await bcrypt.compare(senha, func.senha)
  if (!senhaValida) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' })
  }

  const token = jwt.sign(
    { id: func.id, usuario: func.usuario, nivelPermissao: func.nivelPermissao },
    process.env.JWT_SECRET || 'aerocode_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  )

  return res.json({
    token,
    user: {
      id: func.id,
      nome: func.nome,
      usuario: func.usuario,
      nivelPermissao: func.nivelPermissao,
    },
  })
}

export async function me(req: any, res: Response) {
  const func = await prisma.funcionario.findUnique({
    where: { id: req.user.id },
    select: { id: true, nome: true, usuario: true, nivelPermissao: true },
  })
  if (!func) return res.status(404).json({ error: 'Usuário não encontrado.' })
  return res.json(func)
}
