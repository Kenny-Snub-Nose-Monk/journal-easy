// Serialize writes so an older request cannot overwrite newer editor content.
export function createSaveQueue<T>(write: (snapshot: T) => Promise<void>, delay = 700) {
  let pending: T | undefined
  let flight: Promise<void> | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  const flush = (): Promise<void> => {
    if (timer) clearTimeout(timer)
    if (flight) return flight.then(() => (pending === undefined ? undefined : flush()))
    if (pending === undefined) return Promise.resolve()
    const snapshot = pending
    pending = undefined
    flight = write(snapshot)
      .catch((error) => {
        if (pending === undefined) pending = snapshot
        throw error
      })
      .finally(() => {
        flight = undefined
      })
    return flight.then(() => (pending === undefined ? undefined : flush()))
  }
  return {
    schedule(snapshot: T) {
      pending = snapshot
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        void flush().catch(() => {})
      }, delay)
    },
    flush,
  }
}
