import { Link } from 'react-router-dom'
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { javascript } from "@codemirror/lang-javascript";

interface Message {
    type: string;
    data: any;
  }

export const Room = (roomId: string) => {
    const [users, setUsers] = useState<string[]>([]);
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const editorRef = useRef<any>(null);
    const [code, setCode] = useState('');

    useEffect(() => {
      const socket = new WebSocket('ws://localhost:8000/ws/collab');

      socket.addEventListener('open', (event) => {
        console.log('Connected to room')
        socket.send(JSON.stringify({ type: 'CONNECTED_TO_ROOM', data: { roomId } }));
      });

      socket.addEventListener('message', (event) => {
        const message: Message = JSON.parse(event.data);

        switch (message.type) {
          case 'CODE_CHANGED':
            console.log(message.data);
            editorRef.current.setValue(message.data);
            break;
          case 'ROOM_CONNECTION':
            setUsers(message.data);
            console.log(message.data);
            break;
          default:
            // Handle other message types if needed
        }
      });

      socket.addEventListener('close', (event) => {
        console.log('WebSocket closed');
      });

      setWebsocket(socket);

      return () => {
        socket.close();
      };
    }, [roomId]);

    const handleCodeChange = (value: string) => {
        // 'value' contains the updated code
        setCode(value);
        console.log(value)
        // Additional event handling logic goes here
      };

    return (
        <div>
            <nav className='nav'>
                <Link to='/questions' className='site-title'>
                    PeerPrep
                </Link>
            </nav>
            <div className='split-container'>
                <div className='pane' style={{ paddingLeft: '30px'}}>
                    Question Placeholder
                </div>
                <div className='pane'>
                <ReactCodeMirror
                        theme={vscodeDark}
                        height='100vh'
                        extensions={[javascript()]}
                        onChange={handleCodeChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default Room
