'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, Trash2, AlertTriangle, Users, Droplets, MapPin, Zap, Edit, Save, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useWallet } from '@/hooks/use-wallet'
import { getWaternityRouter, getWaterNFT, formatTimestamp } from '@/lib/contracts'
import { ethers } from 'ethers'

interface WellData {
  tokenId: number
  location: string
  capacity: bigint
  peopleServed: bigint
  isActive: boolean
  fieldPartner: string
  createdAt: bigint
  metadataURI: string
  totalStaked: bigint
  impactScore: bigint
}

interface MintFormData {
  to: string
  location: string
  capacity: string
  peopleServed: string
  metadataURI: string
}

// Dummy data for demo purposes
const dummyWells: WellData[] = [
  {
    tokenId: 1,
    location: "Jakarta, Indonesia",
    capacity: BigInt(5000),
    peopleServed: BigInt(1200),
    isActive: true,
    fieldPartner: "Water for Life Foundation",
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 30), // 30 days ago
    metadataURI: "jakarta-well-metadata",
    totalStaked: BigInt("150000000000000000000"), // 150 ETH
    impactScore: BigInt(85)
  },
  {
    tokenId: 2,
    location: "Bandung, Indonesia", 
    capacity: BigInt(3000),
    peopleServed: BigInt(800),
    isActive: true,
    fieldPartner: "Clean Water Initiative",
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 20), // 20 days ago
    metadataURI: "bandung-well-metadata",
    totalStaked: BigInt("100000000000000000000"), // 100 ETH
    impactScore: BigInt(72)
  },
  {
    tokenId: 3,
    location: "Surabaya, Indonesia",
    capacity: BigInt(7000),
    peopleServed: BigInt(2100),
    isActive: true,
    fieldPartner: "Indonesian Water Alliance",
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 15), // 15 days ago
    metadataURI: "surabaya-well-metadata",
    totalStaked: BigInt("200000000000000000000"), // 200 ETH
    impactScore: BigInt(92)
  },
  {
    tokenId: 4,
    location: "Yogyakarta, Indonesia",
    capacity: BigInt(4000),
    peopleServed: BigInt(950),
    isActive: false,
    fieldPartner: "Rural Water Solutions",
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 10), // 10 days ago
    metadataURI: "yogyakarta-well-metadata",
    totalStaked: BigInt("75000000000000000000"), // 75 ETH
    impactScore: BigInt(68)
  }
]

export function WellManagement() {
  const { provider, address } = useWallet()
  const { toast } = useToast()

  const [wells, setWells] = useState<WellData[]>([])
  const [loading, setLoading] = useState(true)
  const [minting, setMinting] = useState(false)
  const [burning, setBurning] = useState<number | null>(null)
  const [totalMinted, setTotalMinted] = useState<bigint>(0n)
  const [useDummyData, setUseDummyData] = useState(false)
  const [editingWell, setEditingWell] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<WellData>>({})
  
  const [mintForm, setMintForm] = useState<MintFormData>({
    to: '',
    location: '',
    capacity: '',
    peopleServed: '',
    metadataURI: ''
  })
  
  const [burnReason, setBurnReason] = useState('')
  const [selectedWellForBurn, setSelectedWellForBurn] = useState<number | null>(null)

  useEffect(() => {
    if (provider && !useDummyData) {
      loadWellsData()
    } else {
      loadDummyData()
    }
  }, [provider, useDummyData])

  const loadDummyData = () => {
    setLoading(true)
    setTimeout(() => {
      setWells([...dummyWells])
      setTotalMinted(BigInt(dummyWells.length))
      setLoading(false)
      toast({
        title: "Demo Mode",
        description: "Using dummy data for demonstration",
      })
    }, 1000)
  }

  const loadWellsData = async () => {
    if (!provider) return

    try {
      const waterNFT = getWaterNFT(provider)
      const router = getWaternityRouter(provider)
      
      // Get total minted wells
      const total = await waterNFT.getTotalMinted()
      setTotalMinted(total)
      
      // Load all wells data
      const wellsData: WellData[] = []
      for (let i = 0; i < Number(total); i++) {
        try {
          // Check if well exists (not burned)
          const exists = await waterNFT.wellExists(i)
          if (!exists) continue
          
          // Get comprehensive well data with Chainlink integration
          const [basicData, registryData, stakeAmount, yieldRate, marketPrice, automationEnabled] = 
            await router.getWellDetailsWithChainlink(i)
          
          wellsData.push({
            tokenId: i,
            location: basicData.location,
            capacity: basicData.capacity,
            peopleServed: basicData.peopleServed,
            isActive: basicData.isActive,
            fieldPartner: basicData.fieldPartner,
            createdAt: basicData.createdAt,
            metadataURI: basicData.metadataURI,
            totalStaked: registryData.totalStaked,
            impactScore: registryData.impactScore
          })
        } catch (error) {
          console.error(`Failed to load well ${i}:`, error)
        }
      }
      
      setWells(wellsData)
    } catch (error) {
      console.error('Failed to load wells data:', error)
      toast({
        title: "Contract Error",
        description: "Failed to load wells data from blockchain. Switching to demo mode.",
        variant: "destructive"
      })
      // Automatically switch to dummy data on error
      setUseDummyData(true)
      loadDummyData()
      return
    } finally {
      setLoading(false)
    }
  }

  const handleEditWell = (well: WellData) => {
    setEditingWell(well.tokenId)
    setEditForm({
      location: well.location,
      capacity: well.capacity,
      peopleServed: well.peopleServed,
      fieldPartner: well.fieldPartner,
      isActive: well.isActive,
      impactScore: well.impactScore,
      totalStaked: well.totalStaked
    })
  }

  const handleSaveEdit = () => {
    if (editingWell === null) return
    
    setWells(prevWells => 
      prevWells.map(well => 
        well.tokenId === editingWell 
          ? { ...well, ...editForm }
          : well
      )
    )
    
    setEditingWell(null)
    setEditForm({})
    
    toast({
      title: "Success",
      description: "Well data updated successfully (demo mode)",
    })
  }

  const handleCancelEdit = () => {
    setEditingWell(null)
    setEditForm({})
  }

  const handleAddDummyWell = () => {
    if (!useDummyData) return
    
    if (!mintForm.location || !mintForm.capacity || !mintForm.peopleServed) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const newWell: WellData = {
      tokenId: Math.max(...wells.map(w => w.tokenId), 0) + 1,
      location: mintForm.location,
      capacity: BigInt(mintForm.capacity),
      peopleServed: BigInt(mintForm.peopleServed),
      isActive: true,
      fieldPartner: "Demo Partner",
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
      metadataURI: mintForm.metadataURI || `${mintForm.location.toLowerCase().replace(/\s+/g, '-')}-well-metadata`,
      totalStaked: BigInt("50000000000000000000"), // 50 ETH default
      impactScore: BigInt(75)
    }

    setWells(prev => [...prev, newWell])
    setTotalMinted(prev => prev + 1n)
    
    setMintForm({
      to: '',
      location: '',
      capacity: '',
      peopleServed: '',
      metadataURI: ''
    })

    toast({
      title: "Success",
      description: "Dummy well added successfully!",
    })
  }

  const handleDeleteDummyWell = (tokenId: number) => {
    if (!useDummyData) return
    
    setWells(prev => prev.filter(well => well.tokenId !== tokenId))
    setTotalMinted(prev => prev - 1n)
    
    toast({
      title: "Success",
      description: "Well deleted successfully (demo mode)",
    })
  }

  const handleMintWell = async () => {
    if (useDummyData) {
      handleAddDummyWell()
      return
    }

    if (!provider || !address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive"
      })
      return
    }

    if (!mintForm.to || !mintForm.location || !mintForm.capacity || !mintForm.peopleServed) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setMinting(true)
    try {
      const signer = await provider.getSigner()
      const router = getWaternityRouter(signer)
      
      const tx = await router.mintWell(
        mintForm.to || address,
        mintForm.location,
        ethers.parseUnits(mintForm.capacity, 0),
        ethers.parseUnits(mintForm.peopleServed, 0),
        mintForm.metadataURI || `${mintForm.location}-well-metadata`
      )
      
      const receipt = await tx.wait()
      
      toast({
        title: "Success",
        description: `Well minted successfully! Transaction: ${receipt.hash}`,
      })

      // Reset form and reload data
      setMintForm({
        to: '',
        location: '',
        capacity: '',
        peopleServed: '',
        metadataURI: ''
      })
      
      await loadWellsData()

    } catch (error: any) {
      console.error('Failed to mint well:', error)
      toast({
        title: "Error",
        description: error.reason || "Failed to mint well",
        variant: "destructive"
      })
    } finally {
      setMinting(false)
    }
  }

  const handleBurnWell = async (tokenId: number) => {
    if (useDummyData) {
      handleDeleteDummyWell(tokenId)
      return
    }

    if (!provider || !address) {
      toast({
        title: "Error", 
        description: "Please connect your wallet",
        variant: "destructive"
      })
      return
    }

    if (!burnReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for burning",
        variant: "destructive"
      })
      return
    }

    setBurning(tokenId)
    try {
      const signer = await provider.getSigner()
      const router = getWaternityRouter(signer)
      
      const tx = await router.burnWell(tokenId, burnReason.trim())
      const receipt = await tx.wait()
      
      toast({
        title: "Success",
        description: `Well ${tokenId} burned successfully! Transaction: ${receipt.hash}`,
      })

      // Reset state and reload data
      setSelectedWellForBurn(null)
      setBurnReason('')
      await loadWellsData()

    } catch (error: any) {
      console.error('Failed to burn well:', error)
      toast({
        title: "Error",
        description: error.reason || "Failed to burn well",
        variant: "destructive"
      })
    } finally {
      setBurning(null)
    }
  }

  const enableChainlinkForWell = async (tokenId: number) => {
    if (!provider || !address) return

    try {
      const signer = await provider.getSigner()
      const router = getWaternityRouter(signer)
      
      // Demo onboarding with Chainlink (using default values)
      const stakeAmount = ethers.parseEther("100")
      const subscriptionId = 123
      const gasLimit = 300000
      const donID = ethers.encodeBytes32String("fun-ethereum-sepolia-1")
      
      const tx = await router.onboardWellWithChainlink(
        tokenId,
        stakeAmount,
        subscriptionId,
        gasLimit,
        donID
      )
      
      await tx.wait()
      
      toast({
        title: "Success", 
        description: `Chainlink integration enabled for well ${tokenId}`,
      })
      
      await loadWellsData()

    } catch (error: any) {
      console.error('Failed to enable Chainlink:', error)
      toast({
        title: "Error",
        description: error.reason || "Failed to enable Chainlink integration",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading wells...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Well Management</h2>
          <p className="text-muted-foreground">
            Mint new wells and manage existing ones with Chainlink integration
          </p>
        </div>
        
                  <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="demo-mode">Demo Mode</Label>
              <Button
                id="demo-mode"
                variant={useDummyData ? "default" : "outline"}
                size="sm"
                onClick={() => setUseDummyData(!useDummyData)}
              >
                {useDummyData ? "ON" : "OFF"}
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {useDummyData ? "Add Demo Well" : "Mint New Well"}
                </Button>
              </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Mint New Water Well NFT</DialogTitle>
              <DialogDescription>
                Create a new water well NFT with automatic Chainlink integration
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="to">Recipient Address</Label>
                  <Input
                    id="to"
                    placeholder={address || "0x..."}
                    value={mintForm.to}
                    onChange={(e) => setMintForm({...mintForm, to: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Rural Uganda"
                    value={mintForm.location}
                    onChange={(e) => setMintForm({...mintForm, location: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Liters/Day) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="5000"
                    value={mintForm.capacity}
                    onChange={(e) => setMintForm({...mintForm, capacity: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="peopleServed">People Served *</Label>
                  <Input
                    id="peopleServed"
                    type="number"
                    placeholder="250"
                    value={mintForm.peopleServed}
                    onChange={(e) => setMintForm({...mintForm, peopleServed: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metadataURI">Metadata URI</Label>
                <Input
                  id="metadataURI"
                  placeholder="Optional: IPFS or HTTP URL"
                  value={mintForm.metadataURI}
                  onChange={(e) => setMintForm({...mintForm, metadataURI: e.target.value})}
                />
              </div>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  This will automatically register the well and enable Chainlink automation, 
                  data feeds, and external verification.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleMintWell} 
                disabled={minting || !address}
                className="w-full"
              >
                {minting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mint Well with Chainlink Integration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wells</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wells.length}</div>
            <p className="text-xs text-muted-foreground">
              Active wells
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Minted</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMinted.toString()}</div>
            <p className="text-xs text-muted-foreground">
              Including burned wells
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wells.reduce((sum, well) => sum + Number(well.peopleServed), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total beneficiaries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Capacity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wells.reduce((sum, well) => sum + Number(well.capacity), 0).toLocaleString()}L
            </div>
            <p className="text-xs text-muted-foreground">
              Total liters per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wells Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wells.map((well) => (
          <Card key={well.tokenId} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Well #{well.tokenId}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={well.isActive ? "default" : "secondary"}>
                    {well.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {well.totalStaked > 0n && (
                    <Badge variant="outline">
                      <Zap className="mr-1 h-3 w-3" />
                      Chainlink
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {well.location}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Capacity:</span>
                  <p className="text-muted-foreground">{well.capacity.toString()}L/day</p>
                </div>
                <div>
                  <span className="font-medium">People Served:</span>
                  <p className="text-muted-foreground">{well.peopleServed.toString()}</p>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-muted-foreground">{formatTimestamp(well.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium">Staked:</span>
                  <p className="text-muted-foreground">{ethers.formatEther(well.totalStaked)} ETH</p>
                </div>
              </div>

              <div className="flex space-x-2">
                {well.totalStaked === 0n && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => enableChainlinkForWell(well.tokenId)}
                    disabled={!address}
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Enable Chainlink
                  </Button>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSelectedWellForBurn(well.tokenId)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Burn
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Burn Well #{well.tokenId}</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. The well NFT will be permanently destroyed.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Warning: Burning a well with active stakes may affect investor returns.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="burnReason">Reason for burning *</Label>
                        <Textarea
                          id="burnReason"
                          placeholder="e.g., Well damaged beyond repair, relocated, etc."
                          value={burnReason}
                          onChange={(e) => setBurnReason(e.target.value)}
                        />
                      </div>
                      
                      <Button
                        variant="destructive"
                        onClick={() => handleBurnWell(well.tokenId)}
                        disabled={burning === well.tokenId || !burnReason.trim()}
                        className="w-full"
                      >
                        {burning === well.tokenId ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Confirm Burn Well
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {wells.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Droplets className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Wells Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by minting your first water well NFT with Chainlink integration.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 