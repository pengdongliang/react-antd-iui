import { useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import type { TooltipProps } from 'antd'
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface'
import { FormItemProps } from 'antd/es/form/FormItem'
import { FormProps } from 'antd/es/form'
import type { EditableConfigType, EditArgumentsType } from '../ITable'
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
export interface ITableColumnObjTypes<T = RecordType>
  extends Partial<ColumnGroupType<T>>,
    Partial<ColumnType<T>> {
  /** 当前单元格是否可以编辑 */
  editable?: EditableType
  /** 当前单元格是否可以自定义显示Tooltip */
  tooltip?: boolean | TooltipProps
  /** 编辑行/单元格表单Form配置props */
  formProps?: FormProps
  /** 编辑行/单元格表单Item配置props */
  formItemProps?: FormItemProps
}

/**
 * ITable表格columns属性数组类型
 */
export type ITableColumnTypes<T = RecordType> = ITableColumnObjTypes<T>[]

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

  const realColumns: ITableColumnTypes = useMemo(() => {
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
