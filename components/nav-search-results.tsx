"use client"

import { useRouter } from "next/navigation"
import type { NavigationRoute } from "@/lib/navigation-routes"

interface NavSearchResultsProps {
  results: NavigationRoute[]
  language: "en" | "es"
  onSelect: () => void
}

export function NavSearchResults({ results, language, onSelect }: NavSearchResultsProps) {
  const router = useRouter()

  if (results.length === 0) {
    return (
      <div className="absolute mt-1 w-64 bg-white border rounded shadow p-2 text-sm text-gray-500">
        No results
      </div>
    )
  }

  return (
    <ul className="absolute mt-1 w-64 bg-white dark:bg-gray-800 border rounded shadow z-50">
      {results.map(route => (
        <li
          key={route.path}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => {
            router.push(route.path)
            onSelect()
          }}
        >
          {route.labels[language]}
        </li>
      ))}
    </ul>

  )
}
