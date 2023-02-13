import dayjs from 'dayjs'

/**
 * 获取最近几天日期快捷操作配置
 * @param arr [3, 7, 30] 天数组
 * @returns {*}
 */
export const getInRecentDaysQuickAction = (arr: number[] = [3, 7, 30]) => {
  return arr.reduce((p: Record<string, any>, c) => {
    const end = dayjs()
    const start = dayjs()
    start.subtract(c, 'days')
    p[`最近${c}天`] = [start, end]
    return p
  }, {})
}

/**
 * 导出文件
 * @param data 文件流
 * @param fileName 文件名
 */
export function exportBlob(data: any, fileName: string) {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  })
  const link = document.createElement('a')
  link.download = `${fileName}`
  link.style.display = 'none'
  link.href = window.URL.createObjectURL(blob)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
