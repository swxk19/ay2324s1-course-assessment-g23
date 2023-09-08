import React, { ChangeEvent } from 'react'
import { type Question } from '../services/questionBank'

// Define a TypeScript interface for the props
interface EditableRowProps {
    editFormData: Question
    handleEditFormChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleCancelClick: () => void
}

const EditableRow: React.FC<EditableRowProps> = ({
    editFormData,
    handleEditFormChange,
    handleCancelClick,
}) => {
    return (
        <tr>
            <td>
                <input
                    className='custom-id-input'
                    type='text'
                    required
                    placeholder='ID'
                    name='id'
                    value={editFormData.question_id}
                    disabled
                />
            </td>
            <td>
                <input
                    className='custom-title-input'
                    type='text'
                    required
                    placeholder='Title'
                    name='title'
                    value={editFormData.title}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    className='custom-cat-input'
                    type='text'
                    required
                    placeholder='Category'
                    name='category'
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <select
                    name='complexity'
                    required
                    value={editFormData.complexity}
                    onChange={handleEditFormChange}
                >
                    <option value='Easy'>Easy</option>
                    <option value='Medium'>Medium</option>
                    <option value='Hard'>Hard</option>
                </select>
            </td>
            <td>
                <button type='submit'>Save</button>
                <button type='button' onClick={handleCancelClick}>
                    Cancel
                </button>
            </td>
        </tr>
    )
}

export default EditableRow
