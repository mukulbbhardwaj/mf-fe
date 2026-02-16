import React, { useState, useEffect, useRef } from "react";
import { subscribeToSymbol } from "../../api/binance";
import { Link } from "react-router-dom";
import BuyButton from "./BuyButton";
import InputComponent from "../miscComponents/InputComponent";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/utils";
import { Loader2, Search, Star } from "lucide-react";
import apiClient from "@/lib/api";
import { toast } from "react-toastify";

interface BinanceTradeUpdate {
  s: string;
  p: number;
}

interface SymbolSuggestion {
  symbol: string;
}

const SymbolSearch = () => {
  const [latestTrade, setLatestTrade] = useState<BinanceTradeUpdate | null>(
    null
  );
  const [searchSymbol, setSearchSymbol] = useState<string>("");
  const [currentWebSocket, setCurrentWebSocket] = useState<WebSocket | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SymbolSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);
  const [isCheckingWatchlist, setIsCheckingWatchlist] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchSymbol.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await apiClient.get(
            `/api/market/search?q=${encodeURIComponent(searchSymbol.toUpperCase())}`
          );
          if (response.data.success && response.data.data) {
            const data = Array.isArray(response.data.data) 
              ? response.data.data 
              : [];
            
            // Handle both formats: array of strings or array of objects
            const validSuggestions: SymbolSuggestion[] = data
              .map((item: any) => {
                // If item is a string, use it as symbol
                if (typeof item === 'string') {
                  return {
                    symbol: item
                  };
                }
                // If item is an object with symbol property
                if (item && typeof item === 'object' && item.symbol) {
                  return {
                    symbol: item.symbol
                  };
                }
                return null;
              })
              .filter((item: SymbolSuggestion | null): item is SymbolSuggestion => item !== null);
            
            setSuggestions(validSuggestions);
            setShowSuggestions(validSuggestions.length > 0);
          } else {
            setSuggestions([]);
          }
        } catch (err: any) {
          console.error("Error fetching suggestions:", err);
          console.error("Error response:", err.response?.data);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchSymbol]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSymbol(event.target.value);
    setError(null);
    setLatestTrade(null);
  };

  const handleSuggestionClick = (symbol: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSearchSymbol(symbol);
    setShowSuggestions(false);
    // Automatically search for the selected symbol
    handleSymbolSearch(symbol);
  };

  // Check if symbol is in watchlist
  const checkWatchlist = async (symbolName: string) => {
    try {
      setIsCheckingWatchlist(true);
      const response = await apiClient.get(`/api/watchlist/${symbolName}`);
      if (response.data.success && response.data.data) {
        setIsInWatchlist(response.data.data.isInWatchlist || false);
      }
    } catch (error) {
      setIsInWatchlist(false);
    } finally {
      setIsCheckingWatchlist(false);
    }
  };

  // Add to watchlist
  const handleAddToWatchlist = async (symbolName: string) => {
    if (!symbolName) {
      toast.error("Invalid symbol name");
      return;
    }

    try {
      const response = await apiClient.post("/api/watchlist", {
        symbolName: symbolName.toUpperCase(),
      });

      if (response.data.success) {
        toast.success(`${symbolName} added to watchlist`);
        setIsInWatchlist(true);
      } else {
        toast.error(response.data.message || "Failed to add to watchlist");
      }
    } catch (error: any) {
      console.error("Error adding to watchlist:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Failed to add to watchlist";
      toast.error(errorMessage);
    }
  };

  // Remove from watchlist
  const handleRemoveFromWatchlist = async (symbolName: string) => {
    try {
      const response = await apiClient.delete("/api/watchlist", {
        data: { symbolName },
      });

      if (response.data.success) {
        toast.success(`${symbolName} removed from watchlist`);
        setIsInWatchlist(false);
      } else {
        toast.error(response.data.message || "Failed to remove from watchlist");
      }
    } catch (error: any) {
      console.error("Error removing from watchlist:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to remove from watchlist";
      toast.error(errorMessage);
    }
  };

  // Check watchlist when symbol is found
  useEffect(() => {
    if (latestTrade?.s) {
      checkWatchlist(latestTrade.s);
    }
  }, [latestTrade?.s]);

  const handleSymbolSearch = (symbol?: string) => {
    const symbolToSearch = symbol || searchSymbol.trim();
    
    if (!symbolToSearch) {
      setError("Please enter a symbol");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setLatestTrade(null);
    setShowSuggestions(false);
    
    // Close existing WebSocket if any
    if (currentWebSocket) {
      currentWebSocket.close();
    }
    
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      const ws = subscribeToSymbol(
        symbolToSearch.toUpperCase(),
        (data: BinanceTradeUpdate) => {
          setLatestTrade(data);
          setIsLoading(false);
          setError(null);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      );

      // Handle WebSocket errors
      ws.onerror = () => {
        setIsLoading(false);
        setError("Failed to connect. Please check the symbol and try again.");
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };

      // Handle WebSocket close (connection failed)
      ws.onclose = (event) => {
        if (event.code !== 1000) {
          // Only show error if it wasn't a normal close
          setIsLoading(false);
          if (!latestTrade) {
            setError("Symbol not found or connection failed. Please try again.");
          }
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };

      setCurrentWebSocket(ws);

      // Timeout after 10 seconds if no data received
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError("Connection timeout. Please check the symbol and try again.");
        ws.close();
      }, 10000);
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (currentWebSocket) {
        currentWebSocket.close();
      }
    };
  }, [currentWebSocket]);

  return (
    <div className="w-full bg-card mt-2 border border-border rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="relative" ref={suggestionsRef}>
            <InputComponent
              inputLabel="Symbol"
              inputType="text"
              onChange={handleSearchChange}
              placeholder="Type to search (e.g., BTC, ETH)"
              value={searchSymbol}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.symbol}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionClick(suggestion.symbol, e);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-center justify-between border-b border-border last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold">{suggestion.symbol}</p>
                    </div>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
            {isSearching && (
              <div className="absolute right-4 top-12">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <Button 
            onClick={() => handleSymbolSearch()} 
            className="w-full"
            disabled={!searchSymbol.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Search"
            )}
          </Button>
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </div>

      {isLoading && !latestTrade && (
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-muted-foreground">Connecting to market data...</p>
          </div>
        </div>
      )}

      {latestTrade && (
        <div className="border-t border-border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Symbol</p>
                <p className="text-lg font-semibold">{latestTrade.s}</p>
              </div>
              {latestTrade.p !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-xl font-bold">₹{formatPrice(latestTrade.p)}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <BuyButton
                symbolName={latestTrade.s}
                symbolPrice={latestTrade.p}
                btnTitle="Buy"
              />
              <Button
                type="button"
                variant={isInWatchlist ? "default" : "outline"}
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isInWatchlist) {
                    handleRemoveFromWatchlist(latestTrade.s);
                  } else {
                    handleAddToWatchlist(latestTrade.s);
                  }
                }}
                disabled={isCheckingWatchlist}
              >
                <Star
                  className={`mr-2 h-4 w-4 ${
                    isInWatchlist ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
                {isCheckingWatchlist
                  ? "Checking..."
                  : isInWatchlist
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
              </Button>
              <Link
                to={`https://www.tradingview.com/chart/0VfM6SX8/?symbol=BINANCE%3A${searchSymbol.toUpperCase()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  View Chart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolSearch;
