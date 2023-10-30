import React, { useState } from 'react'
import '../../styles/QuestionForm.css'
import CategoryButton from './CategoryButton.tsx'

export interface Question {
    question_id: string
    title: string
    description: string
    category: string
    complexity: Complexity
}

type Complexity = 'Easy' | 'Medium' | 'Hard'

type FormData = Omit<Question, 'question_id'>

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

interface QuestionFormProps {
    initialData: FormData
    onFormChange: (data: FormData) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onClose: () => void
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
    initialData,
    onFormChange,
    onSubmit,
    onClose,
}) => {
    const [formData, setFormData] = useState<FormData>(initialData)

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        const updatedData = {
            ...formData,
            [name]: value,
        }
        setFormData(updatedData)
        onFormChange(updatedData)
    }

    const handleCategoryClick = (category: string) => {
        let newCategory = formData.category

        if (newCategory.includes(category)) {
            newCategory = newCategory.replace(category, '').replace(',,', ',').trim() // Removing the clicked category
        } else {
            newCategory = newCategory ? `${newCategory}, ${category}` : category
        }

        const updatedData = {
            ...formData,
            category: newCategory,
        }
        setFormData(updatedData)
        onFormChange(updatedData)
    }

    return (
        <div className='dark-overlay'>
            <div className='question-form-container'>
                <h3>Add a question</h3>
                <form onSubmit={onSubmit}>
                    <p>Title</p>
                    <input
                        name='title'
                        required
                        placeholder='Title'
                        value={formData.title}
                        onChange={handleInputChange}
                    />

                    <div>
                        <p>Category</p>
                        <input
                            name='category'
                            required
                            placeholder='Category'
                            value={formData.category}
                            onChange={handleInputChange}
                        />
                        <div style={{ margin: '10px 0' }}>
                            {categoriesList.map((category) => (
                                <CategoryButton
                                    key={category}
                                    category={category}
                                    isSelected={formData.category.split(', ').includes(category)}
                                    onSelect={(selectedCategory) =>
                                        handleCategoryClick(selectedCategory)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <p>Complexity</p>
                    <select
                        name='complexity'
                        value={formData.complexity}
                        onChange={handleInputChange}
                    >
                        <option value='Easy'>Easy</option>
                        <option value='Medium'>Medium</option>
                        <option value='Hard'>Hard</option>
                    </select>
                    <p>Description</p>
                    <textarea
                        name='description'
                        required
                        placeholder='Description'
                        value={formData.description}
                        onChange={handleInputChange}
                    />

                    <p />
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginTop: '25px',
                        }}
                    >
                        <button
                            style={{ backgroundColor: '#00b8a2', marginRight: '5px' }}
                            type='submit'
                        >
                            Add
                        </button>
                        <button style={{ backgroundColor: 'transparent' }} onClick={onClose}>
                            Cancel
                        </button>
                    </span>
                </form>
            </div>
        </div>
    )
}
