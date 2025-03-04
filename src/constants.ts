export const CONTENT_WIDTH = 800 // 内容寬度
export const EDITOR_PADDING_BOTTOM = 200
export const DOC_TITLE_INPUT_ID = 'DOC_TITLE_INPUT_ID'
export const RIGHT_PANEL_DOM_ID = 'RIGHT_PANEL_DOM_ID'
export const AI_RES_MAX_TOKENS = 1000 // AI 返回结果最大長度
export const AI_CONTEXT_MAX_LENGTH = 600 // 上下文最大長度，請求 AI 接口時
export const AI_DEFAULT_TOKEN_LIMIT = 10000 // AI default token limit
export const AI_REQUEST_DELAY = 2 // AI 請求間隔時間
export const MAX_DOC_COUNT = 100 // 最大文檔數量
export const EDITOR_CHARACTER_LIMIT = 1000 // 編輯器字數限制

export const RESIZABLE_RIGHT_PANEL_ID = 'RESIZABLE_RIGHT_PANEL_ID'
export const WORK_CONTENT_SCROLL_CONTAINER = 'work-content-scroll-container'

export const EVENT_KEY_CHANGE_DOC_TITLE = 'E_K_CHANGE_DOC_TITLE'
export const EVENT_KEY_NAV_DOC = 'E_K_NAV_DOC'
export const EVENT_KEY_CREATE_DOC = 'E_K_CREATE_DOC'
export const EVENT_KEY_DEL_DOC = 'E_K_DEL_DOC'
export const EVENT_KEY_CHANGE_IS_STAR = 'E_K_CHANGE_IS_STAR'
export const EVENT_KEY_CHANGE_DOC_USER_ID = 'E_K_CHANGE_DOC_USER_ID'
export const EVENT_KEY_FOCUS_AI = 'E_K_FOCUS_AI'

export const EVENT_KEY_CHANGE_IS_SHARED = 'E_K_CHANGE_IS_SHARED'

export const LAST_DOC_ID_KEY = 'LAST_DOC_ID'
export const EVENT_KEY_FOCUS_CONTENT = 'E_K_FOCUS_CONTENT'

export const DEFAULT_NEW_DOC_CONTENT = `{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"划水AI","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":" "},{"type":"text","text":"www.huashuiAI.com","marks":[{"type":"link","attrs":{"href":"https://www.huashuiai.com/","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}]},{"type":"text","text":" 是一個 AIGC 知識庫平台，像"},{"type":"text","text":"騰訊文檔","marks":[{"type":"link","attrs":{"href":"https://docs.qq.com/","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}]},{"type":"text","text":"、"},{"type":"text","text":"語雀","marks":[{"type":"link","attrs":{"href":"https://www.yuque.com/","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}]},{"type":"text","text":"，國外的 "},{"type":"text","text":"notion","marks":[{"type":"link","attrs":{"href":"https://www.notion.so/","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}]},{"type":"text","text":" 。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"可以創建文檔，管理文檔，編輯文檔。可使用 "},{"type":"text","text":"AI 智能寫作","marks":[{"type":"highlight","attrs":{"color":"#ffc078"}}]},{"type":"text","text":" 快速生成、處理文字。還支持分享和"},{"type":"text","text":"多人協同編輯","marks":[{"type":"highlight","attrs":{"color":"#ffc078"}}]},{"type":"text","text":"。"}]},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"你也可以"},{"type":"text","text":"學習/參與","marks":[{"type":"link","attrs":{"href":"https://www.huashuiai.com/join","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}]},{"type":"text","text":"這個項目完整研發過程，提高個人能力，準備簡歷/面試項目。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"項目 5 大亮點，學完打動面試官："}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Node 全棧能力和 Next.js 框架，從此不再是純前端、切圖仔"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"複雜項目的架構設計能力，這個項目有 50+ 功能"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"超越 99% 前端的技術難度：富文本編輯器，協同編輯（研發中...）"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"真實上線的項目：域名、伺服器、資料庫、Serverless、OSS、CDN、統計、監控、報警..."}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"積累 AI 技能和經驗，未來是 AI 的時代，要選對賽道"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"正在研發中的功能："}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"導入/導出 word pdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"用戶 VIP 支付"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"短信驗證碼登錄"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"等..."}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"注意：拿【划水AI】和 騰訊文檔、飛書、notion 對比 ——  這是不恰當的！！"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"划水AI 是個人/小團隊創業產品，而騰訊文檔有大廠團隊維護，每年研發成本上千萬"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"划水AI 剛初創幾個月，而騰訊文檔等都已發布好多年，經過無數迭代和優化"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"但是，騰訊文檔等也是從初創階段發展起來的。划水AI 也會持續升級和優化，還需要時間，所以，趁早上車"},{"type":"text","text":"加入項目","marks":[{"type":"link","attrs":{"href":"https://www.huashuiai.com/join","target":"_blank","rel":"noopener noreferrer nofollow","class":null}}]},{"type":"text","text":"，一起參與這個過程！"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}}]}`

export const SHARE_DOC_LIST_KEY = 'SHARE_DOC_LIST_KEY'

export const DEFAULT_NEW_DOC_TITLE = "What's Journal Easy?"
export const COLLABORATE_EDIT_USER_COLORS = [
  '#958DF1',
  '#F98181',
  '#FBBC88',
  '#FAF594',
  '#70CFF8',
  '#94FADB',
  '#B9F18D',
  '#C3E2C2',
  '#EAECCC',
  '#AFC8AD',
  '#EEC759',
  '#9BB8CD',
  '#FF90BC',
  '#FFC0D9',
  '#DC8686',
  '#7ED7C1',
  '#F3EEEA',
  '#89B9AD',
  '#D0BFFF',
  '#FFF8C9',
  '#CBFFA9',
  '#9BABB8',
  '#E3F4F4',
]
