import { Skeleton } from '@mui/material'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useCodeExecutionOutput, useExecuteCode } from '../../stores/codeStore'

const CodeExecutor: React.FC = () => {
    const { data: codeExecutionOutput } = useCodeExecutionOutput()
    const executeCodeMutation = useExecuteCode()
    const [isOutputOpen, setIsOutputOpen] = useState(false)
    const { isLoading: isExecuting } = executeCodeMutation

    const handleExecute = async () => {
        setIsOutputOpen(true)
        await executeCodeMutation.mutateAsync()
    }

    const handleMinimise = () => {
        setIsOutputOpen(false)
    }

    const heightVariants = {
        minimized: { height: '50px' },
        expanded: { height: '800px' },
    }

    return (
        <motion.div
            className='ce-container'
            style={{ display: 'flex' }}
            animate={isOutputOpen ? 'expanded' : 'minimized'}
            variants={heightVariants}
        >
            {isOutputOpen ? (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div
                        className='ce-container'
                        style={{
                            margin: '0',
                            padding: '0',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div className='ce-header'>
                            <h3 style={{ margin: '5px', padding: '0' }}>Output</h3>
                            <button
                                onClick={handleMinimise}
                                style={{ height: '35px', marginLeft: 'auto' }}
                            >
                                Close
                            </button>
                            <button
                                disabled={isExecuting}
                                onClick={handleExecute}
                                style={{
                                    height: '35px',
                                    backgroundColor: '#00b8a2',
                                    cursor: `${isExecuting ? 'default' : 'pointer'}`,
                                }}
                            >
                                Run
                            </button>
                        </div>
                    </div>
                    <div className='ce-body'>
                        {isExecuting ? (
                            <div className='skeleton-container'>
                                <Skeleton
                                    variant='rounded'
                                    sx={{
                                        height: '30px',
                                        width: '200px',
                                        bgcolor: '#2b2b2b',
                                    }}
                                />
                                <Skeleton
                                    variant='rounded'
                                    sx={{
                                        marginTop: '15px',
                                        height: '240px',
                                        width: '100%',
                                        bgcolor: '#2b2b2b',
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <div className='result-header-success'>Code Run Successfully</div>
                                <div className='code-output'>{codeExecutionOutput?.stdout}</div>
                                {codeExecutionOutput?.stderr && (
                                    <>
                                        <div className='result-header-error'>
                                            Code Execution Failed
                                        </div>
                                        <div className='error-output'>
                                            {codeExecutionOutput.stderr}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleExecute}
                    style={{ height: '35px', backgroundColor: '#00b8a2', margin: '5px 10px' }}
                >
                    Run
                </button>
            )}
        </motion.div>
    )
}

export default CodeExecutor
