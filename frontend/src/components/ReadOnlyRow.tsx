import React from "react";

// Define a TypeScript interface for the props
interface ReadOnlyRowProps {
    question: {
        id: number; // Include ID field
        title: string;
        description: string;
        category: string;
        complexity: string;
    };
    handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, question: any) => void;
    handleDeleteClick: (id: number) => void;
}

const ReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
                                                     question,
                                                     handleEditClick,
                                                     handleDeleteClick
                                                 }) => {
    return (
        <tr>
            <td>{question.id}</td> {/* Display the ID */}
            <td>{question.title}</td>
            <td>{question.description}</td>
            <td>{question.category}</td>
            <td>{question.complexity}</td>
            <td>
                <button
                    type="button"
                    onClick={(event) => handleEditClick(event, question)}
                >
                    Edit
                </button>
                <button type="button" onClick={() => handleDeleteClick(question.id)}>
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ReadOnlyRow;
