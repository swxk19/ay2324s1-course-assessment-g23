import CodeEditor from '../components/CodeEditor/CodeEditor'

export const Room = () => {
    return (
        <div>
            <nav className='nav' style={{ padding: ' 8px 20px' }}>
                <h2
                    style={{
                        margin: '0 0 0 2rem',
                        padding: '0',
                        fontWeight: '500',
                        fontSize: '2rem',
                    }}
                >
                    PeerPrep
                </h2>
                <button style={{ backgroundColor: '#fe375f', width: '200px', margin: '0' }}>
                    Exit Room
                </button>
            </nav>
            <div className='split-container' style={{ padding: '20px' }}>
                <div
                    className='pane'
                    style={{
                        backgroundColor: '#303030',
                        marginRight: '10px',
                        padding: '1.5rem 2rem',
                    }}
                >
                    <h2 style={{ margin: '0', fontWeight: 'normal', fontSize: '1.75rem' }}>
                        Question Title
                    </h2>
                    <h2
                        className={`complexity-color-Easy`}
                        style={{ margin: '0', fontSize: '1.25rem' }}
                    >
                        Easy
                    </h2>
                    <div style={{ marginTop: '1.5rem' }}>Question description</div>
                </div>
                <div className='pane' style={{ backgroundColor: '#303030', marginLeft: '10px' }}>
                    <CodeEditor />
                </div>
            </div>
        </div>
    )
}

export default Room
