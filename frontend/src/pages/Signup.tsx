import { ChangeEvent, FormEvent, useState } from 'react'
import { User } from '../services/users.ts'
import '../styles/SignupPage.css'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const [addNewUser, setAddNewUser] = useState<Omit<User, 'user_id'>>({
        username: '',
        password: '',
        email: '',
    })
    const navigate = useNavigate()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // Insert signup logic using addNewUser data
        // User will be redirected to login page
        navigate('/')
    }

    const handleAddUserChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setAddNewUser({
            ...addNewUser,
            [name]: value,
        })
    }
    return (
        <div className='signup-page'>
            <div className='signup-box'>
                <img src='../../public/peerprep.png' alt='PeerPrep Logo' />
                <h3>Sign up for PeerPrep and enhance your coding skills with your peers.</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        name='username'
                        required
                        placeholder='Username'
                        onChange={handleAddUserChange}
                        value={addNewUser.username}
                    />
                    <input
                        name='password'
                        required
                        placeholder='Password'
                        onChange={handleAddUserChange}
                        value={addNewUser.password}
                    />
                    <input
                        name='email'
                        required
                        placeholder='Email'
                        onChange={handleAddUserChange}
                        value={addNewUser.email}
                    />
                    <button>Sign up</button>
                    <h4 style={{ textAlign: 'left', display: 'inline-block' }}>
                        Have an account?&nbsp;
                    </h4>
                    <Link to='/'>Log in</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup
