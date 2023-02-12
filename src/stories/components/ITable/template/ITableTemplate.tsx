import { ComponentStory } from '@storybook/react'
import { ITable } from '@/index'

export const Template: ComponentStory<typeof ITable> = (args) => (
  <ITable {...args} />
)
