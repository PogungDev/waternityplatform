'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, Users, Droplets, MapPin, Zap, Edit, Save, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface WellData {
  id: number
  location: string
  capacity: number
  peopleServed: number
  isActive: boolean
  fieldPartner: string
  totalStaked: number
  impactScore: number
}

// Initial dummy data
const initialWells: WellData[] = [
  {
    id: 1,
    location: "Jakarta, Indonesia",
    capacity: 5000,
    peopleServed: 1200,
    isActive: true,
    fieldPartner: "Water for Life Foundation",
    totalStaked: 150,
    impactScore: 85
  },
  {
    id: 2,
    location: "Bandung, Indonesia", 
    capacity: 3000,
    peopleServed: 800,
    isActive: true,
    fieldPartner: "Clean Water Initiative",
    totalStaked: 100,
    impactScore: 72
  },
  {
    id: 3,
    location: "Surabaya, Indonesia",
    capacity: 7000,
    peopleServed: 2100,
    isActive: true,
    fieldPartner: "Indonesian Water Alliance",
    totalStaked: 200,
    impactScore: 92
  },
  {
    id: 4,
    location: "Yogyakarta, Indonesia",
    capacity: 4000,
    peopleServed: 950,
    isActive: false,
    fieldPartner: "Rural Water Solutions",
    totalStaked: 75,
    impactScore: 68
  }
]

export function WellsDemo() {
  const { toast } = useToast()
  const [wells, setWells] = useState<WellData[]>(initialWells)
  const [editingWell, setEditingWell] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<WellData>>({})
  const [newWellForm, setNewWellForm] = useState({
    location: '',
    capacity: '',
    peopleServed: '',
    fieldPartner: ''
  })

  const handleEditWell = (well: WellData) => {
    setEditingWell(well.id)
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
        well.id === editingWell 
          ? { ...well, ...editForm }
          : well
      )
    )
    
    setEditingWell(null)
    setEditForm({})
    
    toast({
      title: "Success",
      description: "Well data updated successfully!",
    })
  }

  const handleCancelEdit = () => {
    setEditingWell(null)
    setEditForm({})
  }

  const handleAddWell = () => {
    if (!newWellForm.location || !newWellForm.capacity || !newWellForm.peopleServed) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const newWell: WellData = {
      id: Math.max(...wells.map(w => w.id), 0) + 1,
      location: newWellForm.location,
      capacity: parseInt(newWellForm.capacity),
      peopleServed: parseInt(newWellForm.peopleServed),
      fieldPartner: newWellForm.fieldPartner || "Demo Partner",
      isActive: true,
      totalStaked: 50,
      impactScore: 75
    }

    setWells(prev => [...prev, newWell])
    
    setNewWellForm({
      location: '',
      capacity: '',
      peopleServed: '',
      fieldPartner: ''
    })

    toast({
      title: "Success",
      description: "New well added successfully!",
    })
  }

  const handleDeleteWell = (id: number) => {
    setWells(prev => prev.filter(well => well.id !== id))
    
    toast({
      title: "Success",
      description: "Well deleted successfully!",
    })
  }

  const toggleWellStatus = (id: number) => {
    setWells(prev => 
      prev.map(well => 
        well.id === id 
          ? { ...well, isActive: !well.isActive }
          : well
      )
    )
    
    toast({
      title: "Success",
      description: "Well status updated!",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Well Management</h2>
          <p className="text-muted-foreground">
            Manage water well NFTs with Chainlink integration
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Well
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Well</DialogTitle>
              <DialogDescription>
                Add a new water well for demo purposes
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Medan, Indonesia"
                  value={newWellForm.location}
                  onChange={(e) => setNewWellForm({...newWellForm, location: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Liters/Day) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="5000"
                    value={newWellForm.capacity}
                    onChange={(e) => setNewWellForm({...newWellForm, capacity: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="peopleServed">People Served *</Label>
                  <Input
                    id="peopleServed"
                    type="number"
                    placeholder="250"
                    value={newWellForm.peopleServed}
                    onChange={(e) => setNewWellForm({...newWellForm, peopleServed: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldPartner">Field Partner</Label>
                <Input
                  id="fieldPartner"
                  placeholder="Partner organization"
                  value={newWellForm.fieldPartner}
                  onChange={(e) => setNewWellForm({...newWellForm, fieldPartner: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handleAddWell} 
                className="w-full"
              >
                Add Well
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
            <div className="text-2xl font-bold">{wells.filter(w => w.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              Active wells
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
              {wells.reduce((sum, well) => sum + well.peopleServed, 0).toLocaleString()}
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
              {wells.reduce((sum, well) => sum + well.capacity, 0).toLocaleString()}L
            </div>
            <p className="text-xs text-muted-foreground">
              Total liters per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wells.reduce((sum, well) => sum + well.totalStaked, 0)} ETH
            </div>
            <p className="text-xs text-muted-foreground">
              Chainlink integration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wells Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wells.map((well) => (
          <Card key={well.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Well #{well.id}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={well.isActive ? "default" : "secondary"}>
                    {well.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    <Zap className="mr-1 h-3 w-3" />
                    Chainlink
                  </Badge>
                </div>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {editingWell === well.id ? (
                  <Input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="h-6 text-sm"
                  />
                ) : (
                  well.location
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Capacity:</span>
                  {editingWell === well.id ? (
                    <Input
                      type="number"
                      value={editForm.capacity || ''}
                      onChange={(e) => setEditForm({...editForm, capacity: parseInt(e.target.value)})}
                      className="h-6 text-sm mt-1"
                    />
                  ) : (
                    <p className="text-muted-foreground">{well.capacity.toLocaleString()}L/day</p>
                  )}
                </div>
                <div>
                  <span className="font-medium">People Served:</span>
                  {editingWell === well.id ? (
                    <Input
                      type="number"
                      value={editForm.peopleServed || ''}
                      onChange={(e) => setEditForm({...editForm, peopleServed: parseInt(e.target.value)})}
                      className="h-6 text-sm mt-1"
                    />
                  ) : (
                    <p className="text-muted-foreground">{well.peopleServed.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <span className="font-medium">Partner:</span>
                  {editingWell === well.id ? (
                    <Input
                      value={editForm.fieldPartner || ''}
                      onChange={(e) => setEditForm({...editForm, fieldPartner: e.target.value})}
                      className="h-6 text-sm mt-1"
                    />
                  ) : (
                    <p className="text-muted-foreground">{well.fieldPartner}</p>
                  )}
                </div>
                <div>
                  <span className="font-medium">Staked:</span>
                  {editingWell === well.id ? (
                    <Input
                      type="number"
                      value={editForm.totalStaked || ''}
                      onChange={(e) => setEditForm({...editForm, totalStaked: parseInt(e.target.value)})}
                      className="h-6 text-sm mt-1"
                    />
                  ) : (
                    <p className="text-muted-foreground">{well.totalStaked} ETH</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {editingWell === well.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveEdit}
                    >
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWell(well)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWellStatus(well.id)}
                    >
                      {well.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteWell(well.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </>
                )}
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
              Add your first water well to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 