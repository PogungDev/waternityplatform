"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, TrendingUp, Users } from "lucide-react"

interface WellData {
  tokenId: number
  location: string
  capacity: number
  peopleServed: number
  yieldRate: number
  impactScore: number
}

interface StakeModalProps {
  isOpen: boolean
  onClose: () => void
  well: WellData
  onStake?: (tokenId: number, amount: number) => void
}

export function StakeModal({ isOpen, onClose, well, onStake }: StakeModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleStake = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setIsLoading(true)
    try {
      await onStake?.(well.tokenId, Number.parseFloat(amount))
      setAmount("")
      onClose()
    } catch (error) {
      console.error("Staking failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const projectedYield = amount ? (Number.parseFloat(amount) * well.yieldRate) / 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stake in Well #{well.tokenId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{well.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>{well.peopleServed} people served</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span>{well.yieldRate}% APY</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Stake (USDC)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {amount && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Projected Annual Yield:</span>
                    <span className="font-medium">${projectedYield.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impact Score Contribution:</span>
                    <span className="font-medium">+{Math.floor(Number.parseFloat(amount) / 100)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleStake}
              disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
              className="flex-1"
            >
              {isLoading ? "Staking..." : "Stake USDC"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
