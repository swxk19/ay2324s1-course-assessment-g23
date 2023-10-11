import React, {useState} from 'react'
import '../styles/MatchBar.css'
import { Info, Star, Whatshot } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import MatchingScreen from "./MatchingScreen.tsx";

const tooltipDescription =
    'Select a difficulty level and get matched with another user. ' +
    'Together, you both will collaboratively attempt a question of the chosen difficulty.'
const MatchBar: React.FC = () => {
    const [findMatch, setFindMatch] = useState(false)
    const [difficulty, setDifficulty] = useState<string>('')

    const openFindMatch = (difficulty: string) => {
        setFindMatch(true)
        setDifficulty(difficulty)
    }

    return (
        <span className='matchbar-container'>
            <div className='welcome'>
                <h2>Welcome back, user123!</h2>
            </div>

            <div className='match'>
                <div className='match-title'>
                    <h2>Find a Match</h2>
                    <Whatshot fontSize='large' />
                    <Tooltip title={tooltipDescription} style={{ fontSize: '1.5rem' }}>
                        <Info style={{ opacity: '0.5', marginLeft: '0.5rem' }} />
                    </Tooltip>
                </div>
                <div className='match-button-container'>
                    <button className='match-button' id='easy' onClick={() => openFindMatch('Easy')}>
                        <div className='icon-text-wrapper'>
                            <Star />
                            Easy
                        </div>
                    </button>
                    <button className='match-button' id='medium' onClick={() => openFindMatch('Medium')}>
                        <Star />
                        <Star />
                        Medium
                    </button>
                    <button className='match-button' id='hard' onClick={() => openFindMatch('Hard')}>
                        <Star />
                        <Star />
                        <Star />
                        Hard
                    </button>
                </div>
                {findMatch && <MatchingScreen difficulty={difficulty} onMatchExit={() => setFindMatch(false)}/>}
            </div>
        </span>
    )
}

export default MatchBar
