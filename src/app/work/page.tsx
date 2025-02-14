import { db } from '@/db/db'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/lib/session'

export default async function Work() {
  // Get user info
  const user = await getUserInfo()
  if (user == null || !user.id) {
    redirect('/')
  }

  // Get first doc
  const firstDoc = await db.doc.findFirst({
    where: { userId: user.id, isDeleted: false },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  // If there is a doc, redirect to it
  if (firstDoc != null) {
    redirect(`/work/${firstDoc?.id}`)
  }

  const count = await db.doc.count({
    where: { userId: user.id }, // 不限制 delete
  })
  if (count > 0) {
    // 有文檔，但是都是刪除狀態
    redirect(`/work/0`)
  }
  // 找不到任何文檔，則新建文檔
  const newDoc = await db.doc.create({
    data: {
      userId: user.id,
      title: '滑水 AI 是什么',
      content:
        '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"划水AI"},{"type":"text","text":" 是一个 AIGC 知识库平台，像国内的"},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://docs.qq.com/","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}],"text":"腾讯文档"},{"type":"text","text":"、"},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.yuque.com/","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}],"text":"语雀"},{"type":"text","text":"，国外的 "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.notion.so/","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}],"text":"notion"},{"type":"text","text":" 。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"你可以在这里创建文档，管理文档，编辑文档。可使用 "},{"type":"text","marks":[{"type":"highlight","attrs":{"color":"#ffc078"}}],"text":"AI 智能写作"},{"type":"text","text":"，快速生成、处理文字。"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"使用页面下方的 AI 输入框，输入指令生成文字"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"选中一段文字，点击弹出菜单“Ask AI”，输入指令让 AI 处理文字"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"PS：你也可以"},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://huashuiai.com/join","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}],"text":"学习/参与"},{"type":"text","text":"这个项目的研发，提高个人能力，准备简历/面试项目。"}]},{"type":"paragraph","attrs":{"textAlign":"left"}}]}',
    },
  })

  redirect(`/work/${newDoc.id}`)
}
