import '../styles/EditProfile.css'
import React from 'react'

interface EditProfileProps {
    onClose: () => void
}
const EditProfile: React.FC<EditProfileProps> = ({ onClose }) => {
    const handleSubmit = () => {
        // insert edit profile logic
    }

    return (
        <div className='dark-overlay' onClick={onClose}>
            <div className='edit-profile-card' onClick={(e) => e.stopPropagation()}>
                <h2>Edit your profile</h2>
                <form onSubmit={handleSubmit}>
                    <input name='username' required placeholder='Username' />
                    <input name='email' required placeholder='Email' />
                    <input name='password' required placeholder='Password' />
                    <button>Save</button>
                </form>
            </div>
        </div>
    )
}

export default EditProfile
