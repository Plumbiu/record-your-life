import { getYMD, UsageArr, UsageMap } from '@record-your-life/shared'
import { AxiosResponse } from 'axios'
import axios from '@/plugins/axios'

export async function getAppByDate(
  date: string = getYMD(),
): Promise<UsageArr[] | undefined> {
  const usage = await axios.get<any, AxiosResponse<UsageMap>>(`/date/${date}`)
  return Object.entries(usage?.data ?? {})
    .map(([name, value]) => ({
      name,
      ...value,
    }))
    .sort((a, b) => b.total - a.total)
}

export async function getDates() {
  const raw = await axios.get<any, AxiosResponse<string[]>>('/date')
  return raw.data.map((item) => item.replace('.json', ''))
}
