import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import { updateQuestion} from "../services/questionBank.ts";

interface ReadOnlyRowProps {
    question: {
        id: number; // Include ID field
        title: string;
        description: string;
        category: string;
        complexity: 'Easy' | "Medium" | "Hard";
    };
    handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, question: any) => void;
    handleDeleteClick: (id: number) => void;
}

const ReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
                                                     question,
                                                     handleEditClick,
                                                     handleDeleteClick,
                                                 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedDescription, setEditedDescription] = useState(question.description);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleEditDescription = async () => {
        question.description = editedDescription;
        await updateQuestion(question);
        handleClose();
    };

    return (
        <tr>
            <td>{question.id}</td>
            <td
                onClick={openModal}
                style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: "bold",
                }}
            >
                {question.title}
            </td>
            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle style={{ backgroundColor: "#242424", color: "white"}}>Edit Description</DialogTitle>
                <DialogContent style={{ backgroundColor: "#242424", width: "700px"}}>
                    <DialogContentText id="alert-dialog-description" style={{ color: "white" }}>
                        <TextField
                            style={{width: "550px", paddingRight: "20px"}}
                            fullWidth
                            multiline
                            rows={10}
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            InputProps={{
                                style: { color: "white", borderColor: "white"},
                            }}

                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ backgroundColor: "#242424", width: "590px"}}>
                    <Button onClick={handleEditDescription} style={{ color: "white", paddingLeft:"25px", paddingRight: "25px"}}>
                        Save and Close
                    </Button>

                </DialogActions>
            </Dialog>

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
