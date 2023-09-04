import React, {ChangeEvent, FormEvent, Fragment, useState} from "react";
import EditableRow from "./EditableRow.tsx";
import ReadOnlyRow from "./ReadOnlyRow.tsx";
import {Question} from "../services/questionBank.ts";
import data from "../assets/mock-data.json";
import {nanoid} from "nanoid";

export const QuestionTable : React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>(data);
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

    const handleAddFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newQuestion: Question = {
            id: nanoid(),
            ...addFormData,
        };

        const newQuestions: Question[] = [...questions, newQuestion];
        setQuestions(newQuestions);
    };

    const handleEditFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const editedContact: Question = {
            id: editQuestionId!,
            ...editFormData,
        };

        const newQuestions: Question[] = [...questions];

        const index = questions.findIndex((question) => question.id === editQuestionId);

        if (index !== -1) {
            newQuestions[index] = editedContact;
            setQuestions(newQuestions);
            setEditQuestionId(null);
        }
    };

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, question: Question) => {
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
            setQuestions(newQuestions);
        }
    };

    return (
        <div className="app-container">
            <h2>Question Bank</h2>
            <form onSubmit={handleEditFormSubmit}>
                <table>
                    <thead>
                    <tr>
                        <th className="title-col">Title</th>
                        <th className="description-col">Description</th>
                        <th className="category-col">Category</th>
                        <th className="complexity-col">Complexity</th>
                        <th className="actions-col">Actions</th>
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
                    className="custom-title-input"
                    type="text"
                    name="title"
                    required
                    placeholder="Title"
                    onChange={handleAddFormChange}
                />

                <input
                    className="custom-cat-input"
                    type="text"
                    name="category"
                    required
                    placeholder="Category"
                    onChange={handleAddFormChange}
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
                    />
                </div>

                <button type="submit">Add</button>

            </form>
        </div>
    );

}