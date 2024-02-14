import QueryString from 'qs'

export const fetcher = async (
  path: string,
  urlParamsObject?: Record<string, string>,
  options?: RequestInit
) => {
  return await fetch(`${path}${urlParamsObject ? `?${QueryString.stringify(urlParamsObject)}` : ''}`, options)
}