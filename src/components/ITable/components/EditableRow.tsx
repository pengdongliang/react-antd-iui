import React, { useMemo } from 'react'
import { Form } from 'antd'
import { FormInstance } from 'antd/es/form'

export type EditableContextType = {
  form?: FormInstance<any>
}

export const EditableContext = React.createContext<EditableContextType>({})

interface EditableRowPropsType {
  index: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowPropsType> = ({ index, ...props }) => {
  const [form] = Form.useForm()

  const rowContext: EditableContextType = useMemo(() => ({ form }), [form])

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={rowContext}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

export default EditableRow
