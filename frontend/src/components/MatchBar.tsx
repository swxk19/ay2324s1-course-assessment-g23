import React, { useState } from 'react'
import '../styles/MatchBar.css'
import { Info, Star, Whatshot } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import MatchingScreen from './MatchingScreen.tsx'
import MatchingStatusBar from './MatchingStatusBar.tsx'
import { useSessionDetails } from '../stores/sessionStore.ts'
import { useUser } from '../stores/userStore.ts'

const tooltipDescription =
    'Select a difficulty level and get matched with another user. ' +
    'Together, you both will collaboratively attempt a question of the chosen difficulty.'
const MatchBar: React.FC = () => {
    const { data: sessionDetails } = useSessionDetails()
    const { data: user } = useUser(sessionDetails?.user_id)
    const [findMatch, setFindMatch] = useState(false)
    const [difficulty, setDifficulty] = useState<string>('')
    const [isMatchingScreenVisible, setMatchingScreenVisible] = useState(false)
    const [isMatchingStatusBarVisible, setMatchingStatusBarVisible] = useState(false)

    const startFindMatch = (difficulty: string) => {
        setFindMatch(true)
        setMatchingScreenVisible(true)
        setDifficulty(difficulty)
    }

    const stopFindMatch = () => {
        setFindMatch(false)
        setMatchingScreenVisible(false)
        setMatchingStatusBarVisible(false)
    }

    const handleMinimise = () => {
        setMatchingScreenVisible(false)
        setMatchingStatusBarVisible(true)
    }

    return (
        <>
            <span className='matchbar-container'>
                <div className='welcome'>
                    <h2>Welcome back, {user?.username}!</h2>
                </div>
                <div className='match'>
                    {!findMatch && (
                        <>
                            <div className='match-title'>
                                <h2>Find a Match</h2>
                                <Whatshot fontSize='large' />
                                <Tooltip title={tooltipDescription} style={{ fontSize: '1.5rem' }}>
                                    <Info style={{ opacity: '0.5', marginLeft: '0.5rem' }} />
                                </Tooltip>
                            </div>
                            <div className='match-button-container'>
                                <button
                                    className='match-button'
                                    id='easy'
                                    onClick={() => startFindMatch('Easy')}
                                >
                                    <div className='icon-text-wrapper'>
                                        <Star />
                                        Easy
                                    </div>
                                </button>
                                <button
                                    className='match-button'
                                    id='medium'
                                    onClick={() => startFindMatch('Medium')}
                                >
                                    <Star />
                                    <Star />
                                    Medium
                                </button>
                                <button
                                    className='match-button'
                                    id='hard'
                                    onClick={() => startFindMatch('Hard')}
                                >
                                    <Star />
                                    <Star />
                                    <Star />
                                    Hard
                                </button>
                            </div>
                        </>
                    )}
                    {isMatchingStatusBarVisible && (
                        <MatchingStatusBar
                            difficulty={difficulty}
                            onMatchExit={() => stopFindMatch()}
                        />
                    )}
                </div>
            </span>
            {isMatchingScreenVisible && (
                <MatchingScreen
                    difficulty={difficulty}
                    onMatchExit={() => stopFindMatch()}
                    onMinimise={handleMinimise}
                />
            )}
        </>
    )
}

export default MatchBar
