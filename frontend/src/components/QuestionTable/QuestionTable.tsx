import { Add, ArrowUpward, Cancel, UnfoldMoreOutlined } from '@mui/icons-material'
import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import { type Question } from '../../api/questions.ts'
import {
    createRequestSort,
    filterByCategory,
    filterByComplexity,
    filterBySearchTerm,
    sortItems,
} from '../../api/sortingAndFiltering.ts'
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
import DropdownTabs from './DropdownTabs.tsx'
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
    } | null>({
        key: 'complexity',
        direction: 'ascending',
    })
    const [complexityFilter, setComplexityFilter] = useState<null | 'Easy' | 'Medium' | 'Hard'>(
        null
    )
    const [categoryFilter, setCategoryFilter] = useState<null | string>(null)
    const categoriesList: string[] = [
        'Algorithms',
        'Arrays',
        'Bit Manipulation',
        'Brainteaser',
        'Databases',
        'Data Structures',
        'Recursion',
        'Strings',
    ]
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [showTopBtn, setShowTopBtn] = useState(false)
    const requestSort = createRequestSort(setSortConfig)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true)
            } else {
                setShowTopBtn(false)
            }
        })
    }, [])

    const filteredAndSortedQuestions = React.useMemo(() => {
        let filteredItems = [...questions]
        filteredItems = filterByComplexity(filteredItems, complexityFilter)
        filteredItems = filterByCategory(filteredItems, categoryFilter)
        filteredItems = filterBySearchTerm(filteredItems, searchTerm)
        filteredItems = sortItems(filteredItems, sortConfig)
        return filteredItems
    }, [questions, sortConfig, complexityFilter, categoryFilter, searchTerm])

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
        console.log('hello')
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

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const isMaintainer = user?.role === 'maintainer'

    return (
        <div className='question-container'>
            <h2>Questions</h2>
            <div className='dropdown-row'>
                {isMaintainer && (
                    <>
                        <button
                            className='add-question-button'
                            onClick={() => setShowQuestionForm(true)}
                        >
                            Add a Question
                            <Add fontSize={'small'} />
                        </button>
                        {showQuestionForm && (
                            <QuestionForm
                                initialData={addFormData}
                                onFormChange={handleFormChange}
                                onSubmit={handleAddFormSubmit}
                                onClose={() => setShowQuestionForm(false)}
                            />
                        )}
                    </>
                )}
                <DropdownSelect
                    type='complexity'
                    options={['Easy', 'Medium', 'Hard']}
                    onOptionChange={(selectedComplexity) =>
                        setComplexityFilter(selectedComplexity as 'Easy' | 'Medium' | 'Hard')
                    }
                    defaultOption={'Complexity'}
                />
                <DropdownTabs
                    options={categoriesList}
                    onOptionChange={(selectedCategory) => setCategoryFilter(selectedCategory)}
                    defaultOption={'Category'}
                />
                <input
                    className='search-box'
                    type='text'
                    placeholder='Search questions'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
            <div className='reset-row'>
                {complexityFilter && (
                    <div
                        className='reset-button'
                        id={complexityFilter}
                        onClick={() => setComplexityFilter(null)}
                    >
                        {complexityFilter}
                        <Cancel fontSize={'small'} sx={{ color: '#c2c2c2' }} />
                    </div>
                )}

                {categoryFilter && (
                    <div
                        className='reset-button'
                        id={categoryFilter}
                        onClick={() => setCategoryFilter(null)}
                    >
                        {categoryFilter}
                        <Cancel fontSize={'small'} sx={{ color: '#c2c2c2' }} />
                    </div>
                )}
            </div>
            <form onSubmit={handleEditFormSubmit}>
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
                        {filteredAndSortedQuestions.map((question) => (
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
            {showTopBtn && (
                <button
                    onClick={goToTop}
                    className='back-to-top'
                    style={{ margin: '10px 0 0 auto' }}
                >
                    Back to top
                    <ArrowUpward fontSize={'small'} />
                </button>
            )}
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
            {storeQuestionMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {storeQuestionMutation.error.detail}</h4>
                </AlertMessage>
            )}
        </div>
    )
}

export default QuestionTable
