import { Server as HocusPocusServer } from '@hocuspocus/server'
import { TiptapTransformer } from '@hocuspocus/transformer'
import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import * as Y from 'yjs'
import { db } from '@/db/db'
import { sendErrorAlert } from '@/lib/mailer'
const hocuspocusServer = HocusPocusServer.configure({
  // save doc JSON content to db
  onStoreDocument: async (data: any) => {
    const documentName = data.documentName
    const json = TiptapTransformer.fromYdoc(data.document, 'default')
    // console.log('hocuspocus onStoreDocument .... ', data.documentName, json)
    try {
      const jsonStr = JSON.stringify(json)
      const res = await db.doc.update({
        where: { id: documentName },
        data: {
          content: jsonStr,
        },
      })
      console.log('hocuspocus onStoreDocument db updated res ... ', res)
    } catch (err: any) {
      console.error('hocuspocus onStoreDocument db updated error', err)
      sendErrorAlert(
        'hocuspocus onStoreDocument db updated error',
        err.message || 'error'
      )
    }
  },
  extensions: [
    new Logger(),
    new Database({
      // fetch doc content from db
      fetch: async ({ documentName }: any) => {
        console.log('Fetch db db ... ', documentName)
        let res: any = null
        try {
          res = await db.doc.findUnique({
            where: { id: documentName },
            select: {
              contentBinary: true,
              content: true,
            },
          })
          console.log('hocuspocus db fetch res ... ', res)
        } catch (err: any) {
          console.error('hocuspocus db fetch error', err)
          sendErrorAlert('hocuspocus db fetch error', err.message || 'error')
        }
        if (res == null) return null
        if (res.contentBinary) return res.contentBinary // return binary content if exists
        if (res.content == null) return null
        console.log('hocuspocus db fetch res.content ...', res.content)
        const bytes = TiptapTransformer.toYdoc(
          JSON.parse(res.content),
          'default'
        ) // JSON to Yjs doc
        const state = Y.encodeStateAsUpdate(bytes) // Yjs doc to binary
        console.log('hocuspocus db fetch state ...... ', state)
        return state
      },
      // store doc contentBinary to db
      store: async ({ documentName, state }: any) => {
        console.log('hocuspocus db store ... ', documentName, state)
        try {
          const res = await db.doc.update({
            where: { id: documentName },
            data: {
              contentBinary: state,
            },
          })
          console.log('hocuspocus db store res ... ', res)
        } catch (err: any) {
          console.error('hocuspocus db store error', err)
          sendErrorAlert('hocuspocus db store error', err.message || 'error')
        }
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
export function SOCKET(
  client: import('ws').WebSocket,
  _request: import('http').IncomingMessage,
  server: import('ws').WebSocketServer
) {
  hocuspocusServer.handleConnection(client, _request, {})
}
