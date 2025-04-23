// components/credit-button.tsx
'use client'

import { useCredits } from '@/components/credit-context'
import { Button } from "@/registry/new-york-v4/ui/button"

export function CreditButton() {
  const { credits } = useCredits()
  return (
    <Button className="font-bold py-4 px-4 rounded">
      {credits}
    </Button>
  )
}