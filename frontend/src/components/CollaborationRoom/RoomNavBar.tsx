import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import QuestionList from './QuestionList.tsx'

interface Props {
    onExitClick: () => void
}

const RoomNavBar: React.FC<Props> = ({ onExitClick }) => {
    const [showQuestionList, setShowQuestionList] = useState(false)
    return (
        <>
            <nav className='nav' style={{ padding: '8px 20px' }}>
                <img src='../../peerprep.png' width='40' height='40' alt='PeerPrep Logo' />
                <button className='problem-button' onClick={() => setShowQuestionList(true)}>
                    <FormatListBulletedIcon sx={{ fontSize: '20px' }} />
                    <h2
                        style={{
                            margin: '0',
                            padding: '0',
                            fontWeight: '500',
                            fontSize: '1rem',
                        }}
                    >
                        Problem List
                    </h2>
                </button>

                <button
                    style={{ backgroundColor: '#fe375f', width: '200px', marginLeft: 'auto' }}
                    onClick={onExitClick}
                >
                    Exit Room
                </button>
            </nav>
            <AnimatePresence>
                {showQuestionList && <QuestionList onClose={() => setShowQuestionList(false)} />}
            </AnimatePresence>
        </>
    )
}

export default RoomNavBar
