import { QuestionTable } from '../components/QuestionTable/QuestionTable.tsx'
import Navbar from '../components/Navbar.tsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionDetails } from '../stores/sessionStore.ts'

const Questions = () => {
    const { data: sessionDetails } = useSessionDetails()
    const navigate = useNavigate()

    // Redirect if not logged in.
    useEffect(() => {
        const isNotLoggedIn = sessionDetails === null
        if (isNotLoggedIn) navigate('/')
    }, [sessionDetails, navigate])

    return (
        <>
            <Navbar />
            <QuestionTable />
        </>
    )
}

export default Questions
