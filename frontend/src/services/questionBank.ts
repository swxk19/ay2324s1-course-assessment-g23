/** `localStorage` key for storing questions. */
const QUESTIONS_STORAGE_KEY = 'questions'

/**
 * Represents a question in the question bank.
 */
export interface Question {
    id: number
    title: string
    description: string
    category: string[]
    complexity: 'Easy' | 'Medium' | 'Hard'
}

/**
 * Gets the next available ID for storing a new question.
 *
 * @private
 * @returns {Promise<number>} The next available ID.
 */
const _getNextId = async (): Promise<number> => {
    const questions: Question[] = await getQuestions()
    if (questions.length === 0) return 1

    const maxId = Math.max(...questions.map((q) => q.id))
    return maxId + 1
}

/**
 * Stores a new question into the localStorage.
 *
 * @param {Omit<Question, 'id'>} question - The question object without the ID.
 * @returns {Promise<void>}
 */
export const storeQuestion = async (
    question: Omit<Question, 'id'>
): Promise<void> => {
    const id: number = await _getNextId()
    const questions = await getQuestions()
    const newQuestion = { id, ...question }

    questions.push(newQuestion)
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions))
}

/**
 * Retrieves all questions from the localStorage.
 *
 * @returns {Promise<Question[]>} An array of questions.
 */
export const getQuestions = async (): Promise<Question[]> => {
    return JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]')
}

/**
 * Updates an existing question in the localStorage.
 *
 * @param {Question} updatedQuestion - The updated question object.
 * @returns {Promise<void>}
 */
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

/**
 * Deletes a question by its ID from the localStorage.
 *
 * @param {number} id - The ID of the question to be deleted.
 * @returns {Promise<void>}
 */
export const deleteQuestion = async (id: number): Promise<void> => {
    const questions: Question[] = await getQuestions()
    const newQuestions = questions.filter((q) => q.id !== id)
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(newQuestions))
}
