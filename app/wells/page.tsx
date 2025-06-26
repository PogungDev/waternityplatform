import { WellsDemo } from '@/components/wells-demo'

export default function WellsPage() {
  return (
    <div className="container mx-auto py-6">
      <WellsDemo />
    </div>
  )
}

export const metadata = {
  title: 'Well Management - Waternity Platform',
  description: 'Manage water well NFTs with Chainlink integration',
}