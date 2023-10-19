import UserTable from '../components/UserTable/UserTable.tsx'
import Navbar from '../components/Navbar.tsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionDetails } from '../stores/sessionStore.ts'

const Users = () => {
    const { data: sessionDetails } = useSessionDetails()
    const navigate = useNavigate()

    // Redirect if not logged in.
    useEffect(() => {
        const hasAccessToPage = sessionDetails !== null && sessionDetails.role === 'maintainer'
        if (!hasAccessToPage) navigate('/')
    }, [sessionDetails, navigate])

    return (
        <>
            <Navbar />
            <UserTable />
        </>
    )
}

export default Users
