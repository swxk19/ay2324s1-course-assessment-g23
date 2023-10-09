import React from 'react'
import '../styles/MatchBar.css'
import { Info, Star, Whatshot } from '@mui/icons-material'
import { Tooltip } from '@mui/material'

const tooltipDescription =
    'Select a difficulty level and get matched with another user. ' +
    'Together, you both will collaboratively attempt a question of the chosen difficulty.'
const MatchBar: React.FC = () => {
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
                    <button className='match-button' id='easy'>
                        <div className='icon-text-wrapper'>
                            <Star />
                            Easy
                        </div>
                    </button>
                    <button className='match-button' id='medium'>
                        <Star />
                        <Star />
                        Medium
                    </button>
                    <button className='match-button' id='hard'>
                        <Star />
                        <Star />
                        <Star />
                        Hard
                    </button>
                </div>
            </div>
        </span>
    )
}

export default MatchBar
