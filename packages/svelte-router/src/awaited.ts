import { type DeferredPromise, defer, TSR_DEFERRED_PROMISE } from "@tanstack/router-core"

export type AwaitOptions<T> = {
  promise: Promise<T>
}

export function useAwaited<T>({ promise: _promise }: AwaitOptions<T>): [T, DeferredPromise<T>] {
  const promise = defer(_promise)

  if (promise[TSR_DEFERRED_PROMISE].status === "pending") {
    throw promise
  }

  if (promise[TSR_DEFERRED_PROMISE].status === "error") {
    throw promise[TSR_DEFERRED_PROMISE].error
  }

  return [promise[TSR_DEFERRED_PROMISE].data, promise]
}
