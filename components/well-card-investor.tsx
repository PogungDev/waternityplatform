"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Users, MapPin, TrendingUp, Dice5, Brain, Award } from "lucide-react"
import { AIForecastModal } from "./ai-forecast-modal"

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

interface WellCardInvestorProps {
  well: WellData
  onStake?: (well: WellData) => void
  onRandomEvent?: (tokenId: number) => void
  isInvestor?: boolean
}

export function WellCard({ well, onStake, onRandomEvent, isInvestor }: WellCardInvestorProps) {
  const [showForecast, setShowForecast] = useState(false)

  return (
    <>
      <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-blue-100 hover:border-blue-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Well #{well.tokenId}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant={well.isActive ? "default" : "secondary"} className="bg-green-500 text-white">
                {well.isActive ? "🟢 Active" : "🔴 Inactive"}
              </Badge>
              {well.myStake && well.myStake > 0 && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  <Award className="h-3 w-3 mr-1" />
                  Invested
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {well.imageUrl && (
            <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden border-2 border-blue-200">
              <img
                src={well.imageUrl || "/placeholder.svg"}
                alt={`Well in ${well.location}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <MapPin className="h-4 w-4" />
              <span>{well.location}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Droplets className="h-4 w-4" />
                <span>{well.capacity.toLocaleString()} L/day</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Users className="h-4 w-4" />
                <span>{well.peopleServed} people</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-bold text-green-700">{well.yieldRate}% APY</span>
                </div>
                <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Predicted
                </Badge>
              </div>
            </div>
          </div>

          {/* Investment Info */}
          {well.myStake && well.myStake > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Your Stake:</span>
                  <span className="font-bold text-blue-800">${well.myStake}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Pending Rewards:</span>
                  <span className="font-bold text-green-800">+${well.pendingRewards?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Impact Score:</span>
                  <span className="font-bold text-purple-800">{Math.floor((well.myStake || 0) / 10)} points</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-4">
              <span className="text-gray-600">Total Staked:</span>
              <span className="font-bold text-gray-800">${well.totalStaked.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => onStake?.(well)}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold"
                disabled={!well.isActive}
              >
                {well.myStake && well.myStake > 0 ? "💰 Stake More USDC" : "🚀 Start Staking"}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowForecast(true)}
                  className="bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
                >
                  <Brain className="h-4 w-4 mr-1" />
                  AI Forecast
                </Button>

                {onRandomEvent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRandomEvent(well.tokenId)}
                    className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                  >
                    <Dice5 className="h-4 w-4 mr-1" />
                    VRF Event
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AIForecastModal
        isOpen={showForecast}
        onClose={() => setShowForecast(false)}
        wellId={well.tokenId}
        location={well.location}
      />
    </>
  )
}
