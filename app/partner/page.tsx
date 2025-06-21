"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Droplets, MapPin, CheckCircle, Clock, TrendingUp, Brain } from "lucide-react"
import { ChainlinkStatusBar } from "@/components/chainlink-status-bar"
import { useToast } from "@/hooks/use-toast"

interface WellRegistration {
  location: string
  capacity: number
  peopleServed: number
  description: string
  imageUrl: string
}

export default function PartnerPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [registeredWells, setRegisteredWells] = useState<any[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState<WellRegistration>({
    location: "",
    capacity: 0,
    peopleServed: 0,
    description: "",
    imageUrl: "",
  })
  const { toast } = useToast()

  const handleConnect = () => {
    setIsConnected(true)
    setAddress("0xField...Partner")
    toast({
      title: "Field Partner Wallet Connected!",
      description: "Welcome to WaterFi infrastructure. You can now register water wells for the global network.",
    })
  }

  const handleRegisterWell = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)

    try {
      // Simulate well registration
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newWell = {
        tokenId: registeredWells.length + 200,
        ...formData,
        registeredAt: new Date(),
        status: "pending_eliza_verification",
        totalStaked: 0,
      }

      setRegisteredWells((prev) => [...prev, newWell])

      toast({
        title: "Well Registered Successfully!",
        description: `Well in ${formData.location} has been registered and NFT minted. ElizaOS is now analyzing optimal impact routing.`,
      })

      // Reset form
      setFormData({
        location: "",
        capacity: 0,
        peopleServed: 0,
        description: "",
        imageUrl: "",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleUpdateWellData = (wellId: number) => {
    toast({
      title: "Well Data Updated!",
      description: `Production data for Well #${wellId} has been updated via Chainlink Data Feeds and processed by ElizaOS.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Status Bar */}
      <ChainlinkStatusBar
        isConnected={isConnected}
        address={address}
        isPartner={true}
        registeredWells={registeredWells.length}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {!isConnected ? (
          // Connect Wallet Section
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Droplets className="h-6 w-6" />
                  Field Partner Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 font-semibold mb-2">🌍 Building Water Infrastructure for 2040</p>
                  <p className="text-xs text-green-600">
                    Register wells to create real-world economic nodes in the fight against water scarcity.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  Connect your authorized partner wallet to register new water wells and manage existing infrastructure.
                </p>
                <Button onClick={handleConnect} className="w-full" size="lg">
                  Connect Partner Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* ElizaOS Integration Info */}
            <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  ElizaOS Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-purple-800">
                  Your registered wells are automatically analyzed by ElizaOS for optimal impact routing and yield
                  forecasting.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>ElizaForecaster: Climate risk analysis active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>ElizaImpactMatcher: Routing optimization enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Chainlink Automation: Weekly yield distribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Proof of Reserve: Fund verification active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Register New Well */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Register New Water Well
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterWell} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Kenya - Turkana County"
                        value={formData.location}
                        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Daily Capacity (Liters)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="e.g., 5000"
                        value={formData.capacity || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, capacity: Number(e.target.value) }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="peopleServed">People Served</Label>
                      <Input
                        id="peopleServed"
                        type="number"
                        placeholder="e.g., 437"
                        value={formData.peopleServed || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, peopleServed: Number(e.target.value) }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        placeholder="https://example.com/well-image.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the well and community impact"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isRegistering}>
                    {isRegistering ? "Registering Well & Minting NFT..." : "Register Well & Mint NFT"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Registered Wells */}
            {registeredWells.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    Your Registered Wells
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registeredWells.map((well) => (
                      <div key={well.tokenId} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              Well #{well.tokenId} - {well.location}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {well.capacity.toLocaleString()} L/day • {well.peopleServed} people served
                            </p>
                          </div>
                          <Badge variant={well.status === "pending_eliza_verification" ? "secondary" : "default"}>
                            {well.status === "pending_eliza_verification" ? "ElizaOS Analyzing" : "Active"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>Total Staked: ${well.totalStaked.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Registered: {well.registeredAt.toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleUpdateWellData(well.tokenId)}>
                            Update Production Data
                          </Button>
                          <Button variant="outline" size="sm">
                            View in Marketplace
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
