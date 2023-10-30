import React from 'react'
import { useCurrentUser } from '../../stores/userStore.ts'
import '../../styles/Room.css'

interface ChatMessageProps {
    text: string
    sender: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, sender }) => {
    const { data: user } = useCurrentUser()
    // Check if the message sender is the current user
    const isSentByCurrentUser = user && sender === user.username

    return (
        <div className={`message-item-${isSentByCurrentUser ? 'sent' : 'received'}`}>
            <div className={`text-box-${isSentByCurrentUser ? 'sent' : 'received'}`}>{text}</div>
            {!isSentByCurrentUser && <div className='sender-info'>{sender}</div>}
        </div>
    )
}

export default ChatMessage
