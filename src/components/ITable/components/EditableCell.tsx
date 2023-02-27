import React, {
  HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Divider, Form, InputRef, Space, Typography } from 'antd'
import { EditableContext } from './EditableRow'
import type { EditableContextType } from './EditableRow'
import type {
  EditableType,
  ITableColumnObjTypes,
} from '../hooks/useTableColumns'
import { ItableContext } from '../ITable'
import type { ItableContextType } from '../ITable'
import type { RecordType } from '../types/global'
import { IInput } from '@/components'

interface EditableCellPropsType extends Omit<ITableColumnObjTypes, 'children'> {
  editable: EditableType
  children: React.ReactNode
  dataIndex: keyof RecordType
  record: RecordType
  rowIndex: number
  changeHandler: (record: RecordType) => void
  editRowFlag: boolean
  disabled?: boolean
}

const EditableCell: React.FC<EditableCellPropsType> = ({
  editable,
  children,
  dataIndex,
  record,
  changeHandler,
  editRowFlag,
  rowIndex,
  formItemProps,
  disabled,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const { form } = useContext(
    EditableContext as React.Context<Required<EditableContextType>>
  )
  const { rowKey, editingRowKey, setEditingRowKey } = useContext(
    ItableContext as React.Context<Required<ItableContextType>>
  )
  const realRowKey = `${rowIndex}$_$${
    rowKey ? (record ?? {})[rowKey as string] : ''
  }`
  const realEditingKeyRowFlag = realRowKey === editingRowKey
  const colKey = `${realRowKey}-${rowIndex}-${dataIndex}`

  useEffect(() => {
    if (!editRowFlag && editing) {
      inputRef.current?.focus()
    }
  }, [editRowFlag, editing])

  const toggleEdit = useCallback(() => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }, [dataIndex, editing, form, record])

  const save = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      try {
        const values = await form.validateFields()
        if (editRowFlag) {
          setEditingRowKey('')
          e?.target?.blur()
          form.resetFields()
        } else {
          toggleEdit()
        }
        if (editRowFlag || record[dataIndex] !== values[dataIndex]) {
          changeHandler.call(null, {
            record: { ...record, ...values },
            fieldValue: values[dataIndex],
            fieldName: dataIndex,
            fieldsValue: values,
            rowIndex,
          })
        }
      } catch (errInfo) {
        // eslint-disable-next-line no-console
        console.log('Save failed:', errInfo)
      }
    },
    [
      form,
      editRowFlag,
      record,
      dataIndex,
      setEditingRowKey,
      toggleEdit,
      changeHandler,
      rowIndex,
    ]
  )

  const edit = useCallback(
    (row: Partial<RecordType> & { key: React.Key }) => {
      form.setFieldsValue({ ...row })
      setEditingRowKey(realRowKey)
    },
    [form, realRowKey, setEditingRowKey]
  )

  const cancel = useCallback(() => {
    setEditingRowKey('')
  }, [setEditingRowKey])

  const childrenHOC = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement<React.HTMLAttributes<unknown>>(
          child as React.ReactElement,
          {
            style: { userSelect: 'none', ...child?.props?.style },
            onClick: (...params) => {
              if (editRowFlag) {
                setEditingRowKey('')
              }
              const columnOnClick = (child?.props as React.ComponentProps<any>)
                ?.onClick
              if (typeof columnOnClick === 'function') columnOnClick(...params)
            },
            key: colKey,
          }
        )
      : child
  )

  const childNode = useMemo(() => {
    if (dataIndex === 'opt') {
      if (editRowFlag) {
        const editNode = realEditingKeyRowFlag ? (
          <Space split={<Divider type="vertical" />}>
            <Typography.Link onClick={() => save()}>保存</Typography.Link>
            <Typography.Link onClick={() => cancel()}>取消</Typography.Link>
          </Space>
        ) : (
          <Typography.Link
            disabled={disabled || !!realEditingKeyRowFlag}
            onClick={() =>
              edit(record as Partial<RecordType> & { key: React.Key })
            }
          >
            编辑
          </Typography.Link>
        )
        return (
          <Space split={<Divider type="vertical" />}>
            {editNode}
            {childrenHOC}
          </Space>
        )
      }
      return childrenHOC
    }
    if (editable) {
      const divProps =
        editRowFlag || disabled
          ? {}
          : {
              onClick: toggleEdit,
              className: 'itable-editable-cell itable-editable-cell-value-wrap',
              title: '点击编辑',
            }
      const inputProps = editRowFlag ? {} : { onBlur: save }
      return realEditingKeyRowFlag || editing ? (
        <Form.Item {...formItemProps} style={{ margin: 0 }} name={dataIndex}>
          <IInput
            {...inputProps}
            ref={inputRef}
            onPressEnter={save}
            style={{ textAlign: restProps?.align }}
            disabled={disabled}
          />
        </Form.Item>
      ) : (
        <div {...divProps}>{childrenHOC}</div>
      )
    }
    return childrenHOC
  }, [
    dataIndex,
    editable,
    childrenHOC,
    editRowFlag,
    realEditingKeyRowFlag,
    save,
    cancel,
    edit,
    record,
    toggleEdit,
    editing,
    formItemProps,
    restProps?.align,
    disabled,
  ])

  delete restProps.sortConfig
  delete restProps.sortDirections
  delete restProps.showSorterTooltip
  const filterProps = {
    key: colKey,
    ...restProps,
    title: '',
    render: '',
    sorter: '',
  } as HTMLAttributes<any>

  return (
    <td {...filterProps} key={colKey}>
      {childNode}
    </td>
  )
}
export default EditableCell
