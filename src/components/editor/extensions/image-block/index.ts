import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes, Range } from '@tiptap/core'
import { Image as BaseImage } from '@tiptap/extension-image'
import ImageBlockView from './image-block-view'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlock: (attributes: { src: string; ratio: number }) => ReturnType
      setImageBlockAt: (attributes: { src: string }) => ReturnType
      setImageBlockAlign: (align: 'left' | 'center' | 'right') => ReturnType
      setImageBlockWidth: (width: number) => ReturnType
    }
  }
}

const ImageBlock = BaseImage.extend({
  name: 'imageBlock',
  group: 'block',
  defining: true,
  isolating: true,

  //定義屬性
  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => ({
          //把屬性渲染到HTML中
          src: attributes.src,
        }),
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('data-width'),
        renderHTML: (attributes) => ({
          'data-width': attributes.width,
        }),
      },
      ratio: {
        default: NaN,
        parseHTML: (element) => element.getAttribute('data-ratio'),
        renderHTML: (attributes) => ({
          'data-ratio': attributes.ratio,
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align'),
        renderHTML: (attributes) => ({
          'data-align': attributes.align,
        }),
      },
      alt: {
        default: undefined,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options, HTMLAttributes)]
  },

  addCommands() {
    return {
      // 插入 imageBlock
      setImageBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'imageBlock',
            attrs: { src: attrs.src, ratio: attrs.ratio },
          })
        },

      // 在指定位置插入 imageBlock
      setImageBlockAt:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContentAt(attrs.pos, {
            type: 'imageBlock',
            attrs: { src: attrs.src },
          })
        },

      // 設置對齊方式
      setImageBlockAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes('imageBlock', { align }),

      // 設置寬度
      setImageBlockWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes('imageBlock', {
            width: `${Math.max(0, Math.min(100, width))}%`,
          }),
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView)
  },
})

export default ImageBlock
