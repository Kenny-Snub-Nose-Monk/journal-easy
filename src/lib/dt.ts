// 時間格式化，返回如 如 "1 年前"、"3 個月前"、"1 天前"、"3 小時前" 等 （ChatGPT 生成的）
export function timeAgo(timeString: string) {
  if (!timeString) return ''
  const previous = new Date(timeString)
  const current = new Date()
  const timeDifference = current.valueOf() - previous.valueOf()
  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  if (years > 0) {
    return years + ' 年前'
  } else if (months > 0) {
    return months + ' 個月前'
  } else if (days > 0) {
    return days + ' 天前'
  } else if (hours > 0) {
    return hours + ' 小時前'
  } else if (minutes > 0) {
    return minutes + ' 分鐘前'
  } else {
    return seconds + ' 秒前'
  }
}

export function isOneWeekAgo(dt: Date) {
  const now = new Date()
  const diff = now.getTime() - dt.getTime()
  const oneWeek = 7 * 24 * 3600 * 1000
  return diff > oneWeek
}

export function isSameMonth(dt: Date) {
  const now = new Date()
  return (
    now.getMonth() === dt.getMonth() && now.getFullYear() === dt.getFullYear()
  )
}

export function getHourStamp() {
  const now = Date.now()
  const hourStamp = now / (60 * 60 * 1000)
  return Math.floor(hourStamp)
}
