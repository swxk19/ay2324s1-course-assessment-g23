import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '../api/error'
import { cancelMatch, getMatch } from '../api/matching'
import { Complexity } from '../api/questions'
import { useSessionDetails } from './sessionStore'

export function useMatch() {
    return useQuery<string | null, ApiError>({
        queryKey: ['matching'],
        initialData: null,
        enabled: false,
    })
}

export function useJoinQueue() {
    const { data: session } = useSessionDetails()
    const queryClient = useQueryClient()
    return useMutation(
        async (complexity: Complexity) => {
            if (!session) return null
            return await getMatch({ user_id: session.user_id, complexity })
        },
        {
            onSuccess: (data) => {
                queryClient.setQueryData(['matching'], data)
            },
            onError: (error: ApiError) => {},
        }
    )
}

export function useCancelQueue() {
    const { data: session } = useSessionDetails()
    const queryClient = useQueryClient()
    return useMutation(
        async () => {
            if (!session) return null
            return await cancelMatch(session.user_id)
        },
        {
            onSuccess: () => {
                queryClient.setQueryData(['matching'], null)
            },
            onError: (error: ApiError) => {},
        }
    )
}
