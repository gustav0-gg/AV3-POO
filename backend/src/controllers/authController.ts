import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
  }

  const func = await prisma.funcionario.findFirst({
    where: { OR: [{ usuario: email }, { email }] },
  })

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
      email: func.email,
      cargo: func.cargo,
      nivelPermissao: func.nivelPermissao,
      role: func.nivelPermissao.toLowerCase(),
    },
  })
}

export async function me(req: any, res: Response) {
  const func = await prisma.funcionario.findUnique({
    where: { id: req.user.id },
    select: { id: true, nome: true, email: true, cargo: true, nivelPermissao: true, status: true },
  })
  if (!func) return res.status(404).json({ error: 'Usuário não encontrado.' })
  return res.json({ ...func, role: func.nivelPermissao.toLowerCase() })
}
