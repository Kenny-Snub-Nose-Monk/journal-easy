import { Server as HocusPocusServer } from '@hocuspocus/server'
import { TiptapTransformer } from '@hocuspocus/transformer'
import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { db } from '@/db/db'
import * as Y from 'yjs'
const hocuspocusServer = HocusPocusServer.configure({
  // config
  onConnect: async (payload) => {
    console.log('New connection')
  },
  onDisconnect: async (payload) => {
    console.log('Disconnected')
  },
  // onChange: async (data) => {
  //   console.log('Changed .... ', data.documentName)
  // },
  onStoreDocument: async (data) => {
    const json = TiptapTransformer.fromYdoc(data.document, 'default')
    console.log('Document stored .... ', data.documentName, json)
    const documentName = data.documentName
    const jsonStr = JSON.stringify(json)
    const res = await db.ydoc.upsert({
      where: { id: documentName },
      update: {
        contentJSON: jsonStr,
      },
      create: {
        id: documentName,
        contentJSON: jsonStr,
      },
    })
    console.log('Document stored res ... ', res)
  },
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        console.log('Fetch db db ... ', documentName)
        const res = await db.ydoc.findUnique({
          where: { id: documentName },
          select: {
            contentBinary: true,
            contentJSON: true,
          },
        })
        console.log('Fetch db res ... ', res)
        if (res == null) return null
        if (res.contentBinary) return res.contentBinary // 有二机制数据，优先返回
        if (res.contentJSON == null) return null
        console.log('Fetch db res.contentJSON ...', res.contentJSON)
        const bytes = TiptapTransformer.toYdoc(
          JSON.parse(res.contentJSON),
          'default'
        ) // 转换
        const state = Y.encodeStateAsUpdate(bytes)
        console.log('state ...... ', state)
        return state
      },
      store: async ({ documentName, state }) => {
        console.log('Store db db ... ', documentName, state)
        const res = await db.ydoc.upsert({
          where: { id: documentName },
          update: {
            contentBinary: state,
          },
          create: {
            id: documentName,
            contentBinary: state,
          },
        })
        console.log('Store db res ... ', res)
      },
    }),
  ],
})
export async function GET() {
  const headers = new Headers()
  headers.set('Connection', 'Upgrade')
  headers.set('Upgrade', 'websocket')
  return new Response('Upgrade Required', { status: 426, headers })
}
export default function SOCKET(
  client: import('ws').WebSocket,
  _request: import('http').IncomingMessage,
  server: import('ws').WebSocketServer
) {
  console.log('A client connected')
  client.on('message', (message) => {
    // Handle incoming message if needed
  })
  client.on('close', () => {
    console.log('A client disconnected')
  })
  hocuspocusServer.handleConnection(client, _request, {})
}
