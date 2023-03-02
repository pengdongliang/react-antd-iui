import { Input } from 'antd'
import InternalInput from './IInput'
import type { IInputProps, IInputRef } from './IInput'
import ITextArea from './ITextArea'
import ISearch from './ISearch'
import IPassword from './IPassword'

export type { IInputProps, IInputRef } from './IInput'
export type { ITextAreaProps, ITextAreaRef } from './ITextArea'
export type { ISearchProps, ISearchRef } from './ISearch'
export type { IPasswordProps, IPasswordRef } from './IPassword'

type CompoundedComponent = React.ForwardRefExoticComponent<
  IInputProps & React.RefAttributes<IInputRef>
> & {
  Group: typeof Input.Group
  ISearch: typeof ISearch
  ITextArea: typeof ITextArea
  IPassword: typeof IPassword
}

const IInput = InternalInput as unknown as CompoundedComponent

IInput.Group = Input.Group
IInput.ISearch = ISearch
IInput.ITextArea = ITextArea
IInput.IPassword = IPassword

export default IInput
