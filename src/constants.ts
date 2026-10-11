export const CONTENT_WIDTH = 760 // 內容寬度
export const EDITOR_PADDING_BOTTOM = 200 // 編輯器 padding-bottom
export const EDITOR_CHARACTER_LIMIT = 50000 // 編輯器字數限制，

export const WORK_CONTENT_SCROLL_CONTAINER = 'work-content-scroll-container'
export const WORK_CONTENT_CONTAINER_ID = 'work-content-container'
export const WORK_CONTENT_PANEL_ID = 'work-content-panel'
export const DOC_TITLE_INPUT_ID = 'DOC_TITLE_INPUT_ID'
export const LAST_DOC_ID_KEY = 'LAST_DOC_ID'

export const DEFAULT_NEW_DOC_TITLE = '歡迎使用簡單日記'
export const DEFAULT_NEW_DOC_CONTENT = `{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"簡單日記","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":" 是一個結合 AI 的寫作空間，用來記錄生活、整理想法、累積你的個人知識庫。"}]},{"type":"heading","attrs":{"textAlign":"left","level":2},"content":[{"type":"text","text":"三十秒上手"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"／","marks":[{"type":"code"}]},{"type":"text","text":" 叫出格式選單：標題、清單、表格、程式碼、Mermaid 圖表都在這裡"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"在空白段落按空白鍵，直接使用 "},{"type":"text","text":"AI 智慧寫作","marks":[{"type":"highlight","attrs":{"color":"#ffc078"}}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"選取一段文字，讓 AI 幫你潤飾、擴寫、換個語氣或翻譯"}]}]}]},{"type":"heading","attrs":{"textAlign":"left","level":2},"content":[{"type":"text","text":"可以做什麼"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"用左側目錄整理日記與筆記，支援拖曳排序與多層結構"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"分享給朋友，一起 "},{"type":"text","text":"即時協同編輯","marks":[{"type":"highlight","attrs":{"color":"#ffc078"}}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"需要留存或公開時，匯出 PDF，或一鍵發布成公開網頁"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"改壞了不用怕，隨時從歷史版本還原"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"刪掉這一篇，寫下你的第一則日記吧。"}]},{"type":"paragraph","attrs":{"textAlign":"left"}}]}`
export const DEFAULT_NEW_DOC_TITLE_EN = 'Welcome to Journal Easy'
export const DEFAULT_NEW_DOC_CONTENT_EN = `{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Journal Easy","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":" is an AI-powered writing space for your journals, notes and ideas."}]},{"type":"heading","attrs":{"textAlign":"left","level":2},"content":[{"type":"text","text":"Get started in 30 seconds"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"/","marks":[{"type":"code"}]},{"type":"text","text":" opens the format menu — headings, lists, tables, code blocks and Mermaid diagrams"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Press space on an empty line to use "},{"type":"text","text":"AI writing","marks":[{"type":"highlight","attrs":{"color":"#ffc078"}}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Select any text and let AI polish, expand, retone or translate it"}]}]}]},{"type":"heading","attrs":{"textAlign":"left","level":2},"content":[{"type":"text","text":"What you can do"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Organise entries in the sidebar with drag-and-drop and nested folders"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Share a document and "},{"type":"text","text":"edit together in real time","marks":[{"type":"highlight","attrs":{"color":"#ffc078"}}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Export to PDF, or publish a document as a public page"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Restore any earlier version from the history panel"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Delete this page and write your first entry."}]},{"type":"paragraph","attrs":{"textAlign":"left"}}]}`

export const MAX_DOC_COUNT = 100 // 最大文檔數量

export const AI_RES_MAX_TOKENS = 600 // AI 返回結果最大長度
export const AI_CONTEXT_MAX_LENGTH = 600 // 上下文最大長度，請求 AI 接口時
export const AI_PANEL_HISTORY_TURNS = 3 // AI 面板：預設攜帶最近 N 輪歷史（user+assistant 成對）
export const AI_DEFAULT_TOKEN_LIMIT = 100000 // AI 預設 token limit
export const AI_REQUEST_DELAY = 5 // AI 請求間隔時間 秒

export const EVENT_KEY_NAV_DOC = 'E_K_NAV_DOC'
export const EVENT_KEY_FOCUS_AI = 'E_K_FOCUS_AI'
export const EVENT_KEY_FOCUS_CONTENT = 'E_K_FOCUS_CONTENT' // 聚焦到編輯器內容區域
export const EVENT_KEY_FOCUS_EDITOR = 'E_K_FOCUS_EDITOR' // 聚焦到編輯器
export const EVENT_KEY_INSERT_TO_EDITOR = 'E_K_INSERT_TO_EDITOR' // 插入到編輯器
export const EVENT_KEY_REPLACE_EDITOR_SEL_CONTENT = 'E_K_REPLACE_EDITOR_SEL_CONTENT' // 替換編輯器選中內容
export const EVENT_KEY_EDITOR_AI_MENU = 'E_K_EDITOR_AI_MENU' // 編輯器 AI 菜單

export const EVENT_SET_EDITOR_READONLY = 'E_K_EDITOR_READONLY' // 設置編輯器只讀
export const EVENT_SET_EDITOR_EDITABLE = 'E_K_EDITOR_EDITABLE' // 設置編輯器可編輯

export const MAX_SHARE_COUNT = 10 // 最大分享人數

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

export const DOC_ICON_LIST = [
  '📄',
  '📚',
  '🛠',
  '🙃',
  '😝',
  '😇',
  '🤓',
  '🙄',
  '🥶',
  '💾',
  '🏪',
  '⏰',
  '🕵️‍♀️',
  '🔬',
  '🗺',
  '💜',
  '🐵',
  '🐶',
  '🐻',
  '🐰',
  '🐈‍⬛',
  '🐈',
  '🐕',
  '🦒',
  '🐪',
  '🦓',
  '🍌',
  '🍒',
  '🍋',
  '🍎',
  '🍉',
  '🌽',
  '🌶️',
  '🌏',
  '🏠',
  '🧭',
  '🌐',
  '🏖️',
  '🏗️',
  '🎡',
  '🎃',
  '🎄',
  '🎲',
  '⛺',
  '🥾',
  '🎵',
  '🎹',
  '🎸',
  '🔔',
  '📢',
  '🎤',
  '🎨',
  '🧨',
  '🔥',
  '🎈',
  '🌙',
  '⭐',
  '🌞',
  '🌊',
  '👓',
  '🕶️',
  '🛍️',
  '💊',
  '⚽',
  '🏀',
  '🚗',
  '🚐',
  '🚄',
  '🛩️',
  '🚲',
]
