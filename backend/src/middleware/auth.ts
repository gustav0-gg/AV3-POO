import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: number; usuario: string; nivelPermissao: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }
  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'aerocode_secret') as any
    req.user = { id: payload.id, usuario: payload.usuario, nivelPermissao: payload.nivelPermissao }
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.nivelPermissao !== 'ADMINISTRADOR') {
    return res.status(403).json({ error: 'Acesso negado. Somente administradores.' })
  }
  next()
}

export function requireEngenheiro(req: AuthRequest, res: Response, next: NextFunction) {
  const allowed = ['ADMINISTRADOR', 'ENGENHEIRO']
  if (!req.user || !allowed.includes(req.user.nivelPermissao)) {
    return res.status(403).json({ error: 'Acesso negado. Requer perfil Engenheiro ou superior.' })
  }
  next()
}
