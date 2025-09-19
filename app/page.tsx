/*eslint-disable*/
'use client';
import { ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient } from "everscale-standalone-client";
import { useEffect, useState } from "react";
import { VenomConnect } from "venom-connect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Zap, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const initTheme = "light";

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

const initVenomConnect = async () => {
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
        defaultWalletWaysToConnect: [
          "mobile",
          "ios",
          "android",
        ],
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
        defaultWalletWaysToConnect: [
          "mobile",
          "ios",
          "android",
        ],
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
        defaultWalletWaysToConnect: [
          "mobile",
          "ios",
          "android",
        ],
      },
    },
  });
};

const themesList = ["light", "dark", "venom"];

export default function App() {
  const [venomConnect, setVenomConnect] = useState<any>();
  const [venomProvider, setVenomProvider] = useState<any>();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [theme, setTheme] = useState<string>(initTheme);
  const [isConnecting, setIsConnecting] = useState(false);

  const getTheme = () =>
    venomConnect?.getInfo()?.themeConfig?.name?.toString?.() || "light";

  const onToggleThemeButtonClick = async () => {
    const currentTheme = getTheme();
    const nextTheme = currentTheme === "light" ? "dark" : currentTheme === "dark" ? "venom" : "light";
    await venomConnect?.updateTheme(nextTheme);
    setTheme(getTheme());
  };

  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();
    const address = providerState?.permissions.accountInteraction?.address.toString();
    return address;
  };

  const getBalance = async (provider: any, _address: string) => {
    try {
      const providerBalance = await provider?.getBalance?.(_address);
      return providerBalance;
    } catch (error) {
      return undefined;
    }
  };

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
  };

  const onInitButtonClick = async () => {
    setIsConnecting(true);
    try {
      const initedVenomConnect = await initVenomConnect();
      setVenomConnect(initedVenomConnect);
      await checkAuth(initedVenomConnect);
    } catch (error) {
      console.error('Failed to initialize VenomConnect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const onConnectButtonClick = async () => {
    setIsConnecting(true);
    try {
      venomConnect?.connect();
    } finally {
      setIsConnecting(false);
    }
  };

  const onDisconnectButtonClick = async () => {
    venomProvider?.disconnect();
  };

  const check = async (_provider: any) => {
    const _address = _provider ? await getAddress(_provider) : undefined;
    const _balance = _provider && _address ? await getBalance(_provider, _address) : undefined;

    setAddress(_address);
    setBalance(_balance);

    if (_provider && _address) {
      setTimeout(() => {
        check(_provider);
      }, 7000);
    }
  };

  const onConnect = async (provider: any) => {
    setVenomProvider(provider);
    check(provider);
  };

  useEffect(() => {
    const off = venomConnect?.on("connect", onConnect);
    return () => {
      off?.();
    };
  }, [venomConnect]);



  return (
    <div className="min-h-screen bg-black p-4">
      {/* Anime-style background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h1 className="text-6xl font-bold text-white mb-4">
              VENOM
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gray-400 rounded-full" />
          </div>
          <p className="text-xl text-white font-medium tracking-wide">
            WALLET CONNECTION
          </p>
          <div className="mt-4 flex justify-center">
            <Badge variant="outline" className="text-xs font-mono text-white border-white">
              ANIME EDITION v2.0
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Connection Card */}
          <Card className="col-span-full md:col-span-2 lg:col-span-2 border-2 border-white bg-black shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                {!venomConnect ? "Initialize Connection" : address ? "Connected" : "Ready to Connect"}
              </CardTitle>
              <CardDescription className="text-base text-white">
                {!venomConnect 
                  ? "Start your journey into the Venom ecosystem" 
                  : address 
                  ? "Your wallet is successfully connected" 
                  : "Choose your preferred connection method"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!venomConnect ? (
                <div className="text-center">
                  <Button 
                    onClick={onInitButtonClick} 
                    disabled={isConnecting}
                    size="lg" 
                    className="w-full max-w-sm bg-white hover:bg-gray-200 text-black font-bold py-6 text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isConnecting ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        INITIALIZING...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        INITIALIZE VENOM
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!address ? (
                    <Button 
                      onClick={onConnectButtonClick} 
                      disabled={isConnecting}
                      size="lg" 
                      className="w-full bg-white hover:bg-gray-200 text-black font-bold py-6 text-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isConnecting ? (
                        <>
                          <Zap className="w-5 h-5 mr-2 animate-spin" />
                          CONNECTING...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5 mr-2" />
                          CONNECT WALLET
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={onDisconnectButtonClick} 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-2 border-white text-white hover:bg-gray-800 font-bold py-6 text-lg transition-all duration-300"
                    >
                      DISCONNECT
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Theme & Status Card */}
          <Card className="border-2 border-white bg-black shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Theme Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="text-lg px-4 py-2 font-mono text-white bg-gray-800">
                  {theme.toUpperCase()}
                </Badge>
              </div>
              {venomConnect && (
                <Button 
                  onClick={onToggleThemeButtonClick} 
                  variant="outline" 
                  className="w-full border-2 border-white text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  SWITCH THEME
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Wallet Info */}
        {address && (
          <Card className="mt-8 border-2 border-white bg-black shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Wallet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white uppercase tracking-wide">
                    Address
                  </label>
                  <div className="p-3 bg-black rounded-lg border-2 border-white">
                    <code className="text-sm font-mono break-all text-white">{address}</code>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white uppercase tracking-wide">
                    Balance
                  </label>
                  <div className="p-3 bg-black rounded-lg border-2 border-white">
                    <code className="text-sm font-mono text-white">
                      {balance ? `${(balance / 10 ** 9).toFixed(4)} VENOM` : "Loading..."}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white font-mono">
            POWERED BY VENOM NETWORK • DESIGNED WITH ❤️
          </p>
        </div>
      </div>
    </div>
  );
}