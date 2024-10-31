import { Node, mergeAttributes } from '@tiptap/core'

export const Column = Node.create({
  name: 'column',
  content: 'block+',
  //按下 Enter 鍵，不會新建一個節點，如H1 就會新建一個 H1新節點
  isolating: true,

  addAttributes() {
    return {
      position: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-position'), // 'left' | 'right'
        renderHTML: (attributes) => ({ 'data-position': attributes.position }),
      },
    }
  },

  // 定義如何輸出HTML
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'column' }),
      0,
    ]
  },
  // 定義如何解析傳入的HTML
  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ]
  },
})

export default Column
