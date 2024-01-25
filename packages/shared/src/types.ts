export interface Usage {
  start: number
  total: number
  end: number
  durations: Duration[]
}

export interface UsageWithDate extends Usage {
  date: string
}

export type UsageMap = Record<string, Usage>

export interface UsageArr extends Usage {
  name: string
}

export interface Duration {
  time: number
  duration: number
}

export type App = Record<string, string>

export interface Config {
  storagePath: string
}
