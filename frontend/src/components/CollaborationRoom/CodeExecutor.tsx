import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useCodeExecutionOutput, useExecuteCode } from '../../stores/codeStore'

const CodeExecutor: React.FC = () => {
    const { data: codeExecutionOutput } = useCodeExecutionOutput()
    const executeCodeMutation = useExecuteCode()
    const [isOutputOpen, setIsOutputOpen] = useState(false)
    const { isLoading: isExecuting } = executeCodeMutation

    const handleExecute = async () => {
        await executeCodeMutation.mutateAsync()
        setIsOutputOpen(true)
    }

    const handleMinimise = () => {
        setIsOutputOpen(false)
    }

    const heightVariants = {
        minimized: { height: '50px' },
        expanded: { height: '500px' },
    }

    return (
        <motion.div
            className='ce-container'
            style={{ display: 'flex' }}
            animate={isOutputOpen ? 'expanded' : 'minimized'}
            variants={heightVariants}
        >
            {isOutputOpen && (
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
                        <h3 style={{ margin: '5px', padding: '0' }}>Output</h3>
                        <button onClick={handleMinimise} style={{ height: '35px' }}>
                            Close
                        </button>
                    </div>
                    <div className='code-output'>{codeExecutionOutput?.stdout}</div>
                    {codeExecutionOutput?.stderr && (
                        <div className='error-output'>{codeExecutionOutput.stderr}</div>
                    )}
                </div>
            )}
            {!isExecuting && (
                <button
                    onClick={handleExecute}
                    style={{ height: '35px', backgroundColor: '#00b8a2' }}
                >
                    Run
                </button>
            )}
        </motion.div>
    )
}

export default CodeExecutor
