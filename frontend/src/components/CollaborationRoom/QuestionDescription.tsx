import React from 'react'
import { useAllQuestions } from '../../stores/questionStore.ts'

const QuestionDescription: React.FC = () => {
    const { data: questions } = useAllQuestions()
    const easyQuestions = questions.filter((question) => question.complexity === 'Easy')
    const randomQuestion = easyQuestions[Math.floor(Math.random() * easyQuestions.length)]

    return (
        <div style={{ padding: '10px 20px' }}>
            <h2 style={{ margin: '0', fontWeight: 'normal', fontSize: '1.5rem' }}>
                {randomQuestion.title}
            </h2>
            <h2
                className={`complexity-color-${randomQuestion.complexity}`}
                style={{ margin: '0', fontSize: '1.25rem' }}
            >
                {randomQuestion.complexity}
            </h2>
            <pre
                id='alert-dialog-description'
                style={{
                    fontFamily: 'courier',
                    color: 'white',
                    whiteSpace: 'pre',
                }}
            >
                {randomQuestion.description}
            </pre>
        </div>
    )
}

export default QuestionDescription
