import dayjs from 'dayjs'
import type { DatePickerProps } from 'antd'

/**
 * 获取最近几天日期快捷操作配置
 * @param arr [3, 7, 30] 天数组
 * @param propsName 默认presets, Antd5.x以下使用ranges
 * @returns {*}
 */
export const getInRecentDaysQuickAction = <T = DatePickerProps['presets']>(
  arr: number[] = [3, 7, 30],
  propsName = 'presets'
): T => {
  if (propsName === 'ranges') {
    return arr.reduce((p: Record<string, any>, c) => {
      const end = dayjs()
      const start = dayjs()
      start.subtract(c, 'days')
      p[`最近${c}天`] = [start, end]
      return p
    }, {}) as T
  }
  return arr.reduce((p, c) => {
    const end = dayjs()
    const start = dayjs()
    start.subtract(c, 'days')
    p.push({
      label: `最近${c}天`,
      value: [start, end],
    })
    return p
  }, []) as T
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

/**
 * 字符串小驼峰转下划线
 * @param str {string} 字符串
 */
export function smallHumpToLowerLine(str: string): string {
  let temp = str.replace(/[A-Z]/g, (match) => {
    return `_${match.toLowerCase()}`
  })
  if (temp.slice(0, 1) === '_') {
    temp = temp.slice(1)
  }
  return temp
}

/**
 * 字符串下划线转小驼峰
 * @param str {string} 字符串
 */
export function lowerLineToSmallHump(str: string): string {
  return str.replace(/([^_])_+([^_])/g, ($0, $1, $2) => {
    return $1 + $2.toUpperCase()
  })
}

/**
 * 获取url参数字符串
 * @param params params对象
 * @param filterRequestValue 过滤请求参数, 默认true过滤undefined和空字符串, 也可以传入一个函数
 */
export function filterRequestParams(
  params: Record<string, any>,
  filterRequestValue: true | ((key: string, value: any) => any) = true
): Record<string, any> {
  let newParamsData = {}
  if (params) {
    if (
      filterRequestValue &&
      Object.prototype.toString.call(params).match(/^\[object\s(.*)\]$/)[1] ===
        'Object'
    ) {
      Object.entries(params).forEach(([key, value]) => {
        if (typeof filterRequestValue === 'function') {
          const newValue = filterRequestValue(key, value)
          newParamsData = { ...newParamsData, [key]: newValue }
        } else if (value !== undefined && value !== '') {
          newParamsData = { ...newParamsData, [key]: value }
        }
      })
    } else {
      newParamsData = params
    }
  }
  return newParamsData
}
