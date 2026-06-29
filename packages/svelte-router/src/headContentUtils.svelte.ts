import {
  type AssetCrossOriginConfig,
  appendUniqueUserTags,
  escapeHtml,
  getAssetCrossOrigin,
  getScriptPreloadAttrs,
  type RouterManagedTag,
  resolveManifestCssLink
} from "@tanstack/router-core"
import { useRouter } from "./useRouter"

/**
 * Build the list of head/link/meta/script tags to render for active matches.
 * Used internally by `HeadContent`.
 */
export const useTags = (assetCrossOrigin?: AssetCrossOriginConfig) => {
  const router = useRouter()
  const nonce = $derived(router.options.ssr?.nonce)
  const activeMatches = $derived(router.stores.matches.get())
  const routeMeta = $derived(activeMatches.map(match => match.meta).filter(meta => meta !== undefined))

  const meta = $derived.by(() => {
    const resultMeta: Array<RouterManagedTag> = []
    const metaByAttribute: Record<string, true> = {}
    let title: RouterManagedTag | undefined
    for (let i = routeMeta.length - 1; i >= 0; i--) {
      // biome-ignore lint/style/noNonNullAssertion: safe
      const metas = routeMeta[i]!
      for (let j = metas.length - 1; j >= 0; j--) {
        const m = metas[j]
        if (!m) continue

        if (m.title) {
          if (!title) {
            title = {
              tag: "title",
              children: m.title
            }
          }
        } else if ("script:ld+json" in m) {
          // Handle JSON-LD structured data
          // Content is HTML-escaped to prevent XSS when injected via innerHTML
          try {
            const json = JSON.stringify(m["script:ld+json"])
            resultMeta.push({
              tag: "script",
              attrs: {
                type: "application/ld+json"
              },
              children: escapeHtml(json)
            })
          } catch {
            // Skip invalid JSON-LD objects
          }
        } else {
          const attribute = m.name ?? m.property
          if (attribute) {
            if (metaByAttribute[attribute]) {
              continue
            } else {
              metaByAttribute[attribute] = true
            }
          }

          resultMeta.push({
            tag: "meta",
            attrs: {
              ...m,
              nonce
            }
          })
        }
      }
    }

    if (title) {
      resultMeta.push(title)
    }

    if (router.options.ssr?.nonce) {
      resultMeta.push({
        tag: "meta",
        attrs: {
          property: "csp-nonce",
          content: router.options.ssr.nonce
        }
      })
    }
    resultMeta.reverse()

    return resultMeta
  })

  const links = $derived(
    activeMatches
      .flatMap(match => match.links ?? [])
      .filter(link => link !== undefined)
      .map(link => ({
        tag: "link",
        attrs: {
          ...link,
          nonce
        }
      })) satisfies Array<RouterManagedTag>
  )

  const manifestCssTags = $derived.by(() => {
    const manifest = router.ssr?.manifest
    const tags: Array<RouterManagedTag> = []

    if (!manifest) return tags

    for (const match of activeMatches) {
      manifest.routes[match.routeId]?.css?.forEach(link => {
        const resolvedLink = resolveManifestCssLink(link)
        tags.push({
          tag: "link",
          attrs: {
            rel: "stylesheet",
            ...resolvedLink,
            crossorigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? resolvedLink.crossOrigin,
            nonce
          }
        })
      })
    }

    if (manifest.inlineStyle) {
      tags.push({
        tag: "style",
        attrs: {
          ...manifest.inlineStyle.attrs,
          nonce
        },
        children: manifest.inlineStyle.children,
        inlineCss: true
      })
    }

    return tags
  })

  const preloadLinks = $derived.by(() => {
    const preloadLinks: Array<RouterManagedTag> = []

    activeMatches.forEach(match => {
      router.ssr?.manifest?.routes[match.routeId]?.preloads?.filter(Boolean).forEach(preload => {
        preloadLinks.push({
          tag: "link",
          attrs: {
            ...getScriptPreloadAttrs(router.ssr?.manifest, preload, assetCrossOrigin),
            nonce
          }
        })
      })
    })

    return preloadLinks
  })

  const styles = $derived(
    activeMatches
      .flatMap(match => match.styles ?? [])
      .filter(style => style !== undefined)
      .map(({ children, ...style }) => ({
        tag: "style",
        attrs: {
          ...style,
          nonce
        },
        children: children as string | undefined
      })) satisfies Array<RouterManagedTag>
  )

  const headScripts = $derived(
    activeMatches
      .flatMap(match => match.headScripts ?? [])
      .filter(script => script !== undefined)
      .map(({ children, ...script }) => ({
        tag: "script",
        attrs: {
          ...script,
          nonce
        },
        children: children as string | undefined
      })) satisfies Array<RouterManagedTag>
  )

  let prev: Array<RouterManagedTag> | undefined = $state()
  return $derived.by(() => {
    const next: Array<RouterManagedTag> = []
    appendUniqueUserTags(next, meta)
    next.push(...preloadLinks)
    appendUniqueUserTags(next, links)
    next.push(...manifestCssTags)
    appendUniqueUserTags(next, styles)
    appendUniqueUserTags(next, headScripts)

    if (prev === undefined) {
      return next
    }
    prev = next
    return replaceEqualTags(prev, next)
  })
}

function replaceEqualTags(prev: Array<RouterManagedTag>, next: Array<RouterManagedTag>) {
  const prevByKey = new Map<string, RouterManagedTag>()
  for (const tag of prev) {
    prevByKey.set(JSON.stringify(tag), tag)
  }

  let isEqual = prev.length === next.length
  const result = next.map((tag, index) => {
    const existing = prevByKey.get(JSON.stringify(tag))
    if (existing) {
      if (existing !== prev[index]) {
        isEqual = false
      }
      return existing
    }

    isEqual = false
    return tag
  })

  return isEqual ? prev : result
}
