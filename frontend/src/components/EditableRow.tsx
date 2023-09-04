import React from "react";

// Define a TypeScript interface for the props
interface EditableRowProps {
    editFormData: {
        id: number; // Include ID field
        title: string;
        description: string;
        category: string;
        complexity: string;
    };
    handleEditFormChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCancelClick: () => void;
}

const EditableRow: React.FC<EditableRowProps> = ({
                                                     editFormData,
                                                     handleEditFormChange,
                                                     handleCancelClick
                                                 }) => {
    return (
        <tr>
            <td>
                <input
                    className="custom-id-input"
                    type="number" // Change to number type for ID
                    required
                    placeholder="ID"
                    name="id"
                    value={editFormData.id}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    className="custom-title-input"
                    type="text"
                    required
                    placeholder="Title"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    className="custom-cat-input"
                    type="text"
                    required
                    placeholder="Category"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <select
                    name="complexity"
                    required
                    value={editFormData.complexity}
                    onChange={handleEditFormChange}
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </td>
            <td>
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancelClick}>
                    Cancel
                </button>
            </td>
        </tr>
    );
};

export default EditableRow;
