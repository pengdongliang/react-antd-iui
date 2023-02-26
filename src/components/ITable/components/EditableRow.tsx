import React, { HTMLAttributes, useMemo } from 'react'
import { Form } from 'antd'
import { FormInstance } from 'antd/es/form'
import { ITableColumnObjTypes } from '@/components/ITable/hooks/useTableColumns'

export type EditableContextType = {
  form?: FormInstance<any>
}

export const EditableContext = React.createContext<EditableContextType>({})

interface EditableRowPropsType extends ITableColumnObjTypes {
  index: number
}

const EditableRow: React.FC<EditableRowPropsType> = ({ index, ...props }) => {
  const { formProps, ...restProps } = props
  const [form] = Form.useForm()
  const rowContext: EditableContextType = useMemo(() => ({ form }), [form])
  delete restProps.sortConfig
  delete restProps.sortDirections
  delete restProps.showSorterTooltip
  const filterProps = {
    ...restProps,
    title: '',
    render: '',
    sorter: '',
  } as HTMLAttributes<any>

  return (
    <Form {...formProps} form={form} component={false}>
      <EditableContext.Provider value={rowContext}>
        <tr {...filterProps} />
      </EditableContext.Provider>
    </Form>
  )
}

export default EditableRow
