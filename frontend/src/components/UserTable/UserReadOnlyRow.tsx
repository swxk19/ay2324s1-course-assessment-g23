import { User } from '../../api/users.ts'
interface ReadOnlyRowProps {
    user: User
    handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, user: any) => void
    handleDeleteClick: (id: string) => void
}

const UserReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
    user,
    handleEditClick,
    handleDeleteClick,
}) => {
    return (
        <tr>
            <td>{user.user_id}</td>
            <td>{user.username}</td>
            <td>{user.password}</td>
            <td>{user.email}</td>
            <td>
                <button type='button' onClick={(event) => handleEditClick(event, user)}>
                    Edit
                </button>
                <button type='button' onClick={() => handleDeleteClick(user.user_id)}>
                    Delete
                </button>
            </td>
        </tr>
    )
}

export default UserReadOnlyRow
