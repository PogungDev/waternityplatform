"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Droplets, Award, Share2, ArrowLeft, CheckCircle, TrendingUp, Globe, Heart, Star, Trophy } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ImpactDetailPage() {
  const params = useParams()
  const wellId = params.id as string
  const [showConfetti, setShowConfetti] = useState(false)

  const impactData = {
    wellId: Number.parseInt(wellId) || 1,
    location: "Lombok, Indonesia",
    peopleHelped: 326,
    waterProvided: 1650000, // liters annually
    yourContribution: 1000, // USDC staked
    yieldEarned: 42.5,
    impactRank: 2,
    totalInvestors: 23,
    carbonOffset: 8.2, // tons CO2
    communityStories: [
      {
        name: "Sari & Family",
        story: "Now has clean water access for cooking and drinking",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Local School",
        story: "150 students now have clean water during school hours",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  }

  useEffect(() => {
    // Trigger confetti effect on load
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Water Impact with Waternity",
        text: `I've helped ${impactData.peopleHelped} people get clean water access in ${impactData.location}!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(
        `I've helped ${impactData.peopleHelped} people get clean water access in ${impactData.location}! Check out Waternity: ${window.location.href}`,
      )
      alert("Impact link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-10 left-10 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-20 right-20 text-4xl animate-bounce delay-100">💧</div>
          <div className="absolute top-32 left-1/2 text-4xl animate-bounce delay-200">🌟</div>
          <div className="absolute top-40 right-10 text-4xl animate-bounce delay-300">🏆</div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/investor">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">🎯 Impact Report - Well #{impactData.wellId}</h1>
              <p className="text-muted-foreground">Your contribution is making a real difference</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Impact Card */}
        <Card className="bg-gradient-to-r from-blue-600 via-green-600 to-yellow-500 text-white border-0 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Water Impact Champion</h2>
                  <p className="text-white/80">Verified by Chainlink Oracles</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-5xl md:text-7xl font-bold">{impactData.peopleHelped}</h3>
                <p className="text-2xl md:text-3xl opacity-90">
                  People in {impactData.location} now have clean water access thanks to your $
                  {impactData.yourContribution} investment
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Badge className="bg-white/20 border-white/30 text-white text-lg px-6 py-3">
                  <Award className="h-5 w-5 mr-2" />
                  Rank #{impactData.impactRank} of {impactData.totalInvestors} Investors
                </Badge>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-lg px-6 py-3"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Your Impact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Droplets className="h-6 w-6" />
                Water Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-4xl font-bold">{(impactData.waterProvided / 1000000).toFixed(1)}M</p>
                <p className="text-blue-100">Liters provided annually</p>
                <Progress value={85} className="h-3 bg-blue-400" />
                <p className="text-sm text-blue-100">85% of well capacity utilized</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-6 w-6" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-4xl font-bold">{impactData.peopleHelped}</p>
                <p className="text-green-100">People directly served</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Families:</span>
                    <span>65</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Children:</span>
                    <span>156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Elderly:</span>
                    <span>42</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-6 w-6" />
                Your Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-4xl font-bold">${impactData.yieldEarned}</p>
                <p className="text-yellow-100">Earned from ${impactData.yourContribution} staked</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>ROI:</span>
                    <span>{((impactData.yieldEarned / impactData.yourContribution) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon offset:</span>
                    <span>{impactData.carbonOffset} tons CO₂</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Real Stories from {impactData.location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactData.communityStories.map((story, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800">{story.name}</h3>
                    <p className="text-sm text-gray-700 mt-1">{story.story}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chainlink Verification */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />🔗 Verified by Chainlink Oracles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                All impact metrics are verified and updated in real-time using Chainlink's decentralized oracle network.
                Your contribution and its impact are transparently tracked on-chain.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Data Feeds ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Automation ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Functions ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Proof of Reserve ✓</span>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Last verification:</strong> {new Date().toLocaleString()} via Chainlink Automation
                  <br />
                  <strong>Next update:</strong> Every Sunday at 12:00 UTC
                  <br />
                  <strong>Data source:</strong> Field partner reports + satellite imagery + IoT sensors
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Badge NFT */}
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              🎖️ Your Impact Badge NFT
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold">
              #{impactData.wellId}
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-800">Water Champion Badge</h3>
              <p className="text-purple-600">Lombok Water Well Supporter</p>
              <p className="text-sm text-gray-600 mt-2">
                This NFT badge represents your verified contribution to providing clean water access to{" "}
                {impactData.peopleHelped} people in {impactData.location}.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">Mint Impact Badge NFT</Button>
              <Button variant="outline" onClick={handleShare}>
                Share Badge
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center pt-8 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Ready to help more communities?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/investor">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Invest in More Wells
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleShare}>
              Share Your Impact Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
