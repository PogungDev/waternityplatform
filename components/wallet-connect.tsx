"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DummyWalletProps {
  isConnected: boolean
  address: string | undefined
  onConnect: () => void
  onDisconnect: () => void
}

// Ini adalah komponen dummy wallet yang akan mengelola state koneksi sendiri
export function WalletConnect({ isConnected, address, onConnect, onDisconnect }: DummyWalletProps) {
  if (isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dummy Wallet Connected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <Button onClick={onDisconnect} variant="outline" className="w-full">
            Disconnect Dummy Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connect Dummy Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={onConnect} className="w-full">
          Connect Dummy Wallet
        </Button>
      </CardContent>
    </Card>
  )
}
