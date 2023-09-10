import React, { ChangeEvent } from 'react'
import {User} from "../../services/users.ts";
import  '../../styles/UserTable.css'

// Define a TypeScript interface for the props
interface EditableRowProps {
    editFormData: User
    handleEditFormChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleCancelClick: () => void
}

const UserEditableRow: React.FC<EditableRowProps> = ({
    editFormData,
    handleEditFormChange,
    handleCancelClick,
}) => {
    return (
        <tr className="user-container">
            <td>
                <input
                    required
                    placeholder='ID'
                    name='id'
                    value={editFormData.user_id}
                    disabled
                />
            </td>
            <td>
                <input
                    required
                    placeholder='Username'
                    name='username'
                    value={editFormData.username}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    required
                    placeholder='Password'
                    name='passsword'
                    value={editFormData.password}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    required
                    placeholder='Email'
                    name='email'
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                />
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

export default UserEditableRow
