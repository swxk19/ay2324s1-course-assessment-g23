import { StreamLanguage } from '@codemirror/language'
import { python } from '@codemirror/legacy-modes/mode/python'
import { tags as t } from '@lezer/highlight'
import { createTheme } from '@uiw/codemirror-themes'
import CodeMirror from '@uiw/react-codemirror'
import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/dist/quill.snow.css'

import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'

const myTheme = createTheme({
    theme: 'dark',
    settings: {
        background: '#000000',
        backgroundImage: '',
        foreground: '#75baff',
        caret: '#5d00ff',
        selection: '#036dd626',
        selectionMatch: '#036dd626',
        lineHighlight: '#8a91991a',
        gutterBackground: '#000000',
        gutterForeground: '#8a919966',
    },
    styles: [
        { tag: t.comment, color: '#787b8099' },
        { tag: t.variableName, color: '##E6E6FA' },
        { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
        { tag: t.number, color: '#00FF00' },
        { tag: t.bool, color: '#5c6166' },
        { tag: t.null, color: '#5c6166' },
        { tag: t.keyword, color: '#5c6166' },
        { tag: t.operator, color: '#FFD700' },
        { tag: t.className, color: '#5c6166' },
        { tag: t.definition(t.typeName), color: '#5c6166' },
        { tag: t.typeName, color: '#5c6166' },
        { tag: t.angleBracket, color: '#5c6166' },
        { tag: t.tagName, color: '#5c6166' },
        { tag: t.attributeName, color: '#5c6166' },
    ],
})

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [quill, setQuill] = useState<Quill | null>(null)
    const [lock, setLock] = useState(0)
    const [value, setValue] = useState('')

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/collab/${roomId}`)
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
                    console.log('lock')
                    quill?.off('editor-change', userEdit)
                    setLock((prevLock) => prevLock - 1)
                } else {
                    editHandler(args[0])
                }
            }
        }
        if (lock <= 0) {
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
                quill?.setText(data.data)
            }

            if (data.event == 'receive-changes') {
                quill?.off('editor-change', userEdit)
                setLock(2)
                quill?.updateContents(data.data)
                setValue(quill.getText())
                setLock(0)
                if (lock <= 0) {
                    quill?.on('editor-change', userEdit)
                }
            }
        }
    }, [lock, quill, socket])

    useEffect(() => {
        if (socket == null || quill == null) return
    }, [socket, quill, lock])

    useEffect(() => {
        if (quill == null) return
        quill.setText(value)
    }, [value, quill])

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
            {' '}
            <CodeMirror
                extensions={[StreamLanguage.define(python)]}
                theme={myTheme}
                value={value}
                height='200px'
                onChange={onChange}
            />
            <div id='container' ref={wrapperRef}></div>
        </div>
    )
}

export default CodeEditor
