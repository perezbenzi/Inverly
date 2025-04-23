import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEthPrice } from "@/services/cryptoApi";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CurrentEthPrice: React.FC = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = async () => {
    setIsLoading(true);
    try {
      const ethPrice = await getEthPrice();
      setPrice(ethPrice);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching current ETH price:", error);
      toast.error("Could not get current ETH price");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
          <span>Current ETH Price</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchPrice}
            disabled={isLoading}
            className="h-6 w-6"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {price ? (
          <>
            <div className="text-2xl font-bold">{formatCurrency(price)}</div>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Updated: {formatTime(lastUpdated)}
              </p>
            )}
          </>
        ) : (
          <div className="text-2xl font-bold animate-pulse">Loading...</div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentEthPrice;
