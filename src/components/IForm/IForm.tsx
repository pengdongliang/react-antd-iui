import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Button, Col, Form, Input, Row, Select, Space } from 'antd'
import type { FormItemProps } from 'antd/es/form/FormItem'
import type { FormProps } from 'antd/es/form'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import type { RecordType } from '../ITable/types/global'
import { ITableColumnTypes, InitParamsType } from '../index'

const { Option } = Select

export interface IFormItemType {
  // 表单name
  name: string
  // 表单Form.Item的props
  formItemProps?: FormItemProps
  // 表单元素名称
  itemName?: string
  // 表单元素的props
  itemProps?: any
  // 表单元素option的props
  optionProps?: any
  itemNode?: React.ReactNode
  [k: string]: any
}

export interface UseTableFormType {
  // 表单Form的props
  formProps?: FormProps
  // 表单Form.Item配置
  formItemOptions?: IFormItemType[]
  // 按钮组, 追加到表单按钮后面
  formItemAppendNodes?: React.ReactNode
  // 追加一行元素
  formItemRowNodes?: React.ReactNode
  // 是否显示查询按钮
  showSearch?: boolean
  // 查询文本
  searchText?: string
  // 是否显示重置按钮
  showReset?: boolean
  // 重置文本
  resetText?: string
  [k: string]: any
}

export interface IFormPropsType {
  initParams?: InitParamsType
  submit?: () => void
  reset?: () => void
  // 表格使用
  useTableForm?: UseTableFormType
  columns?: ITableColumnTypes<RecordType>
}

export type IFormRefType = React.Ref<{
  formRef: FormInstance
}>

const IForm = React.forwardRef((props: IFormPropsType, ref: IFormRefType) => {
  const [form] = Form.useForm()
  const { submit, reset, initParams, useTableForm } = props

  const formRef = useMemo(() => form, [form])
  useImperativeHandle(ref, () => ({
    formRef,
  }))

  const [initialValues, setInitialValues] = useState(initParams)

  useEffect(() => {
    setInitialValues(initParams)
    form.setFieldsValue(initParams)
  }, [initParams, form])

  const dynamicFormItemData: UseTableFormType = useMemo(() => {
    let arr: IFormItemType[] = []
    const { formItemOptions } = useTableForm as UseTableFormType
    if (Array.isArray(formItemOptions) && formItemOptions.length) {
      arr = formItemOptions?.map((i) => {
        return { ...i }
      })
    }
    return { ...useTableForm, formItemOptions: arr }
  }, [useTableForm])

  const formItemNode = dynamicFormItemData?.formItemOptions?.map((i) => {
    if (!i?.name) return null
    const itemName = i?.itemName?.toLocaleLowerCase()
    let itemNode = null
    if (React.isValidElement(i?.itemNode)) {
      itemNode = i?.itemNode
    } else if (itemName) {
      switch (itemName) {
        case 'input':
          itemNode = (
            <Input onPressEnter={submit} allowClear {...i?.itemProps} />
          )
          break
        case 'select':
          itemNode = (
            <Select allowClear {...i?.itemProps}>
              {i?.itemProps?.options.map(
                (p: { label: string; value: string | number }) => (
                  <Option
                    {...i?.optionProps}
                    value={p?.value}
                    title={p?.label}
                  />
                )
              )}
            </Select>
          )
          break
        default:
          itemNode = null
          break
      }
    }

    if (!itemNode) return null

    return (
      <Col key={`${i?.name}-${i?.itemName}`}>
        <Form.Item {...i?.formItemProps} name={i?.name}>
          {itemNode}
        </Form.Item>
      </Col>
    )
  })

  const {
    formItemAppendNodes: formItemAppendNodesItem,
    formItemRowNodes: formItemRowNodesItem,
    showSearch = true,
    showReset = true,
    searchText = '查询',
    resetText = '重置',
  } = useTableForm

  return (
    <Form
      {...useTableForm?.formProps}
      form={form}
      initialValues={initialValues}
    >
      <Space direction="vertical">
        <Row gutter={24}>
          {formItemNode}
          <Col>
            <Space wrap size={20}>
              {showSearch && (
                <Button type="primary" onClick={submit}>
                  {searchText}
                </Button>
              )}
              {showReset && <Button onClick={reset}>{resetText}</Button>}
              {formItemAppendNodesItem}
            </Space>
          </Col>
        </Row>
        <Row>{formItemRowNodesItem}</Row>
      </Space>
    </Form>
  )
})

IForm.displayName = 'IForm'

export default IForm
