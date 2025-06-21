"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Users, MapPin, TrendingUp, Dice5 } from "lucide-react" // Import Dice5 icon
import { useState } from "react"
import { StakeModal } from "./stake-modal"

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
}

interface WellCardProps {
  well: WellData
  onStake?: (tokenId: number, amount: number) => void
  onSimulateRandomEvent?: (tokenId: number) => void // New prop for VRF simulation
}

export function WellCard({ well, onStake, onSimulateRandomEvent }: WellCardProps) {
  const [showStakeModal, setShowStakeModal] = useState(false)

  return (
    <>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Well #{well.tokenId}</CardTitle>
            <Badge variant={well.isActive ? "default" : "secondary"}>{well.isActive ? "Active" : "Inactive"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {well.imageUrl && (
            <div className="aspect-video rounded-lg bg-muted overflow-hidden">
              <img
                src={well.imageUrl || "/placeholder.svg?height=200&width=300"}
                alt={`Well in ${well.location}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{well.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="h-4 w-4" />
              <span>{well.capacity.toLocaleString()} L/day</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{well.peopleServed} people served</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{well.yieldRate}% APY</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span>Total Staked:</span>
              <span className="font-medium">${well.totalStaked.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Impact Score:</span>
              <span className="font-medium">{well.impactScore}</span>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => setShowStakeModal(true)} className="w-full" disabled={!well.isActive}>
                Stake USDC
              </Button>
              {onSimulateRandomEvent && (
                <Button
                  variant="outline"
                  className="w-full bg-black text-white"
                  onClick={() => onSimulateRandomEvent(well.tokenId)}
                >
                  <Dice5 className="h-4 w-4 mr-2" />
                  Simulate Random Event
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <StakeModal isOpen={showStakeModal} onClose={() => setShowStakeModal(false)} well={well} onStake={onStake} />
    </>
  )
}
