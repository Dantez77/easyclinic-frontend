import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ActivityLogsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="space-y-6">
          {/* Tabs Skeleton */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* Filters Skeleton */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Skeleton className="h-10 w-full sm:w-40" />
                    <Skeleton className="h-10 w-full sm:w-40" />
                    <Skeleton className="h-10 w-full sm:w-40" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Skeleton className="h-10 w-full sm:w-48" />
                  <Skeleton className="h-10 w-full sm:w-64" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table Skeleton */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left">
                      <Skeleton className="w-4 h-4" />
                    </th>
                    <th className="p-4 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="p-4 text-left hidden md:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="p-4 text-left hidden lg:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="p-4 text-left hidden sm:table-cell">
                      <Skeleton className="h-4 w-18" />
                    </th>
                    <th className="p-4 text-left hidden lg:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="p-4 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4">
                        <Skeleton className="w-4 h-4" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-48 mb-2" />
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <Skeleton className="h-4 w-28 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-8 w-8" />
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Skeleton */}
              <div className="flex items-center justify-between p-4 border-t">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
