import React from 'react'

const QuestionDescription: React.FC = () => {
    return (
        <div style={{ padding: '10px 20px' }}>
            <h2 style={{ margin: '0', fontWeight: 'normal', fontSize: '1.5rem' }}>
                Question Title
            </h2>
            <h2 className={`complexity-color-Easy`} style={{ margin: '0', fontSize: '1.25rem' }}>
                Easy
            </h2>
            <div style={{ marginTop: '1.5rem' }}>Question description</div>
        </div>
    )
}

export default QuestionDescription
