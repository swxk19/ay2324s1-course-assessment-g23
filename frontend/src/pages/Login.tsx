import '../styles/LoginPage.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLoginUser, useSessionDetails } from '../stores/sessionStore'
import AlertMessage from '../components/AlertMessage'

const Login = () => {
    const { data: sessionDetails } = useSessionDetails()
    const loginUserMutation = useLoginUser()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Redirect if already logged in.
    useEffect(() => {
        const isLoggedIn = sessionDetails !== null
        if (isLoggedIn) navigate('/questions')
    }, [sessionDetails, navigate])

    const handleLogin = async () => {
        loginUserMutation.mutate({ username, password })
    }

    return (
        <>
            <span className='home-page-container'>
                <div className='info-container'>
                    <h1>Welcome to PeerPrep!</h1>
                    <h3>
                        Level up your coding skills with a variety of challenging questions.
                        Practice with peers and excel together.
                    </h3>
                </div>
                <div className='login-container'>
                    <img src='../../peerprep.png' />
                    <h2>Login to your account</h2>
                    <form className='login-form' onSubmit={(e) => e.preventDefault()}>
                        <input
                            placeholder='Username'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <input
                            placeholder='Password'
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button onClick={handleLogin}>Log in</button>
                        <h4 style={{ textAlign: 'left', display: 'inline-block' }}>
                            Don't have an account?&nbsp;
                        </h4>
                        <Link to='/signup'>Sign up</Link>
                    </form>
                </div>
            </span>
            {loginUserMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {loginUserMutation.error.detail}</h4>
                </AlertMessage>
            )}
        </>
    )
}

export default Login
