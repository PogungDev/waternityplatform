"use client"

import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle, DollarSign, Users, Zap } from "lucide-react"

interface ChainlinkStatusBarProps {
  isConnected: boolean
  address?: string
  totalStaked?: number
  totalRewards?: number
  totalImpact?: number
  isPartner?: boolean
  registeredWells?: number
}

export function ChainlinkStatusBar({
  isConnected,
  address,
  totalStaked = 0,
  totalRewards = 0,
  totalImpact = 0,
  isPartner = false,
  registeredWells = 0,
}: ChainlinkStatusBarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Wallet Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="font-medium">
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Not Connected"}
              </span>
              {isConnected && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>

            {isPartner && isConnected && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Field Partner
              </Badge>
            )}
          </div>

          {/* Center: Key Metrics */}
          {isConnected && (
            <div className="flex items-center gap-6 text-sm">
              {!isPartner ? (
                <>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">${totalStaked}</span>
                    <span className="text-muted-foreground">staked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="font-medium">${totalRewards.toFixed(2)}</span>
                    <span className="text-muted-foreground">rewards</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{totalImpact}</span>
                    <span className="text-muted-foreground">people helped</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{registeredWells}</span>
                  <span className="text-muted-foreground">wells registered</span>
                </div>
              )}
            </div>
          )}

          {/* Right: Chainlink Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Chainlink Active</span>
            </div>
            <Badge variant="outline" className="text-xs">
              7/7 Services
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
