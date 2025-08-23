import { useMemo } from "react"
import { navigationRoutes, NavigationRoute } from "@/lib/navigation-routes"

export function useNavSearch(query: string, lang: "en" | "es"): NavigationRoute[] {
  return useMemo(() => {
    if (!query) return []

    const lowerQuery = query.toLowerCase()

    return navigationRoutes.filter(route => {
      const labelMatch = route.labels[lang].toLowerCase().includes(lowerQuery)
      const aliasMatch = route.aliases?.[lang]?.some(a => a.toLowerCase().includes(lowerQuery))
      return labelMatch || aliasMatch
    })
  }, [query, lang])
}
