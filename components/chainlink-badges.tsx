"use client"

import { Badge } from "@/components/ui/badge"
import { Cloud, RefreshCw, Brain, Shuffle, Link, ShieldCheck, DollarSign } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Import Tooltip components

interface ChainlinkBadgesProps {
  className?: string
}

export function ChainlinkBadges({ className }: ChainlinkBadgesProps) {
  return (
    <TooltipProvider>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800">
              <Cloud className="h-3 w-3" />
              Data Feeds (Simulated)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simulasi data harga USDC/USD untuk perhitungan yield.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800">
              <RefreshCw className="h-3 w-3" />
              Automation (Simulated)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simulasi distribusi yield mingguan otomatis.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-purple-100 text-purple-800">
              <Brain className="h-3 w-3" />
              Functions (Simulated)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simulasi AI-powered yield forecasting.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800">
              <Shuffle className="h-3 w-3" />
              VRF (Simulated)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simulasi randomness untuk event bencana/kejutan.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
              <Link className="h-3 w-3" />
              CCIP (Simulated)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simulasi transfer cross-chain untuk donasi/dana.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-800">
              <ShieldCheck className="h-3 w-3" />
              Proof of Reserve (Simulated)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simulasi verifikasi dana NGO.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-orange-100 text-orange-800">
              <DollarSign className="h-3 w-3" />
              Data Streams (Simulated)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simulasi data produksi air real-time.</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
