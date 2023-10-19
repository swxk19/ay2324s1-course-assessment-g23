import { ApiError } from './error'
import type { Complexity } from './questions'

/** URL for matching websocket API. */
const MATCHING_API_URL = 'ws://localhost:8000/ws'

export interface MatchingRequest {
    user_id: string
    complexity: Complexity
}

interface QueuePayload {
    user_id: string
    complexity: Lowercase<Complexity>
    action: 'queue'
}
interface CancelPayload {
    user_id: string
    action: 'cancel'
}

type MatchingRequestPayload = QueuePayload | CancelPayload

interface MatchingResponsePayload {
    is_matched: boolean
    user_id: string
}

let ws: WebSocket | null = null

export async function getMatch(matchRequest: MatchingRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        if (ws !== null) return reject(new ApiError(4000, 'A match is already ongoing.'))

        ws = new WebSocket(MATCHING_API_URL)

        ws.onopen = () => {
            const payload: MatchingRequestPayload = {
                user_id: matchRequest.user_id,
                complexity: matchRequest.complexity.toLowerCase() as Lowercase<Complexity>,
                action: 'queue',
            }
            ws!.send(JSON.stringify(payload))
        }

        ws.onmessage = (event) => {
            const responsePayload: MatchingResponsePayload = JSON.parse(event.data)
            if (responsePayload.is_matched) resolve(responsePayload.user_id)
            else reject(new ApiError(4001, 'No match'))
            ws!.close()
            ws = null
        }

        ws.onclose = () => {
            reject(new ApiError(4002, 'Connection died'))
            ws = null
        }
    })
}

export async function cancelMatch(user_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (ws === null) return reject(new ApiError(4000, 'No match to cancel.'))

        const payload: MatchingRequestPayload = {
            user_id,
            action: 'cancel',
        }
        ws.send(JSON.stringify(payload))
        resolve()
    })
}
