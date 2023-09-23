import React, { useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import { type Question, updateQuestion } from '../../api/questions.ts'

interface ReadOnlyRowProps {
    question: Question
    handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, question: Question) => void
    handleDeleteClick: (id: string) => void
    hasActions: boolean
}

const QuestionReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
    question,
    handleEditClick,
    handleDeleteClick,
    hasActions,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedDescription, setEditedDescription] = useState(question.description)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    const handleEditDescription = async () => {
        question.description = editedDescription
        await updateQuestion(question)
        handleClose()
    }

    return (
        <>
            <tr>
                <td>{question.question_id}</td>
                <td
                    onClick={openModal}
                    style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                    }}
                >
                    {question.title}
                </td>
                <td>{question.category}</td>
                <td>{question.complexity}</td>
                {hasActions && (
                    <td>
                        <button type='button' onClick={(event) => handleEditClick(event, question)}>
                            Edit
                        </button>
                        <button
                            type='button'
                            onClick={() => handleDeleteClick(question.question_id)}
                        >
                            Delete
                        </button>
                    </td>
                )}
            </tr>
            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle style={{ backgroundColor: '#242424', color: 'white' }}>
                    {hasActions ? 'Edit Description' : 'Description'}
                </DialogTitle>
                <IconButton
                    aria-label='close'
                    disableRipple
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        color: (theme) => theme.palette.grey[500],
                    }}
                ></IconButton>
                <DialogContent style={{ backgroundColor: '#242424', width: '700px' }}>
                    {hasActions ? (
                        <TextField
                            style={{ width: '36rem', paddingRight: '20px' }}
                            fullWidth
                            multiline
                            rows={10}
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                        />
                    ) : (
                        <DialogContentText id='alert-dialog-description' style={{ color: 'white' }}>
                            {editedDescription}
                        </DialogContentText>
                    )}
                </DialogContent>
                {hasActions && (
                    <DialogActions style={{ backgroundColor: '#242424', width: '38rem' }}>
                        <Button
                            disableFocusRipple
                            disableRipple
                            size='medium'
                            onClick={handleEditDescription}
                            style={{
                                color: 'white',
                                paddingLeft: '25px',
                                paddingRight: '25px',
                                textTransform: 'none',
                            }}
                        >
                            <Typography variant='subtitle1'>Save</Typography>
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    )
}

export default QuestionReadOnlyRow
