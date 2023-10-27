import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { SessionDetails, getSession, userLogin, userLogout } from '../api/auth'
import { ApiError } from '../api/error'
import { storeUser } from '../api/users'

const SESSION_ID_COOKIE_NAME = 'session_id'

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
        queryFn: async () => {
            const hasSessionIdCookie = Cookies.get(SESSION_ID_COOKIE_NAME) !== undefined
            if (!hasSessionIdCookie) return null

            const sessionDetails = await getSession()
            // If `session_id` cookie is stale, remove stale cookie.
            if (sessionDetails === null) Cookies.remove(SESSION_ID_COOKIE_NAME)
            return sessionDetails
        },
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] })
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
        onSuccess: () => {
            Cookies.remove(SESSION_ID_COOKIE_NAME)
            queryClient.setQueryData(['session'], null)
        },
        onError: (error: ApiError) => {},
    })
}

/**
 * Hook for signing up a new user.
 *
 * @example
 * ```tsx
 * const MyComponent: React.FC = () => {
 *     const signupUserMutation = useSignupUser()
 *
 *     const handleSignup = (signupDetails: UserSignupDetails) => {
 *         signupUserMutation.mutate(signupDetails)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useSignupUser() {
    return useMutation(storeUser, {
        onError: (error: ApiError) => {},
    })
}
