import { Link } from 'react-router-dom'
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";


const Room = () => {
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
                    <ReactCodeMirror
                        theme={vscodeDark}
                        height='100vh'
                        extensions={[javascript()]}
                    />
                </div>
            </div>
        </div>
    )
}

export default Room
