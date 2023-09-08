/** URL for question bank API. */
const QUESTION_API_URL = 'http://localhost:8000/questions'

/** HTTP request headers for question bank API. */
const QUESTION_API_HEADER = { 'Content-Type': 'application/json' }

/** Represents a question in the question bank. */
export interface Question {
    /** The UUID for the question. */
    question_id: string
    /** The title of the question. */
    title: string
    /** The description of the question. */
    description: string
    /** Category associated with the question. */
    category: string
    /** The complexity level of the question. */
    complexity: 'Easy' | 'Medium' | 'Hard'
}

/**
 * Stores a new question.
 *
 * @param {Omit<Question, 'question_id'>} question
 * The question to store. All fields except ID are required.
 * @returns {Promise<string>} Resolves with the UUID for the stored question.
 */
export async function storeQuestion(question: Omit<Question, 'question_id'>): Promise<string> {
    try {
        const response = await fetch(QUESTION_API_URL, {
            method: 'POST',
            headers: QUESTION_API_HEADER,
            body: JSON.stringify(question),
        })

        if (!response.ok) throw new Error(response.statusText)

        const data: { question_id: string } = await response.json()
        return data.question_id
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Retrieves a question by its ID.
 *
 * @param {string} id The ID of the question to retrieve.
 * @returns {Promise<Question>} Resolves with the Question object if found.
 */
export async function getQuestion(id: string): Promise<Question> {
    try {
        const response = await fetch(`${QUESTION_API_URL}/${id}`, {
            method: 'GET',
            headers: QUESTION_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)

        const data: Question = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Retrieves all questions.
 *
 * @returns {Promise<Question[]>} An array of questions.
 */
export async function getAllQuestions(): Promise<Question[]> {
    try {
        const response = await fetch(`${QUESTION_API_URL}/all`, {
            method: 'GET',
            headers: QUESTION_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)

        const data: Question[] = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Updates an existing question by its ID.
 *
 * @param {Pick<Question, 'question_id'> & Partial<Omit<Question, 'question_id'>>} updatedQuestion
 * Question with the fields to update. All fields except `id` are optional.
 * @returns {Promise<void>} Resolves when the question is successfully updated.
 */
export async function updateQuestion(
    updatedQuestion: Pick<Question, 'question_id'> & Partial<Omit<Question, 'question_id'>>
): Promise<void> {
    try {
        const response = await fetch(QUESTION_API_URL, {
            method: 'PUT',
            headers: QUESTION_API_HEADER,
            body: JSON.stringify(updatedQuestion),
        })

        if (!response.ok) throw new Error(response.statusText)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Deletes a question by its ID.
 *
 * @param {string} id The ID of the question to be deleted.
 * @returns {Promise<void>} Resolves when the question is successfully deleted.
 */
export async function deleteQuestion(id: string): Promise<void> {
    try {
        const response = await fetch(`${QUESTION_API_URL}/${id}`, {
            method: 'DELETE',
            headers: QUESTION_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Deletes all questions.
 *
 * @returns {Promise<void>} Resolves when all questions are successfully deleted.
 */
export async function deleteAllQuestions(): Promise<void> {
    try {
        const response = await fetch(`${QUESTION_API_URL}/all`, {
            method: 'DELETE',
            headers: QUESTION_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}
