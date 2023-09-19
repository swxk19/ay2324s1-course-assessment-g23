import '../styles/EditProfile.css'
import React from 'react'

interface EditProfileProps {
    onClose: () => void
}
const EditProfile: React.FC<EditProfileProps> = ({ onClose }) => {
    return (
        <div className='dark-overlay' onClick={onClose}>
            <div className='edit-profile-card'>Hello</div>
        </div>
    )
}

export default EditProfile
