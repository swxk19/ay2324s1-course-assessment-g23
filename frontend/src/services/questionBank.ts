/** `localStorage` key for storing questions. */
const QUESTIONS_STORAGE_KEY = 'questions'

export interface Question {
    id: number
    title: string
    description: string
    category: string[]
    complexity: 'Easy' | 'Medium' | 'Hard'
}

const _getNextId = async (): Promise<number> => {
    const questions: Question[] = await getQuestions()
    if (questions.length === 0) return 1

    const maxId = Math.max(...questions.map((q) => q.id))
    return maxId + 1
}

// Create
export const storeQuestion = async (
    question: Omit<Question, 'id'>
): Promise<void> => {
    const id: number = await _getNextId()
    const questions = await getQuestions()
    const newQuestion = { id, ...question }

    questions.push(newQuestion)
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions))
}

// Read
export const getQuestions = async (): Promise<Question[]> => {
    return JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]')
}

// Update
export const updateQuestion = async (
    updatedQuestion: Question
): Promise<void> => {
    const questions: Question[] = await getQuestions()
    const index = questions.findIndex((q) => q.id === updatedQuestion.id)

    if (index > -1) {
        questions[index] = updatedQuestion
        localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions))
    }
}

// Delete
export const deleteQuestion = async (id: number): Promise<void> => {
    const questions: Question[] = await getQuestions()
    const newQuestions = questions.filter((q) => q.id !== id)
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(newQuestions))
}
