import { Cancel, UnfoldMoreOutlined } from '@mui/icons-material'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ChangeEvent, FormEvent, Fragment, useState } from 'react'
import { type Question } from '../../api/questions.ts'
import {
    useAllQuestions,
    useDeleteQuestion,
    useStoreQuestion,
    useUpdateQuestion,
} from '../../stores/questionStore.ts'
import { useCurrentUser } from '../../stores/userStore.ts'
import '../../styles/AlertMessage.css'
import '../../styles/QuestionTable.css'
import AlertMessage from '../AlertMessage.tsx'
import DropdownSelect from './DropdownSelect.tsx'
import QuestionEditableRow from './QuestionEditableRow.tsx'
import { QuestionForm } from './QuestionForm.tsx'
import QuestionReadOnlyRow from './QuestionReadOnlyRow.tsx'

const QuestionTable: React.FC = () => {
    const { data: user } = useCurrentUser()
    const { data: questions } = useAllQuestions()
    const storeQuestionMutation = useStoreQuestion()
    const updateQuestionMutation = useUpdateQuestion()
    const deleteQuestionMutation = useDeleteQuestion()
    const [addFormData, setAddFormData] = useState<Omit<Question, 'question_id'>>({
        title: '',
        description: '',
        category: '',
        complexity: 'Easy',
    })
    const [editFormData, setEditFormData] = useState<Question | null>(null)
    const [showQuestionForm, setShowQuestionForm] = useState(false)
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Question
        direction: 'ascending' | 'descending'
    } | null>(null)
    const [complexityFilter, setComplexityFilter] = useState<null | 'Easy' | 'Medium' | 'Hard'>(
        null
    )

    const sortedQuestions = React.useMemo(() => {
        const complexityOrder = ['Easy', 'Medium', 'Hard']
        let filteredItems = [...questions]
        if (complexityFilter) {
            filteredItems = filteredItems.filter(
                (item: Question) => item.complexity === complexityFilter
            )
        }

        if (sortConfig !== null) {
            filteredItems.sort((a, b) => {
                if (sortConfig.key === 'complexity') {
                    const orderA = complexityOrder.indexOf(a.complexity)
                    const orderB = complexityOrder.indexOf(b.complexity)
                    return sortConfig.direction === 'ascending' ? orderA - orderB : orderB - orderA
                }

                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
                }
                return 0
            })
        }
        return filteredItems
    }, [questions, sortConfig])

    const requestSort = (key: keyof Question) => {
        let direction: 'ascending' | 'descending' = 'ascending'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const handleComplexityFilterChange = (selectedComplexity: string) => {
        if (selectedComplexity === 'All') {
            setComplexityFilter(null)
        } else {
            setComplexityFilter(selectedComplexity as 'Easy' | 'Medium' | 'Hard')
        }
        requestSort('complexity')
    }

    const resetComplexityFilter = () => {
        setComplexityFilter(null)
        requestSort('complexity')
    }

    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        // @ts-ignore
        setEditFormData({
            ...editFormData,
            [name]: value,
        })
    }

    const handleAddFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await storeQuestionMutation.mutateAsync(addFormData)
        setAddFormData({
            title: '',
            description: '',
            category: '',
            complexity: 'Easy',
        })
        setShowQuestionForm(false)
    }

    const handleEditFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!editFormData) return
        await updateQuestionMutation.mutateAsync(editFormData)
        setEditFormData(null)
    }

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, question: Question) => {
        event.preventDefault()
        setEditFormData(question)
    }

    const handleCancelClick = () => {
        setEditFormData(null)
    }

    const handleFormChange = (updatedData: Omit<Question, 'question_id'>) => {
        setAddFormData(updatedData)
    }

    const handleDeleteClick = (questionId: string) => deleteQuestionMutation.mutate(questionId)

    const isMaintainer = user?.role === 'maintainer'

    return (
        <div className='question-container'>
            <h2>Questions</h2>
            <form onSubmit={handleEditFormSubmit}>
                <div>
                    <DropdownSelect
                        options={['Easy', 'Medium', 'Hard']}
                        onOptionChange={handleComplexityFilterChange}
                        defaultOption={'Complexity'}
                    />
                </div>
                {complexityFilter && (
                    <div
                        className='reset-button'
                        id={complexityFilter}
                        onClick={resetComplexityFilter}
                    >
                        {complexityFilter}
                        <Cancel fontSize={'small'} sx={{ color: '#c2c2c2' }} />
                    </div>
                )}

                <table className='question-table'>
                    <thead>
                        <tr>
                            <th id='id-header'>
                                <div className='header'>
                                    ID
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('question_id')}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className='header'>
                                    Title
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('title')}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className='header'>
                                    Category
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('category')}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className='header'>
                                    Complexity
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('complexity')}
                                    />
                                </div>
                            </th>
                            {isMaintainer && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedQuestions.map((question) => (
                            <Fragment key={question.question_id}>
                                {editFormData &&
                                editFormData.question_id === question.question_id ? (
                                    <QuestionEditableRow
                                        editFormData={editFormData}
                                        handleEditFormChange={handleEditFormChange}
                                        handleCancelClick={handleCancelClick}
                                    />
                                ) : (
                                    <QuestionReadOnlyRow
                                        question={question}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                        hasActions={isMaintainer}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </form>

            {updateQuestionMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {updateQuestionMutation.error.detail}</h4>
                </AlertMessage>
            )}

            {deleteQuestionMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {deleteQuestionMutation.error.detail}</h4>
                </AlertMessage>
            )}
            {isMaintainer && (
                <>
                    <button onClick={() => setShowQuestionForm(true)}>Add a Question</button>
                    <AnimatePresence>
                        {showQuestionForm && (
                            <motion.div
                                key='token-menu'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <QuestionForm
                                    initialData={addFormData}
                                    onFormChange={handleFormChange}
                                    onSubmit={handleAddFormSubmit}
                                    onClose={() => setShowQuestionForm(false)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {storeQuestionMutation.isError && (
                        <AlertMessage variant='error'>
                            <h4>Oops! {storeQuestionMutation.error.detail}</h4>
                        </AlertMessage>
                    )}
                </>
            )}
        </div>
    )
}

export default QuestionTable
