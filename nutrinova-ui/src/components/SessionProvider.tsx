'use client'
import { Session } from 'next-auth'
import React from 'react'

export const SessionProvider = ({ children, session }: { children: React.ReactNode, session: Session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
