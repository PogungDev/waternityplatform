import { createConfig, http } from 'wagmi'
import { localhost, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Custom localhost chain dengan port kita
const customLocalhost = {
  ...localhost,
  id: 31337,
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
}

export const config = createConfig({
  chains: [customLocalhost, sepolia],
  connectors: [
    injected(),
    // walletConnect({ projectId: 'YOUR_PROJECT_ID' }), // Uncomment jika punya WalletConnect project ID
  ],
  transports: {
    [customLocalhost.id]: http(),
    [sepolia.id]: http(),
  },
})

// Re-export chain untuk kemudahan
export { customLocalhost as localhost }
