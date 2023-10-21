import Quill from 'quill'
import Delta from "quill-delta"
import "quill/dist/quill.snow.css"

import React, { useCallback, useEffect, useState } from 'react'

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

export const CodeEditor: React.FC = () => {

    const[socket, setSocket] = useState<WebSocket | null>(null)
    const[quill, setQuill] = useState<Quill | null>(null)

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/collab');
        setSocket(socket)

        return () => {
            socket.close()
        }
    },[])

    useEffect(() => {
        if (socket == null || quill == null) return

        const editHandler = (delta: Delta, oldDelta: Delta, source: string) => {
          if (source != 'user' || quill == null) return;

          const payload = {
            event: "send-changes",
            data: {
              delta: delta,
              fullDoc: quill.getText()
            }
          };

          socket.send(JSON.stringify(payload));
          }

        socket.onopen = () => {
          console.log("WebSocket connection is open");
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.event == "open") {
            console.log(data.data)
            quill.setText(data.data)
          }

          if (data.event == "receive-changes") {
            quill.updateContents(data.data);
          }
        }

        quill.on('text-change', editHandler)

        return () => {
            quill.off('text-change', editHandler)
        }
    }, [socket, quill])


    const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
          })
        setQuill(q)

    }, [])

    return <div id="container" ref={wrapperRef}></div>
}

export default CodeEditor
