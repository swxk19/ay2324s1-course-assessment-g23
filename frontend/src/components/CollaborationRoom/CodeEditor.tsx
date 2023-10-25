import hljs from "highlight.js"
import 'highlight.js/styles/monokai-sublime.css'
import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/dist/quill.snow.css'


import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [quill, setQuill] = useState<Quill | null>(null)

    useEffect(() => {
        hljs.configure({languages: ['python', 'javascript']});
        const socket = new WebSocket(`ws://localhost:8000/ws/collab/${roomId}`)
        setSocket(socket)

        return () => {
            socket.close()
        }
    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return

        const editHandler = (delta: Delta, oldDelta: Delta, source: string) => {
            if (source != 'user' || quill == null) return
            const payload = {
                event: 'send-changes',
                data: {
                    delta: delta,
                    fullDoc: quill.getText(),
                },
            }

            socket.send(JSON.stringify(payload))
            quill.format('code-block', delta)
        }

        socket.onopen = () => {
            console.log('WebSocket connection is open')
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.event == 'open') {
                quill.setText(data.data)
                quill.format('code-block', true)
            }

            if (data.event == 'receive-changes') {
                quill.updateContents(data.data)
            }
        }

        quill.on('text-change', editHandler)
        return () => {
            quill.off('text-change', editHandler)
        }
    }, [socket, quill])

    const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
        if (wrapper == null) return

        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: 'snow',
            modules: {
                syntax: {
                    highlight: (text: string) => hljs.highlightAuto(text).value
                },
            toolbar: false
            },
        })
        q.format('code-block', "")

        const quillElement = wrapper.querySelector('.ql-editor') as HTMLElement;
        if (quillElement) {
            quillElement.style.cssText = 'background-color: #24241c; padding: 0;';
        }

        setQuill(q)
    }, [])

    return <div id='container' ref={wrapperRef}></div>
}

export default CodeEditor
