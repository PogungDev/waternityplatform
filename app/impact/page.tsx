"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Droplets, Award, Share2, ArrowLeft, CheckCircle, TrendingUp, Globe } from "lucide-react"
import Link from "next/link"

export default function ImpactPage() {
  const impactData = {
    peopleHelped: 460,
    waterProvided: 2100000, // liters annually
    communitiesSupported: 3,
    totalStaked: 1500,
    yieldEarned: 34.25,
    carbonOffset: 12.5, // tons CO2
    wellsSupported: [
      { id: 1, location: "Lombok, Indonesia", people: 250, stake: 1000 },
      { id: 2, location: "Flores, Indonesia", people: 210, stake: 500 },
    ],
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Water Impact with Waternity",
        text: `I've helped ${impactData.peopleHelped} people get clean water access through Waternity!`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `I've helped ${impactData.peopleHelped} people get clean water access through Waternity! Check it out: ${window.location.href}`,
      )
      alert("Impact link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/investor">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Your Impact Report</h1>
              <p className="text-muted-foreground">See the real-world difference you've made</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Impact Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="h-8 w-8" />
                <span className="text-xl font-semibold">Impact Verified by Chainlink</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold">{impactData.peopleHelped}</h2>
              <p className="text-xl md:text-2xl opacity-90">
                People now have clean water access thanks to your investment
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  Water Impact Champion
                </Badge>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Your Impact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Droplets className="h-5 w-5 text-blue-500" />
                Water Provided
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-600">{(impactData.waterProvided / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Liters annually</p>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">75% of target capacity</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-green-500" />
                Communities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-green-600">{impactData.communitiesSupported}</p>
                <p className="text-sm text-muted-foreground">Communities supported</p>
                <div className="space-y-1">
                  {impactData.wellsSupported.map((well) => (
                    <div key={well.id} className="text-xs text-muted-foreground">
                      • {well.location} ({well.people} people)
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Your Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-purple-600">${impactData.yieldEarned}</p>
                <p className="text-sm text-muted-foreground">Earned from ${impactData.totalStaked} staked</p>
                <div className="text-xs text-muted-foreground">
                  <div>• ROI: {((impactData.yieldEarned / impactData.totalStaked) * 100).toFixed(1)}%</div>
                  <div>• Carbon offset: {impactData.carbonOffset} tons CO₂</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Impact Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Impact Breakdown by Well</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {impactData.wellsSupported.map((well) => (
                <div key={well.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      Well #{well.id} - {well.location}
                    </h3>
                    <Badge variant="outline">${well.stake} staked</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">People Served</p>
                      <p className="font-semibold">{well.people}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily Water</p>
                      <p className="font-semibold">{well.id === 1 ? "5,000" : "4,200"} L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Your Share</p>
                      <p className="font-semibold">{well.id === 1 ? "8%" : "3.2%"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chainlink Verification */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Verified by Chainlink Oracles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                All impact metrics are verified and updated in real-time using Chainlink's decentralized oracle network.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Data Feeds ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Automation ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Functions ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Proof of Reserve ✓</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Last updated: {new Date().toLocaleString()} via Chainlink Automation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <Link href="/investor">
            <Button size="lg" className="mr-4">
              Continue Investing
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={handleShare}>
            Share Your Story
          </Button>
        </div>
      </div>
    </div>
  )
}
