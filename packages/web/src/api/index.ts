import {
  getYMD,
  UsageArr,
  UsageMap,
  UsageWithDate,
} from '@record-your-life/shared'
import { AxiosResponse } from 'axios'
import axios from '@/plugins/axios'

export async function getAppByDate(
  date: string = getYMD(),
): Promise<UsageArr[] | undefined> {
  try {
    const usage = await axios.get<any, AxiosResponse<UsageMap>>(`/date/${date}`)

    return Object.entries(usage?.data ?? {})
      .map(([name, value]) => ({
        name,
        ...value,
      }))
      .sort((a, b) => b.total - a.total)
  } catch (err) {
    return
  }
}

export async function getAll(
  app: string,
): Promise<UsageWithDate[] | undefined> {
  try {
    const all = await axios.get<any, AxiosResponse<UsageWithDate[]>>(
      `/all/${app}`,
    )
    return all.data
  } catch (error) {
    return
  }
}

export async function getDates() {
  const raw = await axios.get<any, AxiosResponse<string[]>>('/date')
  console.log(raw)

  return raw.data.map((item) => item.replace('.json', ''))
}
