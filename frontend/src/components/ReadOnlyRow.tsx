import React from "react";

// Define a TypeScript interface for the props
interface ReadOnlyRowProps {
    question: {
        title: string;
        description: string;
        category: string;
        complexity: string;
        id: number;
    };
    handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, contact: any) => void;
    handleDeleteClick: (id: number) => void;
}

const ReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
                                                     question,
                                                     handleEditClick,
                                                     handleDeleteClick
                                                 }) => {
    return (
        <tr>
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
