import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface NewOption {
  text: string
  isCorrect: boolean
}
interface NewQuestionDTO {
  text: string
  type: string
  options?: NewOption[]
}

// POST /quizzes
export const createQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      questions,
    }: { title: string; questions: NewQuestionDTO[] } = req.body

    // створюємо Quiz + nested questions + nested options
    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: {
              create: (q.options || []).map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    })

    res.status(201).json(quiz)
  } catch (err: any) {
    console.error('POST /quizzes error:', err)
    res.status(500).json({ error: err.message })
  }
}

// GET /quizzes
export const getQuizzes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        _count: { select: { questions: true } },
      },
    })

    // віддаємо questionCount замість внутрішнього _count
    const result = list.map((q: { id: number; title: string; _count: { questions: number } }) => ({
      id: q.id,
      title: q.title,
      questionCount: q._count.questions,
    }))

    res.json(result)
  } catch (err: any) {
    console.error('GET /quizzes error:', err)
    res.status(500).json({ error: err.message })
  }
}

// GET /quizzes/:id
export const getQuizById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    })
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' })
      return
    }
    res.json(quiz)
  } catch (err: any) {
    console.error('GET /quizzes/:id error:', err)
    res.status(500).json({ error: err.message })
  }
}

// DELETE /quizzes/:id
export const deleteQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    await prisma.quiz.delete({ where: { id } })
    res.status(204).send()
  } catch (err: any) {
    console.error('DELETE /quizzes/:id error:', err)
    res.status(500).json({ error: err.message })
  }
}