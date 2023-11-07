'use client'
import { Session } from 'next-auth'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

export const NextAuthSessionProvider = ({ children, session }: { children: React.ReactNode, session: Session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
