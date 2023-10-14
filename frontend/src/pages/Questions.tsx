import { QuestionTable } from '../components/QuestionTable/QuestionTable.tsx'
import Navbar from '../components/Navbar.tsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionDetails } from '../stores/sessionStore.ts'
import MatchBar from '../components/MatchBar.tsx'
import {motion, useScroll, useSpring} from "framer-motion";

const Questions = () => {
    const { data: sessionDetails } = useSessionDetails()
    const isUser = sessionDetails?.role === 'normal'
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const navigate = useNavigate()

    // Redirect if not logged in.
    useEffect(() => {
        const isNotLoggedIn = sessionDetails === null
        if (isNotLoggedIn) navigate('/')
    }, [sessionDetails, navigate])

    return (
        <>
            <Navbar />
            <motion.div className="progress-bar" style={{ scaleX }} />

            <div className='question-page-container'>
                {isUser && <MatchBar />}
                <QuestionTable />
            </div>
        </>
    )
}

export default Questions
