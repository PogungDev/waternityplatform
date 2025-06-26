'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, TrendingUp, DollarSign, Users, Droplets, Zap, ArrowUpRight } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface StakePosition {
  id: number
  wellId: number
  wellLocation: string
  amountStaked: number
  currentValue: number
  apy: number
  dailyRewards: number
  totalRewards: number
  stakingDate: string
  status: 'active' | 'unstaking'
}

interface StakePool {
  wellId: number
  location: string
  totalStaked: number
  apy: number
  capacity: number
  peopleServed: number
  riskLevel: 'low' | 'medium' | 'high'
  chainlinkEnabled: boolean
  minimumStake: number
}

// Demo data
const stakePools: StakePool[] = [
  {
    wellId: 1,
    location: "Jakarta, Indonesia",
    totalStaked: 150.5,
    apy: 8.5,
    capacity: 5000,
    peopleServed: 1200,
    riskLevel: 'low',
    chainlinkEnabled: true,
    minimumStake: 0.1
  },
  {
    wellId: 2,
    location: "Bandung, Indonesia",
    totalStaked: 89.3,
    apy: 9.2,
    capacity: 3000,
    peopleServed: 800,
    riskLevel: 'medium',
    chainlinkEnabled: true,
    minimumStake: 0.1
  },
  {
    wellId: 3,
    location: "Surabaya, Indonesia",
    totalStaked: 220.8,
    apy: 7.8,
    capacity: 7000,
    peopleServed: 2100,
    riskLevel: 'low',
    chainlinkEnabled: true,
    minimumStake: 0.1
  }
]

const initialPositions: StakePosition[] = [
  {
    id: 1,
    wellId: 1,
    wellLocation: "Jakarta, Indonesia",
    amountStaked: 5.0,
    currentValue: 5.12,
    apy: 8.5,
    dailyRewards: 0.0012,
    totalRewards: 0.24,
    stakingDate: "2024-01-15",
    status: 'active'
  },
  {
    id: 2,
    wellId: 3,
    wellLocation: "Surabaya, Indonesia",
    amountStaked: 2.5,
    currentValue: 2.58,
    apy: 7.8,
    dailyRewards: 0.0005,
    totalRewards: 0.08,
    stakingDate: "2024-01-20",
    status: 'active'
  }
]

export default function StakingPage() {
  const { toast } = useToast()
  const [stakePositions, setStakePositions] = useState<StakePosition[]>(initialPositions)
  const [stakeAmount, setStakeAmount] = useState('')
  const [selectedPool, setSelectedPool] = useState<StakePool | null>(null)
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState<number | null>(null)

  const totalStaked = stakePositions.reduce((sum, pos) => sum + pos.amountStaked, 0)
  const totalValue = stakePositions.reduce((sum, pos) => sum + pos.currentValue, 0)
  const totalDailyRewards = stakePositions.reduce((sum, pos) => sum + pos.dailyRewards, 0)
  const totalRewards = stakePositions.reduce((sum, pos) => sum + pos.totalRewards, 0)

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return

    const amount = parseFloat(stakeAmount)
    if (amount < selectedPool.minimumStake) {
      toast({
        title: "Error",
        description: `Minimum stake is ${selectedPool.minimumStake} ETH`,
        variant: "destructive"
      })
      return
    }

    setIsStaking(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newPosition: StakePosition = {
        id: Date.now(),
        wellId: selectedPool.wellId,
        wellLocation: selectedPool.location,
        amountStaked: amount,
        currentValue: amount,
        apy: selectedPool.apy,
        dailyRewards: (amount * selectedPool.apy / 100) / 365,
        totalRewards: 0,
        stakingDate: new Date().toISOString().split('T')[0],
        status: 'active'
      }

      setStakePositions(prev => [...prev, newPosition])
      setStakeAmount('')
      setSelectedPool(null)

      toast({
        title: "Success",
        description: `Successfully staked ${amount} ETH to ${selectedPool.location}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stake. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async (positionId: number) => {
    setIsUnstaking(positionId)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      setStakePositions(prev => 
        prev.map(pos => 
          pos.id === positionId 
            ? { ...pos, status: 'unstaking' as const }
            : pos
        )
      )

      toast({
        title: "Unstaking Initiated",
        description: "Your stake will be available for withdrawal in 7 days",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unstake. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUnstaking(null)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staking</h1>
        <p className="text-muted-foreground">
          Stake ETH in water wells and earn rewards while supporting clean water access
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaked.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">
              Current value: {totalValue.toFixed(2)} ETH
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDailyRewards.toFixed(4)} ETH</div>
            <p className="text-xs text-muted-foreground">
              ~${(totalDailyRewards * 3000).toFixed(2)} USD
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRewards.toFixed(4)} ETH</div>
            <p className="text-xs text-muted-foreground">
              All-time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stakePositions.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(stakePositions.map(p => p.wellId)).size} wells
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Available Pools</TabsTrigger>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staking Pools</CardTitle>
              <CardDescription>
                Choose a well to stake your ETH and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stakePools.map((pool) => (
                  <Card key={pool.wellId} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Well #{pool.wellId}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(pool.riskLevel)}>
                            {pool.riskLevel} risk
                          </Badge>
                          {pool.chainlinkEnabled && (
                            <Badge variant="outline">
                              <Zap className="mr-1 h-3 w-3" />
                              Chainlink
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="flex items-center">
                        <Droplets className="mr-1 h-4 w-4" />
                        {pool.location}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>APY:</span>
                        <span className="font-semibold text-green-600">{pool.apy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Staked:</span>
                        <span>{pool.totalStaked} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Min. Stake:</span>
                        <span>{pool.minimumStake} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>People Served:</span>
                        <span>{pool.peopleServed.toLocaleString()}</span>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full"
                            onClick={() => setSelectedPool(pool)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Stake ETH
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Stake ETH to {pool.location}</DialogTitle>
                            <DialogDescription>
                              Earn {pool.apy}% APY while supporting clean water access
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">APY:</span>
                                <p className="text-green-600">{pool.apy}%</p>
                              </div>
                              <div>
                                <span className="font-medium">Min. Stake:</span>
                                <p>{pool.minimumStake} ETH</p>
                              </div>
                              <div>
                                <span className="font-medium">Risk Level:</span>
                                <Badge className={getRiskColor(pool.riskLevel)}>
                                  {pool.riskLevel}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Daily Capacity:</span>
                                <p>{pool.capacity.toLocaleString()}L</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="stakeAmount">Amount (ETH)</Label>
                              <Input
                                id="stakeAmount"
                                type="number"
                                placeholder={`Min. ${pool.minimumStake} ETH`}
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                step="0.01"
                                min={pool.minimumStake}
                              />
                            </div>

                            {stakeAmount && parseFloat(stakeAmount) >= pool.minimumStake && (
                              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                                <div className="flex justify-between">
                                  <span>Expected daily rewards:</span>
                                  <span className="font-semibold">
                                    {((parseFloat(stakeAmount) * pool.apy / 100) / 365).toFixed(4)} ETH
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Expected yearly rewards:</span>
                                  <span className="font-semibold">
                                    {(parseFloat(stakeAmount) * pool.apy / 100).toFixed(2)} ETH
                                  </span>
                                </div>
                              </div>
                            )}

                            <Button 
                              onClick={handleStake}
                              disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) < pool.minimumStake}
                              className="w-full"
                            >
                              {isStaking ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Staking...
                                </>
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Stake {stakeAmount || '0'} ETH
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Staking Positions</CardTitle>
              <CardDescription>
                Track your active stakes and rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stakePositions.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Active Positions</h3>
                  <p className="text-muted-foreground mb-4">
                    Start staking to earn rewards while supporting clean water access
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stakePositions.map((position) => (
                    <Card key={position.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Well #{position.wellId}</h3>
                            <p className="text-sm text-muted-foreground">{position.wellLocation}</p>
                          </div>
                          <Badge variant={position.status === 'active' ? 'default' : 'secondary'}>
                            {position.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Staked Amount:</span>
                            <p>{position.amountStaked.toFixed(2)} ETH</p>
                          </div>
                          <div>
                            <span className="font-medium">Current Value:</span>
                            <p className="text-green-600">{position.currentValue.toFixed(2)} ETH</p>
                          </div>
                          <div>
                            <span className="font-medium">Daily Rewards:</span>
                            <p>{position.dailyRewards.toFixed(4)} ETH</p>
                          </div>
                          <div>
                            <span className="font-medium">Total Rewards:</span>
                            <p className="text-green-600">{position.totalRewards.toFixed(4)} ETH</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Staked on {position.stakingDate} • APY: {position.apy}%
                          </div>
                          {position.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnstake(position.id)}
                              disabled={isUnstaking === position.id}
                            >
                              {isUnstaking === position.id ? (
                                <>
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  Unstaking...
                                </>
                              ) : (
                                'Unstake'
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 