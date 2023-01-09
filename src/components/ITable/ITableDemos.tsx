import React, { useEffect, useRef, useState } from 'react'
import { Button, TimePicker, Space, Typography } from 'antd'
import type { FixedType } from 'rc-table/lib/interface'
import ITable from './index'
import type { useTableFormType } from '../IForm'
import type { RecordType, RefType } from './types/global'

const ITableDemos: React.FC<unknown> = () => {
  const dataSource = [
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Frank-Peter',
        last: 'Bamberger',
      },
      location: {
        street: {
          number: 4982,
          name: 'Gartenstraße',
        },
        city: 'Berka/Werra',
        state: 'Sachsen',
        country: 'Germany',
        postcode: 59179,
        coordinates: {
          latitude: '-51.4016',
          longitude: '-29.9109',
        },
        timezone: {
          offset: '+1:00',
          description: 'Brussels, Copenhagen, Madrid, Paris',
        },
      },
      email: 'frank-peter.bamberger@example.com',
      login: {
        uuid: '407751c8-c08a-4e49-91b2-ebc57c6177b2',
        username: 'sadcat912',
        password: 'anita',
        salt: 'XbIQ5rMM',
        md5: 'c47a938093fdc7aa542d40e7a2488394',
        sha1: '493b49df25bb2c45befb61bc7c27dd884eadf159',
        sha256:
          'e61cf68c5919890a84070ca0202d6bfea174f6a2232a740c6226a17ee9a161fc',
      },
      dob: {
        date: '1984-03-30T10:28:11.898Z',
        age: 38,
      },
      registered: {
        date: '2018-07-05T22:26:22.283Z',
        age: 4,
      },
      phone: '0473-1447124',
      cell: '0176-7086115',
      id: {
        name: 'SVNR',
        value: '71 300384 B 109',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/34.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/34.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/34.jpg',
      },
      nat: 'DE',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Albert',
        last: 'Sánchez',
      },
      location: {
        street: {
          number: 6810,
          name: 'Calle de Ángel García',
        },
        city: 'Elche',
        state: 'País Vasco',
        country: 'Spain',
        postcode: 64035,
        coordinates: {
          latitude: '-38.5165',
          longitude: '-17.2339',
        },
        timezone: {
          offset: '-2:00',
          description: 'Mid-Atlantic',
        },
      },
      email: 'albert.sanchez@example.com',
      login: {
        uuid: 'ac1ca128-d3e5-400d-aab3-e94238f34ead',
        username: 'ticklishbird294',
        password: 'nikki1',
        salt: 'tkmH9mq6',
        md5: '1d6007c7b23e5d74950be1d423e009a2',
        sha1: 'f4dc74cbd33027553edfa0783fcb61a4bb1461d0',
        sha256:
          'fa6b04498530ddc8e277202f44a98b9d75cc4ef2a034466b4009d48089746671',
      },
      dob: {
        date: '1968-01-11T01:25:19.395Z',
        age: 54,
      },
      registered: {
        date: '2014-11-24T15:39:19.532Z',
        age: 8,
      },
      phone: '983-225-179',
      cell: '641-570-439',
      id: {
        name: 'DNI',
        value: '88994122-R',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/19.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/19.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/19.jpg',
      },
      nat: 'ES',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Miguel',
        last: 'Williams',
      },
      location: {
        street: {
          number: 8330,
          name: 'Oak Ridge Ln',
        },
        city: 'Sydney',
        state: 'Tasmania',
        country: 'Australia',
        postcode: 8721,
        coordinates: {
          latitude: '-81.8400',
          longitude: '-102.2533',
        },
        timezone: {
          offset: '-2:00',
          description: 'Mid-Atlantic',
        },
      },
      email: 'miguel.williams@example.com',
      login: {
        uuid: '6a3c5339-2ce6-428c-976f-ecff7134a06b',
        username: 'sadlion798',
        password: 'keisha',
        salt: '5BjEJESH',
        md5: 'e72396cdedc483a89333dcae79250c10',
        sha1: 'ca108a4cfbe0e0bf7386ce1f5474a1b4972c1fe5',
        sha256:
          '58c5be0084595c5e09768327b766eac11b9f8cd9f021203d37277e4eb75a3a86',
      },
      dob: {
        date: '1946-05-13T11:40:39.931Z',
        age: 76,
      },
      registered: {
        date: '2002-06-09T16:53:20.134Z',
        age: 20,
      },
      phone: '06-9109-7509',
      cell: '0451-771-342',
      id: {
        name: 'TFN',
        value: '906445944',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/78.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/78.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/78.jpg',
      },
      nat: 'AU',
    },
    {
      gender: 'female',
      name: {
        title: 'Mrs',
        first: 'Mackenzie',
        last: 'Jones',
      },
      location: {
        street: {
          number: 6879,
          name: 'Crawford Street',
        },
        city: 'Porirua',
        state: 'Marlborough',
        country: 'New Zealand',
        postcode: 70246,
        coordinates: {
          latitude: '85.5217',
          longitude: '-41.0851',
        },
        timezone: {
          offset: '+5:45',
          description: 'Kathmandu',
        },
      },
      email: 'mackenzie.jones@example.com',
      login: {
        uuid: 'd9ca1e72-797b-488b-9c00-cbe20fb90f83',
        username: 'organicbutterfly252',
        password: 'celine',
        salt: '9Ibz6tjR',
        md5: '38ab620314b9e12e5d2660a9989388d7',
        sha1: 'd3e0e9c362da36861f7361f3d8721ee57ba438fd',
        sha256:
          '9eb36a7aec53f19ae45e8255c6886df381960b9ce95e9b319d0396927bae3fa3',
      },
      dob: {
        date: '1967-03-01T12:51:45.288Z',
        age: 55,
      },
      registered: {
        date: '2005-09-06T00:53:20.757Z',
        age: 17,
      },
      phone: '(836)-410-1344',
      cell: '(705)-852-4176',
      id: {
        name: '',
        value: null,
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/women/43.jpg',
        medium: 'https://randomuser.me/api/portraits/med/women/43.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
      nat: 'NZ',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Adam',
        last: 'Artyushenko',
      },
      location: {
        street: {
          number: 3423,
          name: 'Trohsvyatitelska',
        },
        city: 'Perechin',
        state: 'Kirovogradska',
        country: 'Ukraine',
        postcode: 44162,
        coordinates: {
          latitude: '39.0541',
          longitude: '87.2741',
        },
        timezone: {
          offset: '-8:00',
          description: 'Pacific Time (US & Canada)',
        },
      },
      email: 'adam.artyushenko@example.com',
      login: {
        uuid: '2473e0a6-78f7-46dc-895a-cb2a6af806e4',
        username: 'happygorilla276',
        password: 'windows',
        salt: 'NaaInutN',
        md5: '4d545e1ca77be6240f48d0d04750b98f',
        sha1: 'cfb62727dc51c26f4933fd75cc991a8edc6177eb',
        sha256:
          'f6c93265133e0dbb9c6d100b1938c07f6da2968f022e1ba42d1aa849cf844718',
      },
      dob: {
        date: '1949-02-20T19:25:40.144Z',
        age: 73,
      },
      registered: {
        date: '2007-07-03T02:47:24.587Z',
        age: 15,
      },
      phone: '(068) R00-0385',
      cell: '(066) B28-6600',
      id: {
        name: '',
        value: null,
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/23.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/23.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/23.jpg',
      },
      nat: 'UA',
    },
    {
      gender: 'female',
      name: {
        title: 'Miss',
        first: 'Sara',
        last: 'Edwards',
      },
      location: {
        street: {
          number: 5464,
          name: 'Plum St',
        },
        city: 'Perth',
        state: 'South Australia',
        country: 'Australia',
        postcode: 5547,
        coordinates: {
          latitude: '-63.0399',
          longitude: '70.3411',
        },
        timezone: {
          offset: '-7:00',
          description: 'Mountain Time (US & Canada)',
        },
      },
      email: 'sara.edwards@example.com',
      login: {
        uuid: '3912627d-6a61-4025-b7b1-8d8372cae600',
        username: 'ticklishswan257',
        password: 'bluefish',
        salt: '6pcWTh8B',
        md5: 'fb5debc6ab0a8dec7a11d63799d1a3b4',
        sha1: '7b484edb956e7ca06a788137eff8e047d0c469cd',
        sha256:
          'a6a60b97855efe4b84da63e9b5e834b4d06d7fbd768cf8f5e6d20742faed3d4a',
      },
      dob: {
        date: '1995-07-24T21:18:59.393Z',
        age: 27,
      },
      registered: {
        date: '2015-12-16T16:37:58.488Z',
        age: 7,
      },
      phone: '08-1345-7947',
      cell: '0448-407-224',
      id: {
        name: 'TFN',
        value: '376992695',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/women/47.jpg',
        medium: 'https://randomuser.me/api/portraits/med/women/47.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/47.jpg',
      },
      nat: 'AU',
    },
  ]
  const itableRef: RefType = useRef(null)

  const columns = [
    {
      title: 'name',
      dataIndex: ['name', 'last'],
      fixed: true,
      width: 150,
    },
    {
      title: 'email',
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
      rules: [{ required: true, message: '请输入邮箱' }],
      editable: {
        handleSave: (record: RecordType) => {
          // eslint-disable-next-line no-console
          console.log('editRecord', record)
          itableRef.current?.refresh()
        },
      },
    },
    {
      title: 'phone',
      dataIndex: 'phone',
      width: 150,
      editable: true,
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'opt',
      width: 150,
      fixed: 'right' as FixedType,
      editable: true,
      render: (value: string, record: RecordType, index: number) => {
        return [<Typography.Link>查看</Typography.Link>]
      },
    },
  ]

  const [initParams, setInitParams] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshDeps, setRefreshDeps] = useState(false)
  const [useTableForm, setUseTableForm] = useState<useTableFormType>({
    formItemOptions: [
      {
        name: 'gender',
        itemName: 'select',
        itemProps: {
          style: { width: '120px' },
          options: [
            {
              value: 'male',
              label: 'male',
            },
            {
              value: 'lucy',
              label: 'Lucy',
            },
            {
              value: 'disabled',
              disabled: true,
              label: 'Disabled',
            },
            {
              value: 'Yiminghe',
              label: 'yiminghe',
            },
          ],
        },
        formItemProps: { initialValue: 'lucy' },
      },
      {
        name: 'name',
        itemName: 'input',
        itemProps: { placeholder: '请输入名称' },
        formItemProps: {
          label: '名称',
          rules: [{ required: true, message: '请输入名称' }],
        },
      },
      {
        name: 'time',
        itemNode: <TimePicker />,
      },
    ],
    formItemAppendNodes: [
      <Button onClick={() => itableRef.current?.refresh()}>刷新</Button>,
      <Button onClick={() => itableRef.current?.refreshAsync()}>
        同步刷新
      </Button>,
      <Button onClick={() => itableRef.current?.cancel()}>取消</Button>,
    ],
  })

  useEffect(() => {
    setTimeout(() => {
      setInitParams((prevState) => {
        const obj = {
          ...prevState,
          name: 'jack',
          gender: 'male',
        }
        return obj
      })
      setTimeout(() => {
        setRefreshDeps(true)
      }, 1000)
      setUseTableForm((i) => ({
        ...i,
        formItemRowNodes: (
          <Space>
            <Button>导出</Button>
          </Space>
        ),
      }))
    }, 500)
  }, [])

  return (
    <div style={{ padding: '40px' }}>
      <Space direction="vertical" style={{ display: 'flex' }}>
        <ITable
          columns={columns}
          getTableDataApi="1"
          initPaginationConfig={{ current: 2, pageSize: 4 }}
          initParams={initParams}
          ref={itableRef}
          blockAutoRequestFlag="auto"
          dataSource={dataSource}
          // simpleTableFlag
          // useAntdTableOptions={{ refreshDeps: [refreshDeps] }}
          useTableForm={useTableForm}
          editableConfig={{
            editRowFlag: true,
            onChange: (record) => {
              // eslint-disable-next-line no-console
              console.log('editOnchange', record)
            },
          }}
        >
          <Button onClick={() => itableRef.current?.refresh()}>刷新</Button>
        </ITable>
        <div>底部内容</div>
      </Space>
    </div>
  )
}

export default ITableDemos
