import { VenomConnect } from "venom-connect";
import { ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient } from "everscale-standalone-client";

const initTheme = "light" as const;

const standaloneFallback = () =>
  EverscaleStandaloneClient.create({
    connection: {
      id: 1000,
      group: "venom_testnet",
      type: "jrpc",
      data: {
        endpoint: "https://jrpc.venom.foundation/rpc",
      },
    },
  });

export const initVenomConnect = async () => {
  return new VenomConnect({
    theme: initTheme,
    checkNetworkId: 1000,
    providersOptions: {
      venomwallet: {
        walletWaysToConnect: [
          {
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("venomwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },
            id: "extension",
            type: "extension",
          },
        ],
        defaultWalletWaysToConnect: ["mobile", "ios", "android"],
      },
      oneartwallet: {
        walletWaysToConnect: [
          {
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("oneartwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },
            id: "extension",
            type: "extension",
          },
        ],
        defaultWalletWaysToConnect: ["mobile", "ios", "android"],
      },
      oxychatwallet: {
        walletWaysToConnect: [
          {
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("oxychatwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },
            id: "extension",
            type: "extension",
          },
        ],
        defaultWalletWaysToConnect: ["mobile", "ios", "android"],
      },
    },
  });
};

// Check if Venom Wallet extension is available
export const isVenomWalletAvailable = () => {
  if (typeof window === 'undefined') return false;
  return window.__venom !== undefined;
};

// Add a more robust detection with retry logic
export const waitForVenomExtension = (timeout = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isVenomWalletAvailable()) {
      resolve(true);
      return;
    }
    
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isVenomWalletAvailable()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100); // Check every 100ms
  });
};