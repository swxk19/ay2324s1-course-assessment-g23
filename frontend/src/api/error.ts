/**
 * Represents the structure of the error response from the API.
 */
export interface ApiErrorResponse {
    detail: string
}

/**
 * Represents an error returned by the API.
 *
 * Include information about the error returned by the API, specifically the
 * HTTP status code (`this.status: number`) and the error message that the
 * frontend is suppose to display (`this.detail: string`).
 */
export class ApiError extends Error {
    status: number
    detail: string

    /**
     * @param {number} status The HTTP status code of the error.
     * @param {string} detail The error message to be displayed in frontend, returned by the API.
     */
    constructor(status: number, detail: string) {
        super(`API Error (Status: ${status}): ${detail ?? 'An unexpected error occurred'}`)
        this.status = status
        this.detail = detail
    }

    /**
     * Parses the API response to create an `ApiError` instance.
     *
     * This method should only be called when the response indicates an error
     * (i.e., `response.ok` is false). It reads the JSON body of the response to
     * get the detailed error message.
     *
     * @param {Response} response The response to parse.
     * @returns {Promise<ApiError>} Resolves with an ApiError instance representing the error.
     * @throws {Error} Throws an error if called with a response that does not have an error.
     * @throws {SyntaxError} Throws a SyntaxError if the response cannot be parsed as JSON.
     */
    static async parseResponse(response: Response): Promise<ApiError> {
        if (response.ok) throw Error('Attempting to parse a response that has no error.')

        const json: ApiErrorResponse = await response.json()
        return new ApiError(response.status, json.detail)
    }
}
