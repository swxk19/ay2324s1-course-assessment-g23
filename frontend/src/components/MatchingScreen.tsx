import { motion } from "framer-motion";
import React from "react";

type MatchingScreenProps = {
    difficulty: string
    onMatchExit: () => void

}
const MatchingScreen:React.FC<MatchingScreenProps> = ({difficulty, onMatchExit: onMatchExit}) => {

    return (
        <div className='dark-overlay'>
            <div className='home-page-container'>
                <h1 style={{ marginBottom: '10rem' }}>
                    Finding a Match...
                </h1>
                <motion.div
                    className="box"
                    animate={{
                        scale: [1, 2, 2, 1, 1],
                        rotate: [0, 0, 180, 180, 0],
                        borderRadius: ["0%", "0%", "50%", "50%", "0%"]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.5, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 1
                    }}
                />
                <h2  style={{ marginTop: '10rem' }}>
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