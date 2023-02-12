import { useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import type { TooltipProps } from 'antd'
import type {
  ITableProps,
  EditableConfigType,
  EditArgumentsType,
} from '../ITable'
import EditableRow from '../components/EditableRow'
import EditableCell from '../components/EditableCell'
import type { RecordType } from '../types/global'

/**
 * 编辑类型
 */
export type EditableType =
  | {
      handleSave: (args: EditArgumentsType) => void
    }
  | boolean

/**
 * ITable表格columns属性类型
 */
export type ITableColumnTypes = (Exclude<
  ITableProps['columns'],
  undefined
>[number] & {
  /** 当前单元格是否可以编辑 */
  editable?: EditableType
  /** dataIndex */
  dataIndex?: string
  /** 当前单元格是否可以自定义显示Tooltip */
  tooltip?: boolean | TooltipProps
})[]

/**
 * columns处理钩子props类型
 */
export interface UseTableColumnsPropsType {
  /** 表格columns属性 */
  columns: ITableColumnTypes
  /** props配置的编辑参数 */
  editableConfig?: EditableConfigType
  /** 序号 */
  serialNumber?: boolean | number
}

/**
 * 表格columns处理
 * @param props
 */
function useTableColumns(props: UseTableColumnsPropsType): {
  realColumns: ITableColumnTypes
  components: any
} {
  const { columns, editableConfig = {}, serialNumber } = props
  const [hasColumnEditable, setHasColumnEditable] = useState(false)

  const realColumns = useMemo(() => {
    const { onChange, editRowFlag } = editableConfig as Exclude<
      EditableConfigType,
      boolean
    >
    const mapCol = columns?.map((col) => {
      const { editable, tooltip, dataIndex, render } = col
      let newCol = col
      if (tooltip) {
        const tooltipProps =
          Object.prototype.toString
            .call(tooltip)
            .match(/^\[object\s(.*)\]$/)[1] === 'Object'
            ? (tooltip as TooltipProps)
            : {}
        newCol = {
          ...newCol,
          render: (text, record, index) => (
            <Tooltip
              placement="topLeft"
              destroyTooltipOnHide
              title={text}
              color="orange"
              {...tooltipProps}
            >
              <div
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  const target = e.target as HTMLDivElement
                  if (target.clientWidth >= target.scrollWidth) {
                    target.style.pointerEvents = 'none' // 阻止鼠标事件
                    if (render) {
                      e.currentTarget.style.pointerEvents = 'none' // 阻止鼠标事件
                    }
                  }
                }}
              >
                {render ? render(text, record, index) : text}
              </div>
            </Tooltip>
          ),
        }
      }
      if (
        !onChange ||
        (!editable && dataIndex !== 'opt') ||
        (!editRowFlag && dataIndex === 'opt')
      ) {
        return newCol
      }
      if (editable && !hasColumnEditable) {
        setHasColumnEditable(true)
      }
      const { handleSave } = (editable ?? {}) as Exclude<EditableType, boolean>
      const changeHandler = editRowFlag ? onChange : handleSave || onChange
      return {
        ...newCol,
        onCell: (record: RecordType, rowIndex) => {
          return {
            ...newCol,
            record,
            rowIndex,
            changeHandler,
            editRowFlag,
          }
        },
      }
    })
    if (
      Array.isArray(mapCol) &&
      mapCol.length &&
      (serialNumber === 0 || serialNumber)
    ) {
      mapCol.unshift({
        title: '序号',
        dataIndex: 'serial$number',
        width: 62,
        fixed: !!mapCol[0]?.fixed,
        render: (text, record, index) => {
          return index + (typeof serialNumber === 'number' ? serialNumber : 1)
        },
      })
    }
    return mapCol
  }, [
    columns,
    editableConfig,
    hasColumnEditable,
    serialNumber,
  ]) as ITableColumnTypes

  const components = useMemo(() => {
    return hasColumnEditable && editableConfig
      ? {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }
      : {}
  }, [editableConfig, hasColumnEditable])

  return { realColumns, components }
}

export default useTableColumns
