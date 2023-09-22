import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userLogin, userLogout, SessionDetails, getSession } from '../api/auth'
import { ApiError } from '../api/error'

/**
 * Hook for getting session details from the query cache.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const { data: sessionDetails } = useSessionDetails()
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useSessionDetails() {
    return useQuery<SessionDetails | null, ApiError>({
        queryKey: ['session'],
        queryFn: getSession,
        initialData: null,
    })
}

/**
 * Hook for logging in a user and maintaining the session details in the query cache.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const loginUserMutation = useLoginUser()
 *
 *     const handleLogin = (
 *         credentials: { username: string, password: string }
 *     ) => {
 *         loginUserMutation.mutate(credentials)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useLoginUser() {
    const queryClient = useQueryClient()

    return useMutation(userLogin, {
        onSuccess: (data) => {
            queryClient.setQueryData(['session'], data)
        },
        onError: (error: ApiError) => {},
    })
}

/**
 * Hook for logging out a user and removing the session details from the query cache.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const logoutUserMutation = useLogoutUser()
 *
 *     const handleLogout = () => {
 *         logoutUserMutation.mutate()
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useLogoutUser() {
    const queryClient = useQueryClient()

    return useMutation(userLogout, {
        onSettled: () => {
            queryClient.setQueryData(['session'], null)
        },
        onError: (error: ApiError) => {},
    })
}
