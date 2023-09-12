/** URL for users API. */
const USERS_API_URL = 'http://localhost:8000/users'

/** HTTP request headers for users API. */
const USERS_API_HEADER = { 'Content-Type': 'application/json' }

/** Represents a user. */
export interface User {
    user_id: string
    username: string
    email: string
    password: string
    role: string
}

/**
 * Stores a new user.
 *
 * @param {Omit<User, 'user_id'>} user
 * The user to store. All fields except ID are required.
 * @returns {Promise<string>} Resolves with the UUID for the stored user.
 */
export async function storeUser(user: Omit<User, 'user_id'>): Promise<string> {
    try {
        const response = await fetch(USERS_API_URL, {
            method: 'POST',
            headers: USERS_API_HEADER,
            body: JSON.stringify(user),
        })

        if (!response.ok) throw new Error(response.statusText)

        const data: Pick<User, 'user_id'> = await response.json()
        return data.user_id
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Retrieves a user by its ID.
 *
 * @param {string} id The ID of the user to retrieve.
 * @returns {Promise<User>} Resolves with the User object if found.
 */
export async function getUser(id: string): Promise<User> {
    try {
        const response = await fetch(`${USERS_API_URL}/${id}`, {
            method: 'GET',
            headers: USERS_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)

        const data: User = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Retrieves all users.
 *
 * @returns {Promise<User[]>} An array of users.
 */
export async function getAllUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${USERS_API_URL}/all`, {
            method: 'GET',
            headers: USERS_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)

        const data: User[] = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Updates an existing user by its ID.
 *
 * @param {Pick<User, 'user_id'> & Partial<Omit<User, 'user_id'>>} updatedUser
 * User with the fields to update. All fields except `id` are optional.
 * @returns {Promise<void>} Resolves when the user is successfully updated.
 */
export async function updateUser(
    updatedUser: Pick<User, 'user_id'> & Partial<Omit<User, 'user_id'>>
): Promise<void> {
    try {
        const response = await fetch(USERS_API_URL, {
            method: 'PUT',
            headers: USERS_API_HEADER,
            body: JSON.stringify(updatedUser),
        })

        if (!response.ok) throw new Error(response.statusText)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Deletes a user by its ID.
 *
 * @param {string} id The ID of the user to be deleted.
 * @returns {Promise<void>} Resolves when the user is successfully deleted.
 */
export async function deleteUser(id: string): Promise<void> {
    try {
        const response = await fetch(`${USERS_API_URL}/${id}`, {
            method: 'DELETE',
            headers: USERS_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}

/**
 * Deletes all users.
 *
 * @returns {Promise<void>} Resolves when all users are successfully deleted.
 */
export async function deleteAllUsers(): Promise<void> {
    try {
        const response = await fetch(`${USERS_API_URL}/all`, {
            method: 'DELETE',
            headers: USERS_API_HEADER,
        })

        if (!response.ok) throw new Error(response.statusText)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        throw error
    }
}
