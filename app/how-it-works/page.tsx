"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Zap, Brain, Dice5, Globe, Shield, TrendingUp, RefreshCw, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ChainlinkCall {
  id: string
  service: string
  timestamp: Date
  status: "success" | "pending" | "failed"
  result: string
  gasUsed?: number
}

export default function HowItWorksPage() {
  const [chainlinkCalls, setChainlinkCalls] = useState<ChainlinkCall[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialize with some demo calls
  useEffect(() => {
    const initialCalls: ChainlinkCall[] = [
      {
        id: "1",
        service: "ElizaOS + Automation",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "success",
        result: "ElizaOS triggered weekly yield distribution: $1,247.50 to 23 water equity investors",
        gasUsed: 45000,
      },
      {
        id: "2",
        service: "ElizaForecaster + Functions",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: "success",
        result: "ElizaOS AI Forecast: Well #112 East Africa predicted yield 4.1% (confidence: 87%)",
        gasUsed: 120000,
      },
      {
        id: "3",
        service: "Data Feeds",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        status: "success",
        result: "USDC/USD price updated: $0.9998 for water equity calculations",
        gasUsed: 21000,
      },
    ]
    setChainlinkCalls(initialCalls)
  }, [])

  const triggerChainlinkCall = async (service: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newCall: ChainlinkCall = {
        id: Date.now().toString(),
        service,
        timestamp: new Date(),
        status: "success",
        result: getServiceResult(service),
        gasUsed: Math.floor(Math.random() * 100000) + 20000,
      }

      setChainlinkCalls((prev) => [newCall, ...prev])

      toast({
        title: `${service} Triggered Successfully!`,
        description: newCall.result,
      })
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getServiceResult = (service: string): string => {
    const results = {
      "ElizaOS + Automation":
        "ElizaOS triggered weekly yield distribution: $" +
        (Math.random() * 2000 + 500).toFixed(2) +
        " to water equity investors",
      "ElizaForecaster + Functions": `ElizaOS AI Forecast: Well #${Math.floor(Math.random() * 200) + 100} predicted yield ${(Math.random() * 2 + 3).toFixed(1)}% (confidence: ${Math.floor(Math.random() * 20 + 75)}%)`,
      "Climate VRF": `ElizaOS climate event: ${Math.random() > 0.5 ? "Favorable rainfall detected" : "Drought risk flagged"} for Well #${Math.floor(Math.random() * 200) + 100}`,
      "Data Feeds": `USDC/USD price updated: $${(0.998 + Math.random() * 0.004).toFixed(4)} for water equity calculations`,
      "Data Streams": `Well #${Math.floor(Math.random() * 200) + 100} production: ${(Math.random() * 2 + 2).toFixed(1)} L/s monitored by ElizaOS`,
      CCIP: `Cross-chain water equity transfer: ${(Math.random() * 5000 + 1000).toFixed(0)} USDC from Avalanche to Base`,
      "Proof of Reserve": `NGO water funds verified: $${(Math.random() * 50000 + 100000).toFixed(0)} in reserve for emergency response`,
    }
    return results[service as keyof typeof results] || "ElizaOS service executed successfully"
  }

  const getServiceIcon = (service: string) => {
    const icons = {
      "ElizaOS + Automation": <RefreshCw className="h-5 w-5" />,
      "ElizaForecaster + Functions": <Brain className="h-5 w-5" />,
      "Climate VRF": <Dice5 className="h-5 w-5" />,
      "Data Feeds": <TrendingUp className="h-5 w-5" />,
      "Data Streams": <Zap className="h-5 w-5" />,
      CCIP: <Globe className="h-5 w-5" />,
      "Proof of Reserve": <Shield className="h-5 w-5" />,
    }
    return icons[service as keyof typeof icons] || <CheckCircle className="h-5 w-5" />
  }

  const getServiceColor = (service: string) => {
    const colors = {
      "ElizaOS + Automation": "bg-blue-100 text-blue-800",
      "ElizaForecaster + Functions": "bg-purple-100 text-purple-800",
      "Climate VRF": "bg-red-100 text-red-800",
      "Data Feeds": "bg-green-100 text-green-800",
      "Data Streams": "bg-yellow-100 text-yellow-800",
      CCIP: "bg-indigo-100 text-indigo-800",
      "Proof of Reserve": "bg-gray-100 text-gray-800",
    }
    return colors[service as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">How WaterFi Works</h1>
                <p className="text-gray-600">
                  ElizaOS AI Infrastructure + Chainlink Oracles = Autonomous Water Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500 text-white px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                All Systems Active
              </Badge>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">WaterFi Overview</TabsTrigger>
            <TabsTrigger value="eliza-services">ElizaOS + Chainlink</TabsTrigger>
            <TabsTrigger value="logs">Live AI Calls</TabsTrigger>
            <TabsTrigger value="interactive-demo">Interactive Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-3xl font-bold">7/7</p>
                    <p className="text-blue-100">Chainlink Services</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-purple-100">ElizaOS AI Agents</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-3xl font-bold">$47K</p>
                    <p className="text-green-100">Water Equity Staked</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-3xl font-bold">2040</p>
                    <p className="text-orange-100">Vision Target</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* WaterFi Vision */}
            <Card>
              <CardHeader>
                <CardTitle>🌍 WaterFi: The Future of Water Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-blue-600">🚨 The Crisis</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>2.2 billion people lack safe water access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>40% will face absolute scarcity by 2040</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Access shouldn't depend on geography</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-green-600">💡 The Solution</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Water wells as live financial infrastructure</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>AI-powered impact routing & yield optimization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Market-backed humanitarian infrastructure</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-center mb-4">🔮 Looking into 2040</h3>
                  <p className="text-center text-gray-700 mb-4">
                    What if water is tokenized like energy, traded like carbon, and secured like crypto?
                  </p>
                  <div className="flex justify-center gap-4">
                    <Badge className="bg-blue-500 text-white px-4 py-2">💦 Water Credits (WTRC)</Badge>
                    <Badge className="bg-green-500 text-white px-4 py-2">🌐 Real-time Economic Nodes</Badge>
                    <Badge className="bg-purple-500 text-white px-4 py-2">🌱 Regenerative Economy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eliza-services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "ElizaOS + Automation",
                "ElizaForecaster + Functions",
                "Climate VRF",
                "Data Feeds",
                "Data Streams",
                "CCIP",
                "Proof of Reserve",
              ].map((service) => (
                <Card key={service} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getServiceIcon(service)}
                      {service}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge className={getServiceColor(service)}>Active</Badge>
                    <p className="text-sm text-gray-600">
                      {service === "ElizaOS + Automation" &&
                        "ElizaOS triggers weekly yield distribution to all water equity investors"}
                      {service === "ElizaForecaster + Functions" &&
                        "AI-powered yield forecasting using climate APIs and satellite data"}
                      {service === "Climate VRF" &&
                        "Random climate event simulation for drought and flood risk modeling"}
                      {service === "Data Feeds" && "Real-time USDC/USD price feeds for water equity calculations"}
                      {service === "Data Streams" && "Live water production data streams monitored by ElizaOS"}
                      {service === "CCIP" && "Cross-chain water equity transfers and impact capital routing"}
                      {service === "Proof of Reserve" && "NGO fund verification and emergency response transparency"}
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => triggerChainlinkCall(service)}
                      disabled={isLoading}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Trigger AI Call
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live ElizaOS + Chainlink Call Logs
                  <Badge variant="outline">{chainlinkCalls.length} Total AI Calls</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chainlinkCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(call.service)}
                          <span className="font-semibold">{call.service}</span>
                          <Badge variant={call.status === "success" ? "default" : "destructive"} className="text-xs">
                            {call.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {call.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{call.result}</p>
                      {call.gasUsed && (
                        <p className="text-xs text-gray-500">Gas used: {call.gasUsed.toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactive-demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🎮 Interactive WaterFi Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">ElizaOS AI Actions</h3>
                    <div className="space-y-2">
                      <Button
                        className="w-full justify-start"
                        onClick={() => triggerChainlinkCall("ElizaOS + Automation")}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Trigger Weekly Water Equity Distribution
                      </Button>
                      <Button
                        className="w-full justify-start"
                        onClick={() => triggerChainlinkCall("ElizaForecaster + Functions")}
                        disabled={isLoading}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Generate AI Climate Forecast
                      </Button>
                      <Button
                        className="w-full justify-start"
                        onClick={() => triggerChainlinkCall("Climate VRF")}
                        disabled={isLoading}
                      >
                        <Dice5 className="h-4 w-4 mr-2" />
                        Simulate Climate Event
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">User Journeys</h3>
                    <div className="space-y-2">
                      <Link href="/investor">
                        <Button variant="outline" className="w-full justify-start">
                          👤 Water Equity Investor Journey
                        </Button>
                      </Link>
                      <Link href="/partner">
                        <Button variant="outline" className="w-full justify-start">
                          🧑‍🌾 Field Partner Journey
                        </Button>
                      </Link>
                      <Link href="/impact/112">
                        <Button variant="outline" className="w-full justify-start">
                          🎯 View Impact Report
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold text-green-700">
                        🤖 "Eliza, where can I help the most people this month?"
                      </h3>
                      <p className="text-gray-700">
                        Let our AI show you high-impact, low-risk water wells. Every USDC staked creates real impact for
                        hundreds of people — with yield predicted and distributed automatically by ElizaOS.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Badge className="bg-blue-500 text-white px-4 py-2">Real Impact</Badge>
                        <Badge className="bg-green-500 text-white px-4 py-2">Real Yield</Badge>
                        <Badge className="bg-purple-500 text-white px-4 py-2">Real Transparency</Badge>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">
                        🏆 This isn't charity. This is market-backed humanitarian infrastructure.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
