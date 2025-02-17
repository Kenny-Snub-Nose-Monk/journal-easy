'use client'
import './styles.css'
import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'
import Editor from './Editor'
const room = `room.${new Date().getFullYear().toString().slice(-2)}${new Date().getMonth() + 1}${new Date().getDate()}`
// const room = `room.1111`
console.log('room ', room)
// ydoc and provider for Editor A
const ydocA = new Y.Doc()
const providerA = new HocuspocusProvider({
  url: 'ws://127.0.0.1:3000/api/doc/collaborate',
  name: room,
  document: ydocA,
})
// ydoc and provider for Editor B
const ydocB = new Y.Doc()
const providerB = new HocuspocusProvider({
  url: 'ws://127.0.0.1:3000/api/doc/collaborate',
  name: room,
  document: ydocB,
})
const App = () => {
  return (
    <div className="col-group">
      Hi
      {/* <Editor provider={providerA} ydoc={ydocA} room={room} />
      <Editor provider={providerB} ydoc={ydocB} room={room} /> */}
    </div>
  )
}
export default App
