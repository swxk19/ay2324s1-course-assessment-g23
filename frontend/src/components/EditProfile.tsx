import { User } from '../api/users'
import { useUpdateUser } from '../stores/userStore'
import '../styles/EditProfile.css'
import React, { useState } from 'react'

interface EditProfileProps {
    user: User
    onClose: () => void
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onClose }) => {
    const updateUserMutation = useUpdateUser()
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateUserMutation.mutateAsync({
            ...user,
            username,
            email,
            password: password || user.password,
        })
        onClose()
    }

    return (
        <div className='dark-overlay' onClick={onClose}>
            <div className='edit-profile-card' onClick={(e) => e.stopPropagation()}>
                <h2>Edit your profile</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name='username'
                        required
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        name='email'
                        required
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        name='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button>Save</button>
                </form>
            </div>
        </div>
    )
}

export default EditProfile
