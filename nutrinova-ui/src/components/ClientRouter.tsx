'use client'

import React from 'react'
import { useRouter } from "next/navigation";
import CenteredSpinnerWithBackdrop from './CenteredSpinnerOverlay';

export const ClientRouter = ({ route }: { route: string }) => {
  const router = useRouter();
  router.push(route)
  return (
    <>
      <CenteredSpinnerWithBackdrop message='Loading...' />
    </>
  )
}
