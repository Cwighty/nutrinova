'use client';

import { useRouter } from 'next/navigation';
import CenteredSpinnerWithBackdrop from './CenteredSpinnerOverlay';
import React from 'react';

export const ClientRouter = ({ route }: { route: string }) => {
  const router = useRouter();

  React.useEffect(() => {
    if (route) {
      router.push(route);
    }
  }, [route, router]);

  return <CenteredSpinnerWithBackdrop message='Loading...' />;
};

