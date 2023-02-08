import { useMemo } from 'react'
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

export type EditableType =
  | {
      handleSave: (args: EditArgumentsType) => void
    }
  | boolean

export type ITableColumnTypes = (Exclude<
  ITableProps['columns'],
  undefined
>[number] & {
  // 当前单元格是否可以编辑
  editable?: EditableType
  dataIndex?: string
  // 当前单元格是否可以自定义显示Tooltip
  tooltip?: boolean | TooltipProps
})[]

export interface UseTableColumnsPropsType {
  columns: ITableColumnTypes
  editableConfig?: EditableConfigType
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

  const realColumns = useMemo(() => {
    const { onChange, editRowFlag } = editableConfig as Exclude<
      EditableConfigType,
      boolean
    >
    const mapCol = columns?.map((col) => {
      const { editable, tooltip, render } = col
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
      if (!onChange || !editable) {
        return newCol
      }
      const { handleSave } = editable as Exclude<EditableType, boolean>
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
  }, [columns, editableConfig, serialNumber]) as ITableColumnTypes

  const components = useMemo(() => {
    return editableConfig
      ? {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }
      : {}
  }, [editableConfig])

  return { realColumns, components }
}

export default useTableColumns
