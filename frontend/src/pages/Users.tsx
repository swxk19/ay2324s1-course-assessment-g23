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
        if (!sessionDetails) navigate('/')
    }, [sessionDetails, navigate])

    return (
        <div>
            <Navbar />
            <UserTable />
        </div>
    )
}

export default Users
