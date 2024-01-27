export interface Usage {
  path?: string
  start: number
  total: number
  end: number
  durations: Duration[]
}

export interface UsageWithDate extends Usage {
  date: string
}

export interface UsageWithIcon extends UsageArr {
  icon: string
}

export type UsageMap = Record<string, Usage>

export interface UsageArr extends Usage {
  name: string
}

export interface Duration {
  time: number
  title: string
  url: string
  duration: number
  memory: number
}

export type App = Record<string, string>

export interface Config {
  storagePath: string
}
