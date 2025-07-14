import { SavedList } from '@/components/SavedList'
import { ComponentWrapper } from "@/components/component-wrapper"
import React from 'react'

export default function ListPage() {
  return (
    <div className="@container grid flex-1 gap-4 p-4">
      <SavedList />
    </div>
  )
}
