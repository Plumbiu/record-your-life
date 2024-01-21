import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import request from '@/utils/request'

interface DatesStore {
  dates: string[]
}

export const useDates = defineStore('dates', {
  state: () =>
    ({
      dates: [],
    } as DatesStore),

  actions: {
    async initDates() {
      const raw = await request.get<any, AxiosResponse<string[]>>('/date')
      this.dates = raw.data.map((item) =>
        item.replace('.json', ''),
      )
    },
  },
})
