import React, { ChangeEvent, FormEvent, Fragment, useState, useEffect } from 'react'
import EditableRow from './EditableRow.tsx'
import ReadOnlyRow from './ReadOnlyRow.tsx'
import {
    deleteQuestion,
    Question,
    updateQuestion,
    getAllQuestions,
    storeQuestion, // Import storeQuestion function
} from '../services/questionBank.ts'

export const QuestionTable: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([])
    const [addFormData, setAddFormData] = useState<Omit<Question, 'id'>>({
        title: '',
        description: '',
        category: '',
        complexity: 'Easy',
    })
    const [editFormData, setEditFormData] = useState<Question | null>(null)

    useEffect(() => {
        getAllQuestions().then(setQuestions)
    }, [])

    const handleAddFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setAddFormData({
            ...addFormData,
            [name]: value,
        })
    }

    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        // @ts-ignore
        setEditFormData({
            ...editFormData,
            [name]: value,
        })
    }

    const handleAddFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // Save the new question to localStorage
        await storeQuestion(addFormData)
        await getAllQuestions().then(setQuestions)
    }

    const handleEditFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (editFormData) {
            // Update the edited question in localStorage
            await updateQuestion(editFormData)
            await getAllQuestions().then(setQuestions)
            setEditFormData(null)
        }
    }

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, question: Question) => {
        event.preventDefault()
        setEditFormData(question)
    }

    const handleCancelClick = () => {
        setEditFormData(null)
    }

    const handleDeleteClick = (questionId: string) => {
        const newQuestions: Question[] = [...questions]
        const index = questions.findIndex((question) => question.id === questionId)

        if (index !== -1) {
            newQuestions.splice(index, 1)

            // Delete the question from localStorage and save the updated list
            deleteQuestion(questionId)

            setQuestions(newQuestions)
        }
    }

    return (
        <div className='app-container'>
            <h2>PeerPrep</h2>
            <form onSubmit={handleEditFormSubmit}>
                <table className='question-table'>
                    <thead>
                        <tr>
                            <th className='id-col'>ID</th>
                            <th className='title-col'>Title</th>
                            <th className='category-col'>Category</th>
                            <th className='complexity-col'>Complexity</th>
                            <th className='actions-col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <Fragment key={question.id}>
                                {editFormData && editFormData.id === question.id ? (
                                    <EditableRow
                                        editFormData={editFormData}
                                        handleEditFormChange={handleEditFormChange}
                                        handleCancelClick={handleCancelClick}
                                    />
                                ) : (
                                    <ReadOnlyRow
                                        question={question}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </form>

            <h2>Add a Question</h2>
            <form onSubmit={handleAddFormSubmit}>
                <input
                    className='custom-id-input'
                    type='text'
                    name='id'
                    disabled
                    placeholder='ID'
                    onChange={handleAddFormChange}
                    value={'—'}
                />
                <input
                    className='custom-title-input'
                    type='text'
                    name='title'
                    required
                    placeholder='Title'
                    onChange={handleAddFormChange}
                    value={addFormData.title}
                />

                <input
                    className='custom-cat-input'
                    type='text'
                    name='category'
                    required
                    placeholder='Category'
                    onChange={handleAddFormChange}
                    value={addFormData.category}
                />
                <select
                    name='complexity'
                    required
                    value={addFormData.complexity}
                    onChange={handleAddFormChange}
                >
                    <option value='Easy'>Easy</option>
                    <option value='Medium'>Medium</option>
                    <option value='Hard'>Hard</option>
                </select>
                <div>
                    <textarea
                        className='custom-desc-input'
                        name='description'
                        required
                        placeholder='Description'
                        onChange={handleAddFormChange}
                        value={addFormData.description}
                    />
                </div>
                <div>
                    <button type='submit'>Add</button>
                </div>
            </form>
        </div>
    )
}
