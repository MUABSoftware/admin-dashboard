"use client";
import { CategoryTable } from "@src/components/categories/CategoryTable"

import { CategoryMetrics } from "@src/components/categories/CategoryMetrics"

export default function Categories() {

  return (
    <>
      <div className="container space-y-6 p-6 pb-16 mt-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your platform categories and view analytics
          </p>
        </div>
        <CategoryMetrics />
        <CategoryTable />
      </div>
    </>
  )
}