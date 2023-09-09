import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getUser,
    getAllUsers,
    storeUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
} from '../services/users'

/**
 * Hook for getting users state from backend.
 *
 * The (re-)fetching of the users from the backend is done automatically.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const { data: users } = useAllUsers()
 *     // where `users: User[]`
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useAllUsers() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getAllUsers,
        initialData: [],
    })
}

/**
 * Hook for getting a specific user's state from the backend using its ID.
 *
 * The fetching of the user from the backend is done automatically.
 *
 * @param id The ID of the user to fetch.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const { data: user } = useUser('USER_ID')
 *     // where `user: User`
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useUser(id: string) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
    })
}

/**
 * Mutation-hook for storing a new user in the backend.
 *
 * Automatically refetches and updates the users state from the
 * `useAllUsers` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const storeUserMutation = useStoreUser()
 *
 *     const handleStoreUser = (newUser: Omit<User, 'user_id'>) => {
 *         storeUserMutation.mutate(newUser)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useStoreUser() {
    const queryClient = useQueryClient()
    return useMutation(storeUser, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
}

/**
 * Mutation-hook for updating an existing user in the backend.
 *
 * Automatically refetches and updates the users state from the
 * `useAllUsers` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const updateUserMutation = useUpdateUser()
 *
 *     const handleUpdateUser = (updatedUser: User) => {
 *         updateUserMutation.mutate(updatedUser)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useUpdateUser() {
    const queryClient = useQueryClient()
    return useMutation(updateUser, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
}

/**
 * Mutation-hook for deleting a specific user from the backend using its ID.
 *
 * Automatically refetches and updates the users state from the
 * `useAllUsers` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const deleteUserMutation = useDeleteUser()
 *
 *     const handleDeleteUser = (userId: string) => {
 *         deleteUserMutation.mutate(userId)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation(deleteUser, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
}

/**
 * Mutation-hook for deleting all users from the backend.
 *
 * Automatically refetches and updates the users state from the
 * `useAllUsers` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const deleteAllUsersMutation = useDeleteAllUsers()
 *
 *     const handleDeleteAllUsers = () => {
 *         deleteAllUsersMutation.mutate()
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useDeleteAllUsers() {
    const queryClient = useQueryClient()
    return useMutation(deleteAllUsers, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
}
