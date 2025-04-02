import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArtworkLoadingSkeleton() {
  return (
    <div className="container py-6 mx-auto space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-7 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-[100px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 animate-pulse">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-9 w-[200px]" />
              <Skeleton className="h-9 w-[80px]" />
              <Skeleton className="h-9 w-[80px]" />
              <Skeleton className="h-9 w-[80px]" />
            </div>
            
            <div className="border rounded-md">
              <div className="h-10 bg-muted/50 border-b px-2 flex items-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20 mx-2" />
                ))}
              </div>
              
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center h-16 px-2 border-b last:border-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-1 px-2">
                      <Skeleton className={`h-4 w-${i === 0 ? '10' : i === 1 ? '10' : i === 2 ? '40' : i === 3 ? '20' : '30'} mx-auto`} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Skeleton className="h-5 w-[150px]" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-[70px]" />
                <Skeleton className="h-8 w-[70px]" />
                <Skeleton className="h-8 w-[40px]" />
                <Skeleton className="h-8 w-[70px]" />
                <Skeleton className="h-8 w-[70px]" />
                <Skeleton className="h-8 w-[50px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ArtworkRowSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className="border-b animate-pulse">
          {Array.from({ length: 7 }).map((_, cellIndex) => (
            <td key={cellIndex} className="p-2">
              <Skeleton className={`h-4 w-${cellIndex === 0 ? '6' : cellIndex === 1 ? '10' : cellIndex === 2 ? 'full' : '24'}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-muted/50">
          <tr>
            {Array.from({ length: 7 }).map((_, i) => (
              <th key={i} className="h-10 px-2 text-left align-middle">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          <ArtworkRowSkeleton count={5} />
        </tbody>
      </table>
    </div>
  );
}