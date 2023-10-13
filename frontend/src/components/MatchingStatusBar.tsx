import TinyLoader from './TinyLoader.tsx'
import React from 'react'

type MatchingScreenProps = {
    difficulty: string
    onMatchExit: () => void
}
const MatchingStatusBar: React.FC<MatchingScreenProps> = ({
    difficulty,
    onMatchExit: onMatchExit,
}) => {
    return (
        <>
            <div
                className={`nav bg-complexity-color-${difficulty}`}
                style={{
                    padding: '10px 15px',
                    fontWeight: 'bold',
                    height: '100%',
                    borderRadius: 'inherit',
                }}
            >
                Searching for a match...
                <TinyLoader />
                <button
                    onClick={onMatchExit}
                    style={{
                        marginRight: '0',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: 'transparent',
                    }}
                >
                    Exit Matchmaking
                </button>
            </div>
        </>
    )
}

export default MatchingStatusBar
