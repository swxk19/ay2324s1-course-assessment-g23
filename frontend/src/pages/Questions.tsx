import { QuestionTable } from '../components/QuestionTable/QuestionTable.tsx'
import Navbar from '../components/Navbar.tsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionDetails } from '../stores/sessionStore.ts'
import MatchBar from '../components/MatchBar.tsx'
import { TimerProvider } from '../components/TimerProvider.tsx'

const Questions = () => {
    const { data: sessionDetails } = useSessionDetails()
    const isUser = sessionDetails?.role === 'normal'

    const navigate = useNavigate()

    // Redirect if not logged in.
    useEffect(() => {
        const isNotLoggedIn = sessionDetails === null
        if (isNotLoggedIn) navigate('/')
    }, [sessionDetails, navigate])

    return (
        <>
            <Navbar />
            <div className='question-page-container'>
                {isUser && <TimerProvider><MatchBar /></TimerProvider>}
                <QuestionTable />
            </div>
        </>
    )
}

export default Questions
