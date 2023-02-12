import { MutableRefObject } from 'react'

export interface JSONResponse {
  code?: number | string
  mssg?: string
}

export interface TableResponseData<T> {
  /** 数据 */
  list: T[]
  /** 总数 */
  total: number | string
  /** 总页数 */
  totalRecord: number | string
}

export interface RecordType extends Record<string, any> {
  [k: string]: any
}

export interface TableResponse extends JSONResponse {
  data?: TableResponseData<RecordType>
}

/** 二选一 */
export type FilterOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? K : never
    }[keyof T],
    undefined
  >
>

export type FilterNotOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? never : K
    }[keyof T],
    undefined
  >
>

export type PartialEither<T, K extends keyof any> = {
  [P in Exclude<keyof FilterOptional<T>, K>]-?: T[P]
} & { [P in Exclude<keyof FilterNotOptional<T>, K>]?: T[P] } & {
  [P in Extract<keyof T, K>]?: undefined
}

export type Objects = {
  [name: string]: any
}

export type EitherOr<O extends Objects, L extends string, R extends string> = (
  | PartialEither<Pick<O, L | R>, L>
  | PartialEither<Pick<O, L | R>, R>
) &
  Omit<O, L | R>
/** 二选一 */

export type RefType = MutableRefObject<any> | ((instance: unknown) => void)
