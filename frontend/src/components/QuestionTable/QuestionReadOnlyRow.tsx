import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { type Question } from '../../api/questions.ts'
import { useUpdateQuestion } from '../../stores/questionStore.ts'
import AlertMessage from '../AlertMessage.tsx'

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
    const updateQuestionMutation = useUpdateQuestion()

    const openModal = () => {
        setEditedDescription(question.description)
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    const handleEditDescription = async () => {
        question.description = editedDescription
        await updateQuestionMutation.mutateAsync(question)
        handleClose()
    }

    return (
        <>
            <tr>
                <td>
                    <Tooltip title={<p>{question.question_id}</p>} arrow>
                        <Typography
                            style={{
                                cursor: 'pointer',
                                maxWidth: '10ch', // Adjust the maximum width as needed
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {question.question_id}
                        </Typography>
                    </Tooltip>
                </td>
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
                <td className={`complexity-color-${question.complexity}`}>{question.complexity}</td>
                {hasActions && (
                    <td>
                        <IconButton
                            sx={{ color: '#c2c2c2', paddingLeft: '0' }}
                            onClick={(event) => handleEditClick(event, question)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            sx={{ color: '#c2c2c2' }}
                            onClick={() => handleDeleteClick(question.question_id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </td>
                )}
            </tr>
            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                maxWidth='md'
                PaperProps={{
                    sx: { borderRadius: '1rem', backgroundColor: '#242424', padding: '1rem' },
                }}
            >
                <DialogTitle
                    style={{
                        fontWeight: 'bold',
                        backgroundColor: '#242424',
                        color: 'white',
                        width: '700px',
                    }}
                >
                    {hasActions ? 'Edit Description' : 'Description'}
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#242424' }}>
                    {hasActions ? (
                        <TextField
                            style={{ width: '100%' }}
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
                    <DialogActions style={{ backgroundColor: '#242424' }}>
                        <Button
                            disableFocusRipple
                            disableRipple
                            size='medium'
                            onClick={handleClose}
                            style={{
                                color: 'white',
                                paddingLeft: '25px',
                                paddingRight: '25px',
                                marginRight: '15px',
                                textTransform: 'none',
                                width: '5rem',
                                maxWidth: '700px',
                                backgroundColor: '#303030',
                            }}
                            sx={{
                                ml: 1,
                                '&.MuiButtonBase-root:hover': {
                                    bgcolor: 'transparent',
                                },
                            }}
                        >
                            <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                                Cancel
                            </Typography>
                        </Button>
                        <Button
                            disableFocusRipple
                            disableRipple
                            size='medium'
                            onClick={handleEditDescription}
                            style={{
                                color: 'white',
                                paddingLeft: '25px',
                                paddingRight: '25px',
                                marginRight: '15px',
                                textTransform: 'none',
                                width: '5rem',
                                maxWidth: '700px',
                                backgroundColor: '#238636',
                            }}
                            sx={{
                                ml: 1,
                                '&.MuiButtonBase-root:hover': {
                                    bgcolor: 'transparent',
                                },
                            }}
                        >
                            <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                                Save
                            </Typography>
                        </Button>
                    </DialogActions>
                )}

                {updateQuestionMutation.isError && (
                    <AlertMessage variant='error'>
                        <h4>Oops! {updateQuestionMutation.error.detail}</h4>
                    </AlertMessage>
                )}
            </Dialog>
        </>
    )
}

export default QuestionReadOnlyRow
