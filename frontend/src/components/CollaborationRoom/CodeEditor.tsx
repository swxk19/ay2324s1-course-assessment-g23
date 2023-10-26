import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/dist/quill.snow.css'
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { javascript } from '@codemirror/lang-javascript';
import {getIndentation} from "@codemirror/language"
// import {python} from "@codemirror/lang-python"
import { StreamLanguage } from '@codemirror/language';
import {python} from '@codemirror/legacy-modes/mode/python'
import { createTheme } from '@uiw/codemirror-themes';
import { useRef } from 'react'
import { tags as t } from '@lezer/highlight';

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
      { tag: t.variableName, color: '#0080ff' },
      { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
      { tag: t.number, color: '#5c6166' },
      { tag: t.bool, color: '#5c6166' },
      { tag: t.null, color: '#5c6166' },
      { tag: t.keyword, color: '#5c6166' },
      { tag: t.operator, color: '#5c6166' },
      { tag: t.className, color: '#5c6166' },
      { tag: t.definition(t.typeName), color: '#5c6166' },
      { tag: t.typeName, color: '#5c6166' },
      { tag: t.angleBracket, color: '#5c6166' },
      { tag: t.tagName, color: '#5c6166' },
      { tag: t.attributeName, color: '#5c6166' },
    ],
  });

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [quill, setQuill] = useState<Quill | null>(null)
    const [lock, setLock] = useState(0)
    const [value, setValue] = useState("")
    const [delta, setDelta] = useState<Delta | null>(null)

    const lockRef = useRef(lock)

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
            if (eventName == "text-change") {
                if (lock > 0) {
                    setLock(prevLock => prevLock - 1)
                } else {
                    // setLock(0)
                    editHandler(args[0])
                }
            }
        }
    const editHandler = (delta: Delta) => {
        if (socket == null || quill == null) return
        console.log(lock, 'push', delta)
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
            quill?.format('code-block', true)
        }

        if (data.event == 'receive-changes') {
            console.log(lock, 'receive')
            quill?.off('editor-change', userEdit)
            quill?.updateContents(data.data)
            setValue(quill.getText())
            quill?.on('editor-change', userEdit)
        }
    }
        quill?.on('editor-change', userEdit)
    }, [lock, quill, socket])

    useEffect(() => {
        if (socket == null || quill == null) return

    }, [socket, quill, lock])

    useEffect(() => {
        if (quill == null) return
        // if (lockRef.current > 0) return
        quill.setText(value)
    }, [value, quill])

    const onChange = useCallback((val: string, viewUpdate: any) => {
        console.log(lock)
        if (lock > 0) return
        setValue(val);
      }, [lock]);

      const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
        if (wrapper == null) return

        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: 'snow',
            modules: {
                toolbar: false
            },
        })

        const quillElement = wrapper.querySelector('.ql-editor') as HTMLElement;
        if (quillElement) {
            quillElement.style.cssText = 'background-color: #24241c; padding: 0;';
        }

        setQuill(q)
    }, [])

    return <div> <CodeMirror extensions={[StreamLanguage.define(python)]} theme={myTheme} value={value} height="200px"  onChange={onChange} /><div id='container' ref={wrapperRef}></div></div>;
}

export default CodeEditor
