/* SUPPORTED NETWORK TYPES ================================================== */

import {i18n} from '../../../i18n.config';

export const SUPPORTED_CHAIN_ID = [
  1, 5, 137, 8453, 80001, 84531, 42161, 421613, 11155111,
] as const;

export type SupportedChainID = (typeof SUPPORTED_CHAIN_ID)[number];

export function isSupportedChainId(
  chainId: number
): chainId is SupportedChainID {
  return SUPPORTED_CHAIN_ID.some(id => id === chainId);
}

export const ENS_SUPPORTED_NETWORKS: SupportedNetworks[] = [
  'ethereum',
  'goerli',
];
export const NETWORKS_WITH_CUSTOM_REGISTRY: SupportedNetworks[] = [
  'arbitrum',
  'arbitrum-goerli',
  'base',
  'base-goerli',
  'mumbai',
  'polygon',
  'sepolia',
];
export const L2_NETWORKS = NETWORKS_WITH_CUSTOM_REGISTRY;

const SUPPORTED_NETWORKS = [
  'arbitrum',
  'arbitrum-goerli',
  'base',
  'base-goerli',
  'ethereum',
  'goerli',
  'mumbai',
  'polygon',
  'sepolia',
] as const;

export const GOERLI_BASED_NETWORKS: SupportedNetworks[] = [
  'goerli',
  'base-goerli',
  'arbitrum-goerli',
  'mumbai',
];

export type SupportedNetworks =
  | (typeof SUPPORTED_NETWORKS)[number]
  | 'unsupported';

export function toSupportedNetwork(network: string): SupportedNetworks {
  return SUPPORTED_NETWORKS.some(n => n === network)
    ? (network as SupportedNetworks)
    : 'unsupported';
}

export const supportedNetworksToBackendMap = {
  ethereum: 'ethereum',
  goerli: 'goerli',
  sepolia: 'sepolia',
  polygon: 'polygon',
  mumbai: 'mumbai',
  base: 'base',
  'base-goerli': 'baseGoerli',
  arbitrum: 'arbitrum',
  'arbitrum-goerli': 'arbitrumGoerli',
} as Record<SupportedNetworks, string>;

/**
 * Get the network name with given chain id
 * @param chainId Chain id
 * @returns the name of the supported network or null if network is unsupported
 */
export function getSupportedNetworkByChainId(
  chainId: number
): SupportedNetworks | undefined {
  if (isSupportedChainId(chainId)) {
    return Object.entries(CHAIN_METADATA).find(
      entry => entry[1].id === chainId
    )?.[0] as SupportedNetworks;
  }
}

export type NetworkDomain = 'L1 Blockchain' | 'L2 Blockchain';

/* CHAIN DATA =============================================================== */

export type NativeTokenData = {
  name: string;
  symbol: string;
  decimals: number;
};

export type ApiMetadata = {
  networkId: string;
  nativeTokenId: string;
};

export type ChainData = {
  id: SupportedChainID;
  name: string;
  domain: NetworkDomain;
  isTestnet: boolean;
  mainnet?: SupportedNetworks;
  explorer: string;
  explorerName: string;
  logo: string;
  // Public RPC endpoints only used to setup the network on MetaMask
  publicRpc: string;
  gatewayNetwork: string;
  nativeCurrency: NativeTokenData;
  etherscanApi: string;
  etherscanApiKey?: string;
  covalent?: ApiMetadata;
  coingecko?: ApiMetadata;
  alchemyApi: string;
  supportsEns: boolean;
  ipfs?: string;
};

const etherscanApiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
const polygonscanApiKey = import.meta.env.VITE_POLYGONSCAN_API_KEY;

export const CHAIN_METADATA: Record<SupportedNetworks, ChainData> = {
  ethereum: {
    id: 1,
    name: i18n.t('explore.modal.filterDAOs.label.ethereum'),
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    explorer: 'https://etherscan.io/',
    explorerName: 'Etherscan',
    isTestnet: false,
    publicRpc: 'https://ethereum.publicnode.com',
    gatewayNetwork: 'ethereum/mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api.etherscan.io/api',
    etherscanApiKey: etherscanApiKey,
    coingecko: {
      networkId: 'ethereum',
      nativeTokenId: 'ethereum',
    },
    covalent: {
      networkId: 'eth-mainnet',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    alchemyApi: 'https://eth-mainnet.g.alchemy.com/v2',
    supportsEns: true,
    ipfs: 'https://prod.ipfs.aragon.network',
  },
  polygon: {
    id: 137,
    name: i18n.t('explore.modal.filterDAOs.label.polygon'),
    domain: 'L2 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://polygonscan.com/',
    explorerName: 'Polygonscan',
    isTestnet: false,
    publicRpc: 'https://polygon-bor.publicnode.com',
    gatewayNetwork: 'polygon/mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    etherscanApi: 'https://api.polygonscan.com/api',
    etherscanApiKey: polygonscanApiKey,
    coingecko: {
      networkId: 'polygon-pos',
      nativeTokenId: 'matic-network',
    },
    covalent: {
      networkId: 'matic-mainnet',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    alchemyApi: 'https://polygon-mainnet.g.alchemy.com/v2',
    supportsEns: false,
    ipfs: 'https://prod.ipfs.aragon.network',
  },

  arbitrum: {
    id: 42161,
    name: i18n.t('explore.modal.filterDAOs.label.arbitrum'),
    domain: 'L2 Blockchain',
    logo: 'https://bridge.arbitrum.io/logo.png',
    explorer: 'https://arbiscan.io/',
    explorerName: 'Arbiscan',
    isTestnet: false,
    publicRpc: 'https://arb1.arbitrum.io/rpc',
    gatewayNetwork: 'arbitrum/mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api.arbiscan.io/api',
    alchemyApi: 'https://arb-mainnet.g.alchemy.com/v2',
    coingecko: {
      networkId: 'arbitrum-one',
      nativeTokenId: 'ethereum',
    },
    covalent: {
      networkId: 'arbitrum-mainnet',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    supportsEns: false,
    ipfs: 'https://prod.ipfs.aragon.network',
  },
  base: {
    id: 8453,
    name: i18n.t('explore.modal.filterDAOs.label.base'),
    domain: 'L2 Blockchain',
    logo: 'https://mirror-media.imgix.net/publication-images/cgqxxPdUFBDjgKna_dDir.png?h=250&w=250',
    explorer: 'https://basescan.org/',
    explorerName: 'Basescan',
    isTestnet: false,
    publicRpc: 'https://mainnet.base.org',
    gatewayNetwork: 'base/mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api.basescan.org/api',
    etherscanApiKey: '',
    covalent: {
      networkId: 'base-mainnet',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    alchemyApi: '',
    supportsEns: false,
    ipfs: 'https://prod.ipfs.aragon.network',
  },
  sepolia: {
    id: 11155111,
    name: i18n.t('explore.modal.filterDAOs.label.ethereumSepolia'),
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    explorer: 'https://sepolia.etherscan.io/',
    isTestnet: true,
    explorerName: 'Etherscan',
    mainnet: 'ethereum',
    publicRpc: 'https://ethereum-sepolia.publicnode.com',
    gatewayNetwork: 'ethereum/sepolia',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api-sepolia.etherscan.io/api',
    etherscanApiKey: etherscanApiKey,
    covalent: {
      networkId: 'eth-sepolia',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    alchemyApi: 'https://eth-sepolia.g.alchemy.com/v2',
    supportsEns: false,
    ipfs: 'https://test.ipfs.aragon.network',
  },
  mumbai: {
    id: 80001,
    name: i18n.t('explore.modal.filterDAOs.label.polygonMumbai'),
    domain: 'L2 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://mumbai.polygonscan.com/',
    explorerName: 'Polygonscan',
    isTestnet: true,
    mainnet: 'polygon',
    publicRpc: 'https://polygon-mumbai-bor.publicnode.com',
    gatewayNetwork: 'polygon/mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    etherscanApi: 'https://api-testnet.polygonscan.com/api',
    etherscanApiKey: polygonscanApiKey,
    covalent: {
      networkId: 'matic-mumbai',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    alchemyApi: 'https://polygon-mumbai.g.alchemy.com/v2',
    supportsEns: false,
    ipfs: 'https://test.ipfs.aragon.network',
  },
  'arbitrum-goerli': {
    id: 421613,
    name: i18n.t('explore.modal.filterDAOs.label.arbitrumGoerli'),
    domain: 'L2 Blockchain',
    logo: 'https://bridge.arbitrum.io/logo.png',
    explorer: 'https://testnet.arbiscan.io/',
    explorerName: 'Arbiscan',
    isTestnet: true,
    mainnet: 'arbitrum',
    publicRpc: 'https://goerli-rollup.arbitrum.io/rpc',
    gatewayNetwork: 'arbitrum/goerli',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api-goerli.arbiscan.io/api',
    alchemyApi: 'https://arb-goerli.g.alchemy.com/v2',
    covalent: {
      networkId: 'arbitrum-goerli',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    supportsEns: false,
    ipfs: 'https://test.ipfs.aragon.network',
  },
  'base-goerli': {
    id: 84531,
    name: i18n.t('explore.modal.filterDAOs.label.baseGoerli'),
    domain: 'L2 Blockchain',
    logo: 'https://mirror-media.imgix.net/publication-images/cgqxxPdUFBDjgKna_dDir.png?h=250&w=250',
    explorer: 'https://goerli.basescan.org/',
    explorerName: 'Basescan',
    isTestnet: true,
    mainnet: 'base',
    publicRpc: 'https://goerli.base.org',
    gatewayNetwork: 'base/goerli',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api.basescan.org/api',
    etherscanApiKey: '',
    covalent: {
      networkId: 'base-testnet',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    alchemyApi: '',
    supportsEns: false,
    ipfs: 'https://prod.ipfs.aragon.network',
  },

  goerli: {
    id: 5,
    name: 'Goerli',
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    explorer: 'https://goerli.etherscan.io/',
    explorerName: 'Etherscan',
    isTestnet: true,
    mainnet: 'ethereum',
    publicRpc: 'https://ethereum-goerli.publicnode.com',
    gatewayNetwork: 'ethereum/goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api-goerli.etherscan.io/api',
    etherscanApiKey: etherscanApiKey,
    covalent: {
      networkId: 'eth-goerli',
      nativeTokenId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    alchemyApi: 'https://eth-goerli.g.alchemy.com/v2',
    supportsEns: true,
    ipfs: 'https://test.ipfs.aragon.network',
  },
  unsupported: {
    id: 1,
    name: 'Unsupported',
    domain: 'L1 Blockchain',
    logo: '',
    explorer: '',
    explorerName: '',
    isTestnet: false,
    publicRpc: '',
    gatewayNetwork: '',
    nativeCurrency: {
      name: '',
      symbol: '',
      decimals: 18,
    },
    etherscanApi: '',
    alchemyApi: '',
    supportsEns: false,
    ipfs: '',
  },
};

export const chainExplorerAddressLink = (
  network: SupportedNetworks,
  address: string
) => {
  return `${CHAIN_METADATA[network].explorer}address/${address}`;
};
