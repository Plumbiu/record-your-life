export interface Usage {
  start: number
  total: number
  end: number
  durations: Duration[]
}

export interface Duration {
  time: number
  duration: number
}

export type App = Record<string, string>

export interface Config {
  storagePath: string
}
