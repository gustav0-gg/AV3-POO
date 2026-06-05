import { Router } from 'express'
import { login, me } from '../controllers/authController'
import * as F from '../controllers/funcionariosController'
import * as A from '../controllers/aeronaveController'
import * as M from '../controllers/metricsController'
import { authMiddleware, requireAdmin, requireEngenheiro } from '../middleware/auth'

const router = Router()

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/auth/login', login)
router.get('/auth/me', authMiddleware, me)

// ── Funcionários ──────────────────────────────────────────────────────────────
router.get('/funcionarios', authMiddleware, F.listar)
router.get('/funcionarios/:id', authMiddleware, F.buscarPorId)
router.post('/funcionarios', authMiddleware, requireAdmin, F.criar)
router.put('/funcionarios/:id', authMiddleware, requireAdmin, F.atualizar)
router.delete('/funcionarios/:id', authMiddleware, requireAdmin, F.deletar)

// ── Aeronaves ─────────────────────────────────────────────────────────────────
router.get('/aeronaves', authMiddleware, A.listar)
router.get('/aeronaves/:id', authMiddleware, A.buscarPorId)
router.post('/aeronaves', authMiddleware, requireEngenheiro, A.criar)
router.put('/aeronaves/:id', authMiddleware, requireEngenheiro, A.atualizar)
router.delete('/aeronaves/:id', authMiddleware, requireAdmin, A.deletar)

// ── Peças ─────────────────────────────────────────────────────────────────────
router.get('/aeronaves/:id/pecas', authMiddleware, A.listarPecas)
router.post('/aeronaves/:id/pecas', authMiddleware, requireEngenheiro, A.criarPeca)
router.put('/aeronaves/:id/pecas/:pecaId', authMiddleware, requireEngenheiro, A.atualizarPeca)
router.delete('/aeronaves/:id/pecas/:pecaId', authMiddleware, requireEngenheiro, A.deletarPeca)

// ── Testes ────────────────────────────────────────────────────────────────────
router.get('/aeronaves/:id/testes', authMiddleware, A.listarTestes)
router.post('/aeronaves/:id/testes', authMiddleware, requireEngenheiro, A.criarTeste)
router.put('/aeronaves/:id/testes/:testeId', authMiddleware, requireEngenheiro, A.atualizarTeste)
router.delete('/aeronaves/:id/testes/:testeId', authMiddleware, requireAdmin, A.deletarTeste)

// ── Etapas ────────────────────────────────────────────────────────────────────
router.get('/aeronaves/:id/etapas', authMiddleware, A.listarEtapas)
router.post('/aeronaves/:id/etapas', authMiddleware, requireEngenheiro, A.criarEtapa)
router.put('/aeronaves/:id/etapas/:etapaId', authMiddleware, requireEngenheiro, A.atualizarEtapa)
router.delete('/aeronaves/:id/etapas/:etapaId', authMiddleware, requireAdmin, A.deletarEtapa)

// ── Métricas de qualidade ─────────────────────────────────────────────────────
router.get('/metrics', authMiddleware, M.getMetrics)
router.delete('/metrics', authMiddleware, requireAdmin, M.resetMetrics)
router.post('/metrics/simulate', authMiddleware, M.simulateLoad)

export default router
