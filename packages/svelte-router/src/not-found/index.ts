import { isNotFound, type NotFoundError } from "@tanstack/router-core"

export function getNotFound(error: unknown): (NotFoundError & { isNotFound: true }) | undefined {
  if (isNotFound(error)) {
    return error as NotFoundError & { isNotFound: true }
  }

  // biome-ignore lint/suspicious/noExplicitAny: safe
  if (isNotFound((error as any)?.cause)) {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return (error as any).cause as NotFoundError & { isNotFound: true }
  }

  return undefined
}

export { default as CatchNotFound } from "./CatchNotFound.svelte"
export { default as DefaultGlobalNotFound } from "./DefaultGlobalNotFound.svelte"
