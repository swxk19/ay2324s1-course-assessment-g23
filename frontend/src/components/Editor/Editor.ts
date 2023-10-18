import Quill from "quill"
import React, { useCallback } from 'react'

export const Editor: React.FC = () => {

    const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement('div')
        wrapper.append(editor)
        new Quill(editor, { theme: "snow" })
    }, [])

    return <div id="container" ref={wrapperRef}></div>
}