import React, { ChangeEvent, FormEvent, Fragment, useState, useEffect } from "react";
import EditableRow from "./EditableRow.tsx";
import ReadOnlyRow from "./ReadOnlyRow.tsx";
import {
    deleteQuestion,
    Question,
    updateQuestion,
    getQuestions,
    storeQuestion, // Import storeQuestion function
} from "../services/questionBank.ts";

export const QuestionTable: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [lastUsedId, setLastUsedId] = useState<number>(0);

    const [addFormData, setAddFormData] = useState<Question>({
        id: 0,
        title: "",
        description: "",
        category: "",
        complexity: "Easy",
    });
    const [editFormData, setEditFormData] = useState<Question>({
        id: 0,
        title: "",
        description: "",
        category: "",
        complexity: "Easy",
    });
    const [editQuestionId, setEditQuestionId] = useState<number | null>(null);

    useEffect(() => {
        const loadQuestions = async () => {
            const loadedQuestions = await getQuestions();
            setQuestions(loadedQuestions);

            if (loadedQuestions.length > 0) {
                const maxId = Math.max(...loadedQuestions.map((q) => q.id));
                setLastUsedId(maxId);
            }
        };

        loadQuestions();
    }, []);

    const handleAddFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAddFormData({
            ...addFormData,
            [name]: value,
        });
    };

    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    const handleAddFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newId = lastUsedId + 1;
        setLastUsedId(newId);

        const newQuestion: Question = {
            ...addFormData,
        };

        const newQuestions: Question[] = [...questions, newQuestion];

        // Save the new question to localStorage
        await storeQuestion(newQuestion);
        setQuestions(newQuestions);
    };

    const handleEditFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const editedContact: Question = {
            ...editFormData,
        };

        const newQuestions: Question[] = [...questions];

        const index = questions.findIndex((question) => question.id === editQuestionId);

        if (index !== -1) {
            newQuestions[index] = editedContact;

            // Update the edited question in localStorage
            await updateQuestion(editedContact);

            setQuestions(newQuestions);
            setEditQuestionId(null);
        }
    };

    const handleEditClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        question: Question
    ) => {
        event.preventDefault();
        setEditQuestionId(question.id);
        setEditFormData(question);
    };

    const handleCancelClick = () => {
        setEditQuestionId(null);
    };

    const handleDeleteClick = (questionId: number) => {
        const newQuestions: Question[] = [...questions];
        const index = questions.findIndex((question) => question.id === questionId);

        if (index !== -1) {
            newQuestions.splice(index, 1);

            // Delete the question from localStorage and save the updated list
            deleteQuestion(questionId);

            setQuestions(newQuestions);
        }
    };



    return (
        <div className="app-container">
            <h2>PeerPrep</h2>
            <form onSubmit={handleEditFormSubmit}>
                <table className="question-table">
                    <thead>
                    <tr>
                        <th className="id-col">ID</th>
                        <th className="title-col">Title</th>
                        <th className="category-col">Category</th>
                        <th className="complexity-col">Complexity</th>
                        <th className ="actions-col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((question) => (
                        <Fragment key={question.id}>
                            {editQuestionId === question.id ? (
                                <EditableRow
                                    editFormData={editFormData}
                                    handleEditFormChange={handleEditFormChange}
                                    handleCancelClick={handleCancelClick}
                                />
                            ) : (
                                <ReadOnlyRow
                                    question={question}
                                    handleEditClick={handleEditClick}
                                    handleDeleteClick={handleDeleteClick}
                                />
                            )}
                        </Fragment>
                    ))}
                    </tbody>
                </table>
            </form>

            <h2>Add a Question</h2>
            <form onSubmit={handleAddFormSubmit}>
                <input
                    className="custom-id-input"
                    type="text"
                    name="id"
                    required
                    placeholder="ID"
                    onChange={handleAddFormChange}
                    value={addFormData.id}
                />
                <input
                    className="custom-title-input"
                    type="text"
                    name="title"
                    required
                    placeholder="Title"
                    onChange={handleAddFormChange}
                    value={addFormData.title}
                />

                <input
                    className="custom-cat-input"
                    type="text"
                    name="category"
                    required
                    placeholder="Category"
                    onChange={handleAddFormChange}
                    value={addFormData.category}
                />
                <select
                    name="complexity"
                    required
                    value={addFormData.complexity}
                    onChange={handleAddFormChange}
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <div>
                <textarea
                    className="custom-desc-input"
                    name="description"
                    required
                    placeholder="Description"
                    onChange={handleAddFormChange}
                    value={addFormData.description}
                />
                </div>
                <div>
                <button type="submit">Add</button>
                </div>
            </form>
        </div>
    );
};
