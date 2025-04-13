"use client"
import { useSearchParams } from "next/navigation"
import NavigationMenu from "@src/components/category/NavigationMenu"
// import { MainNavigation } from "@src/components/navigation/MainNavigation"
import { CategoryHeader } from "@src/components/categories/CategoryHeader"
import { CategoryTags } from "@src/components/categories/CategoryTags"
import { CategorySalesPerformance } from "@src/components/categories/CategorySalesPerformance"
import { CategoryMetrics } from "@src/components/categories/CategoryMetrics"

export default function CategoryDetails() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || undefined
  console.log(typeof id)

  return (
    <div className="min-h-screen w-full">
      <main className="pt-16">
        <div className="container space-y-8 p-6 pb-16">
          <CategoryHeader categoryId={id} />
          <CategoryMetrics />
          <CategorySalesPerformance categoryId={id} />
          <div className="row">

          <div className="grid col-6 flex-grow-1 gap-6 md:grid-cols-2">
          </div>
          <div className="flex-grow-1 col-6 grid gap-6 md:grid-cols-2">
             <NavigationMenu />
            <CategoryTags categoryId={id} />
          </div>
          </div>
      
        </div>
      </main>
    </div>
  )
}