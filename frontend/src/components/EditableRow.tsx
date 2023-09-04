import React from "react";

// Define a TypeScript interface for the props
interface EditableRowProps {
    editFormData: {
        title: string;
        description: string;
        category: string;
        complexity: string;
    };
    handleEditFormChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
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
                    type="text"
                    required
                    placeholder="Description"
                    name="description"
                    className="custom-input"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
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
