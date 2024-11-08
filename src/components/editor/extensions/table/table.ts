import TiptapTable from '@tiptap/extension-table'
export const Table = TiptapTable.configure({
  resizable: true, // 拖轉行寬
  lastColumnResizable: false, // 最後一行不可拖拽，保持表格寬度 100%
})
