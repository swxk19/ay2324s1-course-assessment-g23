import { Link } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor/CodeEditor'

export const Room = () => {
    return (
        <div>
            <nav className='nav'>
                <Link to='/questions' className='site-title'>
                    PeerPrep
                </Link>
            </nav>
            <div className='split-container'>
                <div className='pane' style={{ paddingLeft: '30px'}}>
                    Question Placeholder
                </div>
                <div className='pane'>
                <CodeEditor />
                </div>
            </div>
        </div>
    )
}

export default Room
