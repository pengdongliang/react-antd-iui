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
