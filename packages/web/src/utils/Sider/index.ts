export function splitDate(dates: string[]) {
  const obj: Record<string, string[]> = {}
  for (const date of dates) {
    const [year, month, day] = date.split('-')
    const key = `${year}-${month}`
    if (!obj[key]) {
      obj[key] = [day]
    } else {
      obj[key].push(day)
    }
  }

  return obj
}
