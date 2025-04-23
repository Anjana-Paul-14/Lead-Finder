'use client'


import React, {useState,createContext, useContext,} from 'react'

type CreditContextType = {
  credits: number
  decrementCredits: () => void
}

const CreditContext = createContext<CreditContextType>({
  credits: 5,
  decrementCredits: () => {},
})

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(5)

  const decrementCredits = () => {
    setCredits(prev => Math.max(prev - 1, 0)) // Prevent negative numbers
  }


  return (
    <CreditContext.Provider value={{ credits, decrementCredits }}>
      {children}
    </CreditContext.Provider>
  )
}

export const useCredits = () => useContext(CreditContext)
