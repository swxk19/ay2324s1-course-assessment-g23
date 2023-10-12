import React from "react";
import Loader from "./Loader.tsx";

type MatchingScreenProps = {
    difficulty: string
    onMatchExit: () => void

}
const MatchingScreen:React.FC<MatchingScreenProps> = ({difficulty, onMatchExit: onMatchExit}) => {

    return (
        <div className='dark-overlay' style={{ backgroundColor: 'black', opacity:' 90%' }}>
            <div className='home-page-container'>
                <h1 style={{ marginBottom: '5rem' }}>
                    Finding a Match...
                </h1>
                <Loader />
                <h2  style={{ marginTop: '5rem' }}>
                    Selected difficulty: <span className={`complexity-color-${difficulty}`}>{difficulty}</span>
                </h2>
                <button onClick={onMatchExit} style={{ backgroundColor:'#ff2945'}}>
                    Exit matchmaking
                </button>
            </div>
        </div>

    );
}

export default MatchingScreen;