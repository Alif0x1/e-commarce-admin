'use client'

import dynamic from 'next/dynamic'

const Overview = dynamic(() => import('./overview').then(m => m.Overview), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-md" />,
})

interface OverviewClientProps {
  data: { name: string; total: number }[]
}

export function OverviewClient({ data }: OverviewClientProps) {
  return <Overview data={data} />
}
