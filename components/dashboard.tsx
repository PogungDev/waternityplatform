"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Droplets, TrendingUp, Users, DollarSign, Award, RefreshCw, Zap } from "lucide-react"
import { useState, useEffect } from "react"

interface StakePosition {
  tokenId: number
  location: string
  stakedAmount: number
  pendingRewards: number
  yieldRate: number
  impactScore: number
}

interface DashboardProps {
  userAddress?: string
}

export function Dashboard({ userAddress }: DashboardProps) {
  const [positions, setPositions] = useState<StakePosition[]>([])
  const [totalStaked, setTotalStaked] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demo
  useEffect(() => {
    if (userAddress) {
      setPositions([
        {
          tokenId: 1,
          location: "Lombok, Indonesia",
          stakedAmount: 1000,
          pendingRewards: 25.5,
          yieldRate: 3.2,
          impactScore: 850,
        },
        {
          tokenId: 3,
          location: "Flores, Indonesia",
          stakedAmount: 500,
          pendingRewards: 8.75,
          yieldRate: 2.8,
          impactScore: 620,
        },
      ])
      setTotalStaked(1500)
      setTotalRewards(34.25)
    }
  }, [userAddress])

  const handleClaimRewards = async (tokenId: number) => {
    setIsLoading(true)
    try {
      // Simulate claim transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update positions after claim
      setPositions((prev) => prev.map((pos) => (pos.tokenId === tokenId ? { ...pos, pendingRewards: 0 } : pos)))

      // Update total rewards
      const claimedAmount = positions.find((p) => p.tokenId === tokenId)?.pendingRewards || 0
      setTotalRewards((prev) => prev - claimedAmount)
    } catch (error) {
      console.error("Claim failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimAll = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setPositions((prev) => prev.map((pos) => ({ ...pos, pendingRewards: 0 })))
      setTotalRewards(0)
    } catch (error) {
      console.error("Claim all failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userAddress) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Connect your wallet to view your dashboard</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStaked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {positions.length} wells</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRewards.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ready to claim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg APY</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {positions.length > 0
                ? (positions.reduce((acc, pos) => acc + pos.yieldRate, 0) / positions.length).toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">Annual percentage yield</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.reduce((acc, pos) => acc + pos.impactScore, 0)}</div>
            <p className="text-xs text-muted-foreground">Social impact points</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="positions">My Positions</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Staking Positions</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {positions.map((position) => (
              <Card key={position.tokenId}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Well #{position.tokenId}</Badge>
                        <span className="font-medium">{position.location}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${position.stakedAmount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{position.yieldRate}% APY</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          <span>{position.impactScore} impact</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-lg font-semibold text-green-600">+${position.pendingRewards.toFixed(2)}</div>
                      <Button
                        size="sm"
                        onClick={() => handleClaimRewards(position.tokenId)}
                        disabled={position.pendingRewards === 0 || isLoading}
                      >
                        {isLoading ? "Claiming..." : "Claim"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Rewards Overview</h3>
            <Button onClick={handleClaimAll} disabled={totalRewards === 0 || isLoading}>
              {isLoading ? "Claiming..." : `Claim All ($${totalRewards.toFixed(2)})`}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Well #1 - Weekly Yield</div>
                    <div className="text-sm text-muted-foreground">2 days ago</div>
                  </div>
                  <div className="text-green-600 font-medium">+$12.50</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Well #3 - Weekly Yield</div>
                    <div className="text-sm text-muted-foreground">2 days ago</div>
                  </div>
                  <div className="text-green-600 font-medium">+$4.25</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium">Impact Bonus</div>
                    <div className="text-sm text-muted-foreground">1 week ago</div>
                  </div>
                  <div className="text-purple-600 font-medium">+$5.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <h3 className="text-lg font-semibold">Social Impact Dashboard</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  People Served
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">1,247</div>
                <div className="text-sm text-muted-foreground mb-4">Through your staking contributions</div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">75% of annual target (1,650 people)</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Water Provided
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">2.1M</div>
                <div className="text-sm text-muted-foreground mb-4">Liters of clean water annually</div>
                <Progress value={68} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">68% of capacity utilization</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impact Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-medium">You</div>
                      <div className="text-sm text-muted-foreground">1,470 impact points</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Top 5%</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm">1</div>
                      <span className="text-sm">0x1234...5678</span>
                    </div>
                    <span className="text-sm font-medium">2,150 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm">3</div>
                      <span className="text-sm">0x9876...4321</span>
                    </div>
                    <span className="text-sm font-medium">1,280 pts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
