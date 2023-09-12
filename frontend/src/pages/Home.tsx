import "../styles/HomePage.css"

const Home = () => {
    return (
        <>
            <span className="home-page-container">
                <div className='info-container'>
                    <h1>Welcome to PeerPrep!</h1>
                    <h3>Level up your coding skills with a variety of challenging questions.
                        Practice with peers and excel together.</h3>
                </div>
                <div className='login-container'>
                    <img src="../../public/peerprep.png"/>
                    <h2>Login to your account</h2>
                    <form className='login-form'>
                        <input
                            placeholder='Username'
                        />
                        <input
                            placeholder='Password'
                            type='password'
                        />
                        <button>Log in</button>
                        <h4 style={{textAlign: 'left', display: 'inline-block'}}>Don't have an account?</h4>
                        <a className='sign-up-link'>Sign up</a>
                    </form>
                </div>
            </span>
        </>
)


}


export default Home;