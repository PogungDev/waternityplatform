'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  Zap, 
  Bell, 
  Shield, 
  Save, 
  RefreshCw, 
  CheckCircle,
  Info,
  TrendingUp,
  Droplets
} from 'lucide-react'

interface ChainlinkSettings {
  automationEnabled: boolean
  dataFeedsEnabled: boolean
  functionsEnabled: boolean
  automationInterval: string
  priceUpdateThreshold: number
  subscriptionId: string
  donId: string
}

interface NotificationSettings {
  enabled: boolean
  email: string
  stakingRewards: boolean
  wellUpdates: boolean
  priceAlerts: boolean
  automationEvents: boolean
  securityAlerts: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  autoLockTime: number
  maxStakePerTx: number
  requireConfirmation: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [chainlinkSettings, setChainlinkSettings] = useState<ChainlinkSettings>({
    automationEnabled: true,
    dataFeedsEnabled: true,
    functionsEnabled: true,
    automationInterval: "3600",
    priceUpdateThreshold: 2,
    subscriptionId: "123",
    donId: "fun-ethereum-sepolia-1"
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    email: "user@example.com",
    stakingRewards: true,
    wellUpdates: true,
    priceAlerts: true,
    automationEvents: false,
    securityAlerts: true
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    autoLockTime: 30,
    maxStakePerTx: 10,
    requireConfirmation: true
  })

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setLastSaved(new Date())
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    setChainlinkSettings({
      automationEnabled: true,
      dataFeedsEnabled: true,
      functionsEnabled: true,
      automationInterval: "3600",
      priceUpdateThreshold: 2,
      subscriptionId: "123",
      donId: "fun-ethereum-sepolia-1"
    })

    setNotificationSettings({
      enabled: true,
      email: "user@example.com",
      stakingRewards: true,
      wellUpdates: true,
      priceAlerts: true,
      automationEvents: false,
      securityAlerts: true
    })

    setSecuritySettings({
      twoFactorEnabled: false,
      autoLockTime: 30,
      maxStakePerTx: 10,
      requireConfirmation: true
    })

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your Waternity platform preferences and integrations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chainlink" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chainlink" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Chainlink
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chainlink" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Chainlink Integration
              </CardTitle>
              <CardDescription>
                Configure Chainlink services for automation, data feeds, and external verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">Chainlink Automation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically execute upkeep functions for your wells
                    </p>
                  </div>
                  <Switch
                    checked={chainlinkSettings.automationEnabled}
                    onCheckedChange={(checked) =>
                      setChainlinkSettings(prev => ({ ...prev, automationEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">Data Feeds</Label>
                    <p className="text-sm text-muted-foreground">
                      Get real-time price data for dynamic yield calculations
                    </p>
                  </div>
                  <Switch
                    checked={chainlinkSettings.dataFeedsEnabled}
                    onCheckedChange={(checked) =>
                      setChainlinkSettings(prev => ({ ...prev, dataFeedsEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">Chainlink Functions</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable external API calls for well verification
                    </p>
                  </div>
                  <Switch
                    checked={chainlinkSettings.functionsEnabled}
                    onCheckedChange={(checked) =>
                      setChainlinkSettings(prev => ({ ...prev, functionsEnabled: checked }))
                    }
                  />
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="automationInterval">Automation Interval</Label>
                  <Select 
                    value={chainlinkSettings.automationInterval}
                    onValueChange={(value) =>
                      setChainlinkSettings(prev => ({ ...prev, automationInterval: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3600">1 Hour</SelectItem>
                      <SelectItem value="21600">6 Hours</SelectItem>
                      <SelectItem value="43200">12 Hours</SelectItem>
                      <SelectItem value="86400">24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceThreshold">Price Update Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={chainlinkSettings.priceUpdateThreshold}
                      onChange={(e) =>
                        setChainlinkSettings(prev => ({ ...prev, priceUpdateThreshold: parseFloat(e.target.value) }))
                      }
                      min="1"
                      max="10"
                      step="0.5"
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trigger yield updates when price changes by this percentage
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subscriptionId">Subscription ID</Label>
                    <Input
                      id="subscriptionId"
                      value={chainlinkSettings.subscriptionId}
                      onChange={(e) =>
                        setChainlinkSettings(prev => ({ ...prev, subscriptionId: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donId">DON ID</Label>
                    <Input
                      id="donId"
                      value={chainlinkSettings.donId}
                      onChange={(e) =>
                        setChainlinkSettings(prev => ({ ...prev, donId: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Chainlink services require active subscriptions and sufficient LINK tokens. 
                  Make sure your subscription is funded before enabling these features.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what updates you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email and in-app notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.enabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              {notificationSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={notificationSettings.email}
                      onChange={(e) =>
                        setNotificationSettings(prev => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>

                  <hr className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Types</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <div>
                            <Label className="font-medium">Staking Rewards</Label>
                            <p className="text-sm text-muted-foreground">Daily reward summaries</p>
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.stakingRewards}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, stakingRewards: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <div>
                            <Label className="font-medium">Well Updates</Label>
                            <p className="text-sm text-muted-foreground">New wells and status changes</p>
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.wellUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, wellUpdates: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <div>
                            <Label className="font-medium">Price Alerts</Label>
                            <p className="text-sm text-muted-foreground">Significant price movements</p>
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.priceAlerts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, priceAlerts: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-500" />
                          <div>
                            <Label className="font-medium">Automation Events</Label>
                            <p className="text-sm text-muted-foreground">Chainlink upkeep executions</p>
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.automationEvents}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, automationEvents: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-red-500" />
                          <div>
                            <Label className="font-medium">Security Alerts</Label>
                            <p className="text-sm text-muted-foreground">Suspicious activity warnings</p>
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.securityAlerts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, securityAlerts: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Protect your account and assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Require Transaction Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Show confirmation dialog before executing transactions
                  </p>
                </div>
                <Switch
                  checked={securitySettings.requireConfirmation}
                  onCheckedChange={(checked) =>
                    setSecuritySettings(prev => ({ ...prev, requireConfirmation: checked }))
                  }
                />
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="autoLock">Auto-lock Time (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.autoLockTime}
                    onChange={(e) =>
                      setSecuritySettings(prev => ({ ...prev, autoLockTime: parseInt(e.target.value) }))
                    }
                    min="5"
                    max="120"
                    step="5"
                  />
                  <p className="text-sm text-muted-foreground">
                    Automatically lock the application after inactivity
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStake">Max Stake per Transaction (ETH)</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxStakePerTx}
                    onChange={(e) =>
                      setSecuritySettings(prev => ({ ...prev, maxStakePerTx: parseInt(e.target.value) }))
                    }
                    min="1"
                    max="100"
                    step="1"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum amount that can be staked in a single transaction
                  </p>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  These security settings help protect your assets. We recommend enabling 2FA 
                  and keeping transaction limits reasonable for your use case.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                General Settings
              </CardTitle>
              <CardDescription>
                Platform preferences and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="jakarta">Asia/Jakarta</SelectItem>
                      <SelectItem value="singapore">Asia/Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Display Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eth">ETH (Ξ)</SelectItem>
                    <SelectItem value="idr">IDR (Rp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium">Data & Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Analytics & Usage Data</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Marketing Communications</Label>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Changes to general settings take effect immediately and are saved automatically.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 