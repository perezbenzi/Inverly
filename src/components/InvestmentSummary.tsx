import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment } from "@/types/investment";

interface InvestmentSummaryProps {
  investments: Investment[];
  currentEthPrice: number;
}

const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({
  investments,
  currentEthPrice,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const totalInvested = investments.reduce((total, investment) => total + investment.amount, 0);
  
  const totalEth = investments.reduce((total, investment) => total + investment.ethAmount, 0);
  
  const currentValue = totalEth * currentEthPrice;
  
  const totalProfit = currentValue - totalInvested;
  
  const profitPercentage = totalInvested > 0 
    ? (totalProfit / totalInvested) * 100 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Invested
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total ETH
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEth.toFixed(5)} ETH</div>
          <p className="text-xs text-muted-foreground mt-1">
            Current price: {formatCurrency(currentEthPrice)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Profit/Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-crypto-positive" : "text-crypto-negative"}`}>
            {formatCurrency(totalProfit)}
          </div>
          <p className={`text-sm ${totalProfit >= 0 ? "text-crypto-positive" : "text-crypto-negative"}`}>
            {profitPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentSummary;
