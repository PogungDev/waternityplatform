"use client"

import { useState, useEffect } from "react"
import { WellCard } from "./well-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast" // Import useToast

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

interface WellMarketplaceProps {
  onStake?: (tokenId: number, amount: number) => void
}

export function WellMarketplace({ onStake }: WellMarketplaceProps) {
  const [wells, setWells] = useState<WellData[]>([])
  const [filteredWells, setFilteredWells] = useState<WellData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("impactScore")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast() // Inisialisasi toast

  // Mock data for demo
  useEffect(() => {
    const mockWells: WellData[] = [
      {
        tokenId: 1,
        location: "Lombok, Indonesia",
        capacity: 5000,
        peopleServed: 250,
        isActive: true,
        totalStaked: 12500,
        impactScore: 850,
        yieldRate: 3.2,
        imageUrl: "/placeholder.svg?height=200&width=300",
      },
      {
        tokenId: 2,
        location: "Sumba, Indonesia",
        capacity: 3500,
        peopleServed: 180,
        isActive: true,
        totalStaked: 8900,
        impactScore: 620,
        yieldRate: 2.8,
        imageUrl: "/placeholder.svg?height=200&width=300",
      },
      {
        tokenId: 3,
        location: "Flores, Indonesia",
        capacity: 4200,
        peopleServed: 210,
        isActive: true,
        totalStaked: 15600,
        impactScore: 780,
        yieldRate: 3.5,
        imageUrl: "/placeholder.svg?height=200&width=300",
      },
      {
        tokenId: 4,
        location: "Timor, Indonesia",
        capacity: 2800,
        peopleServed: 140,
        isActive: false,
        totalStaked: 5200,
        impactScore: 420,
        yieldRate: 2.1,
        imageUrl: "/placeholder.svg?height=200&width=300",
      },
      {
        tokenId: 5,
        location: "Bali, Indonesia",
        capacity: 6000,
        peopleServed: 300,
        isActive: true,
        totalStaked: 22100,
        impactScore: 950,
        yieldRate: 4.1,
        imageUrl: "/placeholder.svg?height=200&width=300",
      },
    ]
    setWells(mockWells)
    setFilteredWells(mockWells)
  }, [])

  // Filter and sort wells
  useEffect(() => {
    const filtered = wells.filter((well) => {
      const matchesSearch = well.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && well.isActive) ||
        (filterStatus === "inactive" && !well.isActive)

      return matchesSearch && matchesStatus
    })

    // Sort wells
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "impactScore":
          return b.impactScore - a.impactScore
        case "yieldRate":
          return b.yieldRate - a.yieldRate
        case "totalStaked":
          return b.totalStaked - a.totalStaked
        case "capacity":
          return b.capacity - a.capacity
        default:
          return 0
      }
    })

    setFilteredWells(filtered)
  }, [wells, searchTerm, sortBy, filterStatus])

  const handleSimulateRandomEvent = (tokenId: number) => {
    setWells((prevWells) =>
      prevWells.map((well) => {
        if (well.tokenId === tokenId) {
          const randomImpact = Math.random() // 0 to 1
          let newYieldRate = well.yieldRate
          let message = ""
          let variant: "default" | "destructive" | "secondary" = "default"

          if (randomImpact < 0.2) {
            // 20% chance of severe impact
            newYieldRate = Math.max(0.5, well.yieldRate * 0.5) // Reduce by 50%, min 0.5%
            message = `Severe drought simulated for Well #${tokenId}! Yield reduced to ${newYieldRate.toFixed(1)}%.`
            variant = "destructive"
          } else if (randomImpact < 0.5) {
            // 30% chance of moderate impact
            newYieldRate = Math.max(1.0, well.yieldRate * 0.8) // Reduce by 20%, min 1.0%
            message = `Minor issue simulated for Well #${tokenId}! Yield reduced to ${newYieldRate.toFixed(1)}%.`
            variant = "secondary"
          } else {
            // 50% chance of positive/no impact
            newYieldRate = Math.min(5.0, well.yieldRate * 1.1) // Increase by 10%, max 5.0%
            message = `Favorable conditions for Well #${tokenId}! Yield increased to ${newYieldRate.toFixed(1)}%.`
            variant = "default"
          }

          toast({
            title: "Random Event Simulated!",
            description: message,
            variant: variant,
          })

          return { ...well, yieldRate: Number.parseFloat(newYieldRate.toFixed(1)) }
        }
        return well
      }),
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Water Well Marketplace</h2>
          <p className="text-muted-foreground">
            Discover and invest in water wells to earn yield and create social impact
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {filteredWells.length} Wells Available
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="impactScore">Impact Score</SelectItem>
            <SelectItem value="yieldRate">Yield Rate</SelectItem>
            <SelectItem value="totalStaked">Total Staked</SelectItem>
            <SelectItem value="capacity">Capacity</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWells.map((well) => (
          <WellCard
            key={well.tokenId}
            well={well}
            onStake={onStake}
            onSimulateRandomEvent={handleSimulateRandomEvent}
          />
        ))}
      </div>

      {filteredWells.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">No wells found matching your criteria</div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("")
              setFilterStatus("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
