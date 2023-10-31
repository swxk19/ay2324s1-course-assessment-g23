import { StreamLanguage } from '@codemirror/language'
import { python } from '@codemirror/legacy-modes/mode/python'
import CodeMirror from '@uiw/react-codemirror'
import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/dist/quill.snow.css'

import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import LanguageSelect from './LanguageSelect.tsx'

/** URL for collaboration websocket API. */
const COLLABORATION_API_URL =
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}` +
    '/api/collaboration'

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [quill, setQuill] = useState<Quill | null>(null)
    const [lock, setLock] = useState(0)
    const [value, setValue] = useState('')
    const [quillValue, setQuillValue] = useState('')

    useEffect(() => {
        const socket = new WebSocket(COLLABORATION_API_URL + `/collab/${roomId}`)
        setSocket(socket)

        return () => {
            socket.close()
        }
    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return
        const userEdit = (eventName: string, ...args: any[]) => {
            if (eventName == 'text-change') {
                if (lock > 0) {
                    quill?.off('editor-change', userEdit)
                    setLock((prevLock) => prevLock - 1)
                } else {
                    editHandler(args[0])
                }
            }
        }
        if (lock <= 0) {
            // mounts only init
            quill?.on('editor-change', userEdit)
        }

        const editHandler = (delta: Delta) => {
            quill?.off('editor-change', userEdit)
            if (socket == null || quill == null || lock > 0) return
            quill?.on('editor-change', userEdit)
            const payload = {
                event: 'send-changes',
                data: {
                    delta: delta,
                    fullDoc: quill.getText(),
                },
            }
            socket.send(JSON.stringify(payload))
        }

        socket.onopen = () => {
            console.log('WebSocket connection is open')
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.event == 'open') {
                quill?.off('editor-change', userEdit) // this is treated like a semaphore
                quill?.setText(data.data)
                setValue(quill.getText())
                quill?.on('editor-change', userEdit)
            }

            if (data.event == 'receive-changes') {
                quill?.off('editor-change', userEdit) // this is treated like a semaphore
                quill?.updateContents(data.data)
                setValue(quill.getText())
                quill?.on('editor-change', userEdit)
            }
        }
    }, [lock, quill, socket])

    useEffect(() => {
        if (quill == null || lock > 0 || quill.getText() == value) return
        quill.setText(value)
    }, [value, quill, lock])

    const onChange = useCallback(
        (val: string, viewUpdate: any) => {
            setValue(val)
        },
        [lock]
    )

    const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
        if (wrapper == null) return

        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            modules: {
                toolbar: false,
            },
        })

        const quillElement = wrapper.querySelector('.ql-editor') as HTMLElement
        if (quillElement) {
            quillElement.style.cssText = 'display: none'
        }

        setQuill(q)
    }, [])

    return (
        <div>
            <div className='editor-header'>
                <LanguageSelect />
            </div>
            <CodeMirror
                extensions={[StreamLanguage.define(python)]}
                theme={vscodeDarkInit({
                    settings: {
                        background: '#242424',
                        gutterBackground: '#242424',
                        lineHighlight: 'transparent',
                    },
                })}
                value={value}
                height='200px'
                onChange={onChange}
            />
            <div id='container' ref={wrapperRef}></div>
        </div>
    )
}

export default CodeEditor
