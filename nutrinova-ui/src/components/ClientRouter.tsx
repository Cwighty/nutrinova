'use client'

import React from 'react'
import { useRouter } from "next/navigation";

export const ClientRouter = ({ route }: { route: string }) => {
  const router = useRouter();
  router.push(route)
  console.log("you made it here")
  return (
    <>
      junk
    </>
  )
}
