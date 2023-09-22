import '../styles/LoginPage.css'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const handleLogin = () => {
        // insert authentication logic
        // add error message if username not found or password is incorrect
        navigate('/questions')
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
                    <form className='login-form'>
                        <input placeholder='Username' />
                        <input placeholder='Password' type='password' />
                        <button onClick={handleLogin}>Log in</button>
                        <h4 style={{ textAlign: 'left', display: 'inline-block' }}>
                            Don't have an account?&nbsp;
                        </h4>
                        <Link to='/signup'>Sign up</Link>
                    </form>
                </div>
            </span>
        </>
    )
}

export default Login
