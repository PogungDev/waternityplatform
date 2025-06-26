'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Wallet, LogOut } from 'lucide-react'

interface WalletContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  address: string | null
  chainId: number | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const { toast } = useToast()

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "Error",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive"
      })
      return
    }

    setConnecting(true)
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Create provider and signer
      const newProvider = new ethers.BrowserProvider(window.ethereum)
      const newSigner = await newProvider.getSigner()
      const newAddress = await newSigner.getAddress()
      const network = await newProvider.getNetwork()

      setProvider(newProvider)
      setSigner(newSigner)
      setAddress(newAddress)
      setChainId(Number(network.chainId))
      setConnected(true)

      toast({
        title: "Connected",
        description: `Connected to ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`,
      })

    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      })
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    setChainId(null)
    setConnected(false)
    
    toast({
      title: "Disconnected",
      description: "Wallet disconnected",
    })
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== address) {
          // Reconnect with new account
          connect()
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16))
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [address])

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            await connect()
          }
        } catch (error) {
          console.error('Auto-connect failed:', error)
        }
      }
    }

    autoConnect()
  }, [])

  const value: WalletContextType = {
    provider,
    signer,
    address,
    chainId,
    connected,
    connecting,
    connect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      <div className="relative">
        {children}
        <WalletButton />
      </div>
    </WalletContext.Provider>
  )
}

function WalletButton() {
  const { connected, connecting, address, connect, disconnect } = useWallet()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {connected ? (
        <div className="flex items-center space-x-2">
          <div className="bg-background border rounded-lg px-3 py-2 text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={connect}
          disabled={connecting}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  )
}

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any
  }
} 