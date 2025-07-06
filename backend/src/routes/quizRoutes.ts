import { Router } from 'express'
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  deleteQuiz,
} from '../controllers/quizController'

const router = Router()

router.post('/quizzes', createQuiz)
router.get('/quizzes',   getQuizzes)
router.get('/quizzes/:id', getQuizById)
router.delete('/quizzes/:id', deleteQuiz)

export default router
