import Quill, { Delta } from 'quill'
import React, { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const COLLAB_EDITOR_URL = "http://localhost:8000/ws/editor"

export const Editor: React.FC = () => {

    const[socket, setSocket] = useState()
    const[quill, setQuill] = useState()

    useEffect(() => {
        const socket = io(COLLAB_EDITOR_URL)
        setSocket(socket)

        return () => {
            socket.disconnect()
        }
    })

    useEffect(() => {
        const handler = (delta: Delta, oldDelta: Delta, source: string) => {
            if (source !== 'user'|| quill == null) return
            socket.emit("send-changes", delta)
        }
        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])

    const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, { theme: "snow" })
        setQuill(q)
    }, [])

    return <div id="container" ref={wrapperRef}></div>
}