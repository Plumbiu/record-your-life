import { getYMD, UsageMap } from '@record-your-life/shared'
import { AxiosResponse } from 'axios'
import request from '@/utils/request'

export async function getAppByDate(
  date: string = getYMD(),
): Promise<UsageMap | undefined> {
  const usage = await request.get<any, AxiosResponse<UsageMap>>(`/date/${date}`)
  return usage.data
}

export async function getDates() {
  const raw = await request.get<any, AxiosResponse<string[]>>('/date')
  return raw.data.map((item) => item.replace('.json', ''))
}
