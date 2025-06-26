import { ChainlinkDashboard } from '@/components/chainlink-dashboard'

export default function ChainlinkPage() {
  return (
    <div className="container mx-auto py-6">
      <ChainlinkDashboard />
    </div>
  )
}

export const metadata = {
  title: 'Chainlink Dashboard - Waternity Platform',
  description: 'Monitor Chainlink automation, data feeds, and external verification for water well management',
} 