'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Zap, TrendingUp, Globe, Clock, Users, Droplets } from 'lucide-react'
import { useWallet } from '@/hooks/use-wallet'
import { 
  getWaternityRouter, 
  getChainlinkAutomation, 
  getChainlinkDataFeeds, 
  getChainlinkFunctions,
  formatPrice,
  formatYieldRate,
  formatTimestamp
} from '@/lib/contracts'

interface AutomationStatus {
  activeWells: bigint[]
  interval: bigint
  lastUpkeep: bigint
  upkeepCounter: bigint
}

interface MarketData {
  currentPrice: bigint
  suggestedYieldRate: bigint
  lastUpdate: bigint
}

interface FunctionsStatus {
  verificationInProgress: boolean
  lastResponse: string
  lastError: string
}

export function ChainlinkDashboard() {
  const { provider, address } = useWallet()
  const { toast } = useToast()
  
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus | null>(null)
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [functionsStatus, setFunctionsStatus] = useState<FunctionsStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (provider) {
      loadChainlinkData()
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadChainlinkData, 30000)
      return () => clearInterval(interval)
    }
  }, [provider])

  const loadChainlinkData = async () => {
    try {
      // Use demo data directly for demo purposes
      setAutomationStatus({
        activeWells: [BigInt(1), BigInt(2), BigInt(3)],
        interval: BigInt(3600), // 1 hour
        lastUpkeep: BigInt(Math.floor(Date.now() / 1000) - 1800), // 30 minutes ago
        upkeepCounter: BigInt(5)
      })

      setMarketData({
        currentPrice: BigInt("175000000000000000000"), // 175 ETH
        suggestedYieldRate: BigInt(700), // 7%
        lastUpdate: BigInt(Math.floor(Date.now() / 1000) - 600) // 10 minutes ago
      })

      setFunctionsStatus({
        verificationInProgress: false,
        lastResponse: "Well verified: Water quality excellent, serving 850 people",
        lastError: ""
      })

    } catch (error) {
      console.error('Failed to load Chainlink data:', error)
      toast({
        title: "Error",
        description: "Failed to load Chainlink data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateMarketYields = async () => {
    setUpdating(true)
    try {
      // Simulate yield update for demo
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (marketData) {
        setMarketData({
          ...marketData,
          suggestedYieldRate: marketData.suggestedYieldRate + BigInt(25), // Increase by 0.25%
          lastUpdate: BigInt(Math.floor(Date.now() / 1000))
        })
      }

      toast({
        title: "Success",
        description: "Yield rates updated based on market data",
      })

    } catch (error: any) {
      console.error('Failed to update yields:', error)
      toast({
        title: "Error", 
        description: "Failed to update yields",
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
  }

  const demonstrateChainlink = async () => {
    setUpdating(true)
    
    try {
      // Simulate demo data loading for presentation
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
      
      // Update with demo data
      setAutomationStatus({
        activeWells: [BigInt(1), BigInt(2), BigInt(3)],
        interval: BigInt(3600), // 1 hour
        lastUpkeep: BigInt(Math.floor(Date.now() / 1000) - 1800), // 30 minutes ago
        upkeepCounter: BigInt(5)
      })

      setMarketData({
        currentPrice: BigInt("180000000000000000000"), // 180 ETH
        suggestedYieldRate: BigInt(750), // 7.5%
        lastUpdate: BigInt(Math.floor(Date.now() / 1000) - 300) // 5 minutes ago
      })

      setFunctionsStatus({
        verificationInProgress: false,
        lastResponse: "Well verified: Water quality excellent, serving 1200 people",
        lastError: ""
      })

      toast({
        title: "Demo Completed",
        description: "Chainlink integration demonstration with updated data",
      })

    } catch (error: any) {
      console.error('Demo failed:', error)
      toast({
        title: "Error",
        description: "Demo failed to complete",
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Chainlink data...</span>
      </div>
    )
  }

  const nextUpkeepIn = automationStatus ? 
    Math.max(0, Number(automationStatus.interval) - (Date.now() / 1000 - Number(automationStatus.lastUpkeep))) : 0
  const upkeepProgress = automationStatus ? 
    Math.min(100, ((Date.now() / 1000 - Number(automationStatus.lastUpkeep)) / Number(automationStatus.interval)) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chainlink Dashboard</h2>
          <p className="text-muted-foreground">Monitor automation, market data, and external verification</p>
        </div>
        <Button onClick={demonstrateChainlink} disabled={updating}>
          {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Demo Chainlink Integration
        </Button>
      </div>

      <Tabs defaultValue="automation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="automation">
            <Zap className="mr-2 h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="datafeeds">
            <TrendingUp className="mr-2 h-4 w-4" />
            Data Feeds
          </TabsTrigger>
          <TabsTrigger value="functions">
            <Globe className="mr-2 h-4 w-4" />
            Functions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Wells</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{automationStatus?.activeWells.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Wells under automation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upkeep Counter</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{automationStatus?.upkeepCounter.toString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  Total upkeeps performed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{automationStatus ? (Number(automationStatus.interval) / 3600).toFixed(1) : '0'}h</div>
                <p className="text-xs text-muted-foreground">
                  Automation interval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Upkeep</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.ceil(nextUpkeepIn / 60)}m</div>
                <p className="text-xs text-muted-foreground">
                  Time remaining
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automation Progress</CardTitle>
              <CardDescription>
                Progress towards next automated upkeep
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={upkeepProgress} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Last upkeep: {automationStatus ? formatTimestamp(automationStatus.lastUpkeep) : 'N/A'}</span>
                <span>{upkeepProgress.toFixed(1)}% complete</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="datafeeds" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ETH Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${marketData ? formatPrice(marketData.currentPrice) : '0'}</div>
                <p className="text-xs text-muted-foreground">
                  Current ETH/USD price
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suggested Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketData ? formatYieldRate(marketData.suggestedYieldRate) : '0%'}</div>
                <p className="text-xs text-muted-foreground">
                  Market-based yield rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Update</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketData ? Math.floor((Date.now() / 1000 - Number(marketData.lastUpdate)) / 60) : 0}m
                </div>
                <p className="text-xs text-muted-foreground">
                  Minutes ago
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market-Based Yield Updates</CardTitle>
              <CardDescription>
                Update yield rates based on current market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={updateMarketYields} disabled={updating}>
                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Yields with Market Data
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will update yield rates for all active wells based on current ETH price from Chainlink Data Feeds
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>External Verification</CardTitle>
                <CardDescription>Chainlink Functions status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <Badge variant={functionsStatus?.verificationInProgress ? "default" : "secondary"}>
                      {functionsStatus?.verificationInProgress ? "In Progress" : "Idle"}
                    </Badge>
                  </div>
                  
                  {functionsStatus?.lastResponse && (
                    <div>
                      <span className="font-medium">Last Response:</span>
                      <p className="text-sm text-muted-foreground mt-1 break-all">
                        {functionsStatus.lastResponse.length > 100 
                          ? functionsStatus.lastResponse.substring(0, 100) + '...' 
                          : functionsStatus.lastResponse}
                      </p>
                    </div>
                  )}
                  
                  {functionsStatus?.lastError && (
                    <div>
                      <span className="font-medium">Last Error:</span>
                      <p className="text-sm text-red-500 mt-1 break-all">
                        {functionsStatus.lastError.length > 100 
                          ? functionsStatus.lastError.substring(0, 100) + '...' 
                          : functionsStatus.lastError}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Well Verification</CardTitle>
                <CardDescription>External data verification for wells</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Chainlink Functions verifies well operational status and performance data from external APIs
                </p>
                <Button variant="outline" disabled>
                  Manual Verification
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Automatic verification runs via Chainlink Functions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 