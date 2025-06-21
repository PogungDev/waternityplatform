"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Users, TrendingUp, ArrowRight, Globe, Brain, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
      {/* Floating Chainlink Badge */}
      <div className="fixed top-4 right-4 z-50">
        <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-semibold animate-pulse">
          🤖 Powered by ElizaOS + 7 Chainlink Services ✅
        </Badge>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <Droplets className="h-16 w-16 text-blue-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-gray-900">Waternity</h1>
                <p className="text-xl text-blue-600 font-semibold">Building AI Infrastructure for Water Equity</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-200 shadow-xl">
              <div className="mb-6">
                <Badge className="bg-red-100 text-red-800 px-4 py-2 text-sm font-semibold mb-4">
                  🌍 CRISIS: 2.2 billion people lack safe water access
                </Badge>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                <span className="text-blue-600">Well NFT #112</span> →{" "}
                <span className="text-green-600">437 People Served</span> →{" "}
                <span className="text-yellow-600">4.1% APY</span>
              </h2>

              <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-6">
                This isn't just an NFT. It represents 1 active water well in East Africa, and every USDC you stake
                creates real impact for hundreds of people — with yield predicted and distributed automatically by
                ElizaOS + Chainlink.
              </p>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border-2 border-purple-200">
                <p className="text-lg font-semibold text-purple-800 mb-2">
                  🤖 "Eliza, where can I help the most people this month?"
                </p>
                <p className="text-gray-700">Let our AI show you. Stake, claim, and flow into the future of WaterFi.</p>
              </div>
            </div>
          </div>

          {/* Crisis Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">2.2B</p>
                  <p className="text-red-100">People Without Safe Water</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">40%</p>
                  <p className="text-orange-100">Will Face Scarcity by 2040</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-green-100">Already Helped by Waternity</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Droplets className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">5.4%</p>
                  <p className="text-blue-100">Max Simulated APY</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Link href="/investor">
              <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-blue-200 hover:border-blue-400">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-600">Water Investor</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">
                    Stake USDC in water wells, earn real yield, and create measurable social impact.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>ElizaOS AI-Powered Forecasting</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Automated Weekly Distributions</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Real Impact Tracking</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Building Water Equity
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/partner">
              <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-green-200 hover:border-green-400">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-600">Field Partner</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">
                    Register water wells, mint NFTs, and connect real-world impact to blockchain.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Instant NFT Minting</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Real-time Data Updates</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Chainlink Verification</span>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Register Wells
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/how-it-works">
              <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-orange-200 hover:border-orange-400">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl text-orange-600">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">
                    Explore the AI infrastructure and see ElizaOS + Chainlink integrations in action.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>ElizaOS AI Agents</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Live Oracle Calls</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Interactive Demo</span>
                    </div>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    See the AI in Action
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* ElizaOS + Chainlink Showcase */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                🤖 ElizaOS + Chainlink = Autonomous Water Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-purple-600">🧠 ElizaOS AI Agents</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span>
                        <strong>ElizaForecaster:</strong> Predicts water abundance & drought risk
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>
                        <strong>ElizaImpactMatcher:</strong> Routes funds to maximum human impact
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>
                        <strong>ElizaPlanner:</strong> Optimizes yield up to 5.4% APY
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-orange-600">🔗 Chainlink Oracles</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>
                        <strong>Functions:</strong> Fetch rainfall & climate data
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        <strong>Automation:</strong> Weekly yield distribution
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>
                        <strong>VRF:</strong> Climate shock event simulation
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 rounded-lg p-4 text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  💬 "Eliza doesn't just wait — she predicts, routes, and optimizes."
                </p>
                <p className="text-gray-600">
                  Real-time AI intelligence making every well a live economic node in the fight against water scarcity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Live Example */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
            <CardHeader>
              <CardTitle className="text-center text-2xl">📊 Live Example: Well NFT #112 – East Africa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">📌</span>
                  </div>
                  <p className="font-semibold text-blue-600">Location</p>
                  <p className="text-xs text-gray-600">0.8km from Arusha recharge zone</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">💧</span>
                  </div>
                  <p className="font-semibold text-green-600">Flow Rate</p>
                  <p className="text-xs text-gray-600">2.9 L/s active production</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <p className="font-semibold text-purple-600">Impact</p>
                  <p className="text-xs text-gray-600">437 people served daily</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">💰</span>
                  </div>
                  <p className="font-semibold text-yellow-600">Investment</p>
                  <p className="text-xs text-gray-600">$800 staked → 4.1% APY</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vision 2040 */}
          <div className="text-center pt-12">
            <Card className="bg-gradient-to-r from-gray-900 to-blue-900 text-white border-0">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-3xl font-bold mb-4">🔮 Looking into 2040</h2>
                <p className="text-xl mb-6 max-w-4xl mx-auto">
                  What if water is tokenized like energy, traded like carbon, and secured like crypto?
                </p>
                <p className="text-lg mb-8 text-blue-100">
                  Waternity is the first protocol to lay that foundation. This isn't DeFi. This is{" "}
                  <strong>WaterFi</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Badge className="bg-blue-500 text-white px-6 py-3 text-lg">💦 Water Credits (WTRC)</Badge>
                  <Badge className="bg-green-500 text-white px-6 py-3 text-lg">🌐 Real-time Economic Nodes</Badge>
                  <Badge className="bg-purple-500 text-white px-6 py-3 text-lg">🌱 Regenerative Water Economy</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
