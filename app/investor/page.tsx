"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Wallet, CheckCircle, Brain } from "lucide-react"
import { ChainlinkStatusBar } from "@/components/chainlink-status-bar"
import { WellCard } from "@/components/well-card-investor"
import { StakeModal } from "@/components/stake-modal"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface WellData {
  tokenId: number
  location: string
  capacity: number
  peopleServed: number
  isActive: boolean
  totalStaked: number
  impactScore: number
  yieldRate: number
  imageUrl?: string
  myStake?: number
  pendingRewards?: number
}

export default function InvestorPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [wells, setWells] = useState<WellData[]>([])
  const [selectedWell, setSelectedWell] = useState<WellData | null>(null)
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [totalStaked, setTotalStaked] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [totalImpact, setTotalImpact] = useState(0)
  const { toast } = useToast()

  // Mock data
  useEffect(() => {
    const mockWells: WellData[] = [
      {
        tokenId: 112,
        location: "East Africa - Arusha Region",
        capacity: 5000,
        peopleServed: 437,
        isActive: true,
        totalStaked: 12500,
        impactScore: 850,
        yieldRate: 4.1,
        imageUrl: "/placeholder.svg?height=200&width=300",
        myStake: isConnected ? 800 : 0,
        pendingRewards: isConnected ? 25.5 : 0,
      },
      {
        tokenId: 89,
        location: "Indonesia - Flores Island",
        capacity: 4200,
        peopleServed: 312,
        isActive: true,
        totalStaked: 15600,
        impactScore: 780,
        yieldRate: 3.5,
        imageUrl: "/placeholder.svg?height=200&width=300",
        myStake: isConnected ? 500 : 0,
        pendingRewards: isConnected ? 8.75 : 0,
      },
      {
        tokenId: 156,
        location: "Kenya - Turkana County",
        capacity: 6000,
        peopleServed: 523,
        isActive: true,
        totalStaked: 22100,
        impactScore: 950,
        yieldRate: 5.4,
        imageUrl: "/placeholder.svg?height=200&width=300",
      },
    ]
    setWells(mockWells)

    if (isConnected) {
      setTotalStaked(1300)
      setTotalRewards(34.25)
      setTotalImpact(749) // people helped
    }
  }, [isConnected])

  const handleConnect = () => {
    setIsConnected(true)
    setAddress("0xWater...Equity")
    toast({
      title: "Wallet Connected!",
      description: "Welcome to WaterFi. Start building water equity with ElizaOS.",
    })
  }

  const handleStake = async (tokenId: number, amount: number) => {
    console.log(`Staking ${amount} USDC in well ${tokenId}`)

    // Simulate staking
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update well data
    setWells((prev) =>
      prev.map((well) =>
        well.tokenId === tokenId
          ? {
              ...well,
              totalStaked: well.totalStaked + amount,
              myStake: (well.myStake || 0) + amount,
            }
          : well,
      ),
    )

    setTotalStaked((prev) => prev + amount)

    toast({
      title: "Staking Successful!",
      description: `You've staked ${amount} USDC in Well #${tokenId}. ElizaOS is now tracking your impact.`,
    })

    setShowStakeModal(false)
  }

  const handleRandomEvent = (tokenId: number) => {
    const randomImpact = Math.random()
    let message = ""
    let variant: "default" | "destructive" | "secondary" = "default"
    let newYieldRateForToast = 0

    setWells((prev) =>
      prev.map((well) => {
        if (well.tokenId === tokenId) {
          let newYieldRate = well.yieldRate

          if (randomImpact < 0.2) {
            newYieldRate = Math.max(0.5, well.yieldRate * 0.5)
            message = `🌪️ ElizaOS detected severe drought risk! Well #${tokenId} yield reduced to ${newYieldRate.toFixed(1)}%`
            variant = "destructive"
          } else if (randomImpact < 0.5) {
            newYieldRate = Math.max(1.0, well.yieldRate * 0.8)
            message = `⚠️ ElizaOS flagged maintenance needed. Well #${tokenId} yield reduced to ${newYieldRate.toFixed(1)}%`
            variant = "secondary"
          } else {
            newYieldRate = Math.min(5.4, well.yieldRate * 1.1)
            message = `🌧️ ElizaOS forecasted favorable conditions! Well #${tokenId} yield increased to ${newYieldRate.toFixed(1)}%`
            variant = "default"
          }

          newYieldRateForToast = newYieldRate
          return { ...well, yieldRate: Number.parseFloat(newYieldRate.toFixed(1)) }
        }
        return well
      }),
    )

    // Toast dipanggil setelah setState selesai
    if (message) {
      toast({
        title: "ElizaOS Climate Event Detected!",
        description: message,
        variant: variant,
      })
    }
  }

  const handleClaimAll = () => {
    if (totalRewards > 0) {
      toast({
        title: "Rewards Claimed!",
        description: `You've claimed ${totalRewards.toFixed(2)} USDC in water equity rewards.`,
      })
      setTotalRewards(0)
      setWells((prev) => prev.map((well) => ({ ...well, pendingRewards: 0 })))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Status Bar */}
      <ChainlinkStatusBar
        isConnected={isConnected}
        address={address}
        totalStaked={totalStaked}
        totalRewards={totalRewards}
        totalImpact={totalImpact}
      />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {!isConnected ? (
          // Connect Wallet Section
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Wallet className="h-6 w-6" />
                  Connect to WaterFi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 font-semibold mb-2">
                    🤖 "Eliza, where can I help the most people this month?"
                  </p>
                  <p className="text-xs text-blue-600">
                    Let our AI show you high-impact, low-risk water wells to invest in.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  Connect your wallet to start building water equity and earning yield through ElizaOS intelligence.
                </p>
                <Button onClick={handleConnect} className="w-full" size="lg">
                  Connect Demo Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Main Investor Dashboard
          <div className="space-y-6">
            {/* ElizaOS Welcome */}
            <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-purple-800">ElizaOS AI Recommendations</h3>
                    <p className="text-purple-600">
                      Based on current climate data and impact analysis, Well #156 in Kenya shows highest potential for
                      both yield (5.4% APY) and human impact (523 people).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Staked</p>
                      <p className="text-2xl font-bold">${totalStaked.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Rewards</p>
                      <p className="text-2xl font-bold text-green-600">${totalRewards.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">People Helped</p>
                      <p className="text-2xl font-bold text-purple-600">{totalImpact}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button onClick={handleClaimAll} className="w-full" disabled={totalRewards === 0} size="lg">
                    Claim All Rewards
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Available Wells */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">ElizaOS Recommended Water Wells</h2>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {wells.length} Wells Active
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wells.map((well) => (
                  <WellCard
                    key={well.tokenId}
                    well={well}
                    onStake={(well) => {
                      setSelectedWell(well)
                      setShowStakeModal(true)
                    }}
                    onRandomEvent={handleRandomEvent}
                    isInvestor={true}
                  />
                ))}
              </div>
            </div>

            {/* Impact Summary */}
            {totalImpact > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    Your Water Equity Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">{totalImpact}</p>
                      <p className="text-sm text-muted-foreground">People with clean water access</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">2.1M</p>
                      <p className="text-sm text-muted-foreground">Liters of water provided annually</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-600">3</p>
                      <p className="text-sm text-muted-foreground">Communities supported</p>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      🏆 "This isn't charity. This is market-backed humanitarian infrastructure."
                    </p>
                    <Link href="/impact">
                      <Button variant="outline" className="bg-black text-white">
                        View Full Impact Report
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Stake Modal */}
      {selectedWell && (
        <StakeModal
          isOpen={showStakeModal}
          onClose={() => setShowStakeModal(false)}
          well={selectedWell}
          onStake={handleStake}
        />
      )}
    </div>
  )
}
