import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Investment } from "@/types/investment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScenarioCalculatorProps {
  investments: Investment[];
  currentEthPrice: number;
}

const ScenarioCalculator: React.FC<ScenarioCalculatorProps> = ({
  investments,
  currentEthPrice,
}) => {
  const [scenarioPrice, setScenarioPrice] = useState("");
  const [scenarioInvestments, setScenarioInvestments] = useState<Investment[]>(
    []
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const formatEth = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    }).format(Math.abs(num));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US");
  };

  const getTypeLabel = (type: "deposit" | "withdrawal") => {
    return type === "deposit" ? "Depósito" : "Retiro";
  };

  useEffect(() => {
    const priceToUse = parseFloat(scenarioPrice) || currentEthPrice;

    const updatedInvestments = investments.map((investment) => {
      const currentValue = investment.ethAmount * priceToUse;
      const profit = currentValue - investment.amount;
      const profitPercentage =
        investment.amount !== 0
          ? (profit / Math.abs(investment.amount)) * 100
          : 0;

      return {
        ...investment,
        currentValue,
        profit,
        profitPercentage,
        type: investment.type || "deposit",
      };
    });

    setScenarioInvestments(updatedInvestments);
  }, [investments, scenarioPrice, currentEthPrice]);

  const totalInvested = investments.reduce(
    (total, investment) => total + investment.amount,
    0
  );
  const totalEth = investments.reduce(
    (total, investment) => total + investment.ethAmount,
    0
  );

  const scenarioPriceNumber = parseFloat(
    scenarioPrice || currentEthPrice.toString()
  );
  const scenarioValue = isNaN(scenarioPriceNumber)
    ? 0
    : totalEth * scenarioPriceNumber;
  const scenarioProfit = scenarioValue - totalInvested;
  const scenarioProfitPercentage =
    totalInvested > 0 ? (scenarioProfit / totalInvested) * 100 : 0;

  const deposits = scenarioInvestments.filter((inv) => inv.type === "deposit");
  const withdrawals = scenarioInvestments.filter(
    (inv) => inv.type === "withdrawal"
  );

  console.log("Deposits:", deposits.length, "Withdrawals:", withdrawals.length);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scenario Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="scenarioPrice">ETH Price (USD)</Label>
            <Input
              id="scenarioPrice"
              type="number"
              value={scenarioPrice}
              onChange={(e) => setScenarioPrice(e.target.value)}
              placeholder={`${currentEthPrice}`}
              min="0"
              step="0.01"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Portfolio Value
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(scenarioValue)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Profit/Loss
              </p>
              <p
                className={`text-2xl font-bold ${
                  scenarioProfit >= 0
                    ? "text-crypto-positive"
                    : "text-crypto-negative"
                }`}
              >
                {formatCurrency(scenarioProfit)}
              </p>
              <p
                className={`text-sm ${
                  scenarioProfit >= 0
                    ? "text-crypto-positive"
                    : "text-crypto-negative"
                }`}
              >
                {scenarioProfitPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Tus Inversiones con Precio ETH: {formatCurrency(scenarioPriceNumber)}
        </h3>

        {deposits.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Depósitos</h3>
            <div className="overflow-x-auto rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>ETH Price (Bought)</TableHead>
                    <TableHead>ETH Amount</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead>% Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell>{formatDate(investment.date)}</TableCell>
                      <TableCell>{formatCurrency(investment.amount)}</TableCell>
                      <TableCell>
                        {formatCurrency(investment.ethPrice)}
                      </TableCell>
                      <TableCell>
                        {formatEth(investment.ethAmount)} ETH
                      </TableCell>
                      <TableCell>
                        {formatCurrency(investment.currentValue || 0)}
                      </TableCell>
                      <TableCell
                        className={
                          investment.profit && investment.profit > 0
                            ? "text-crypto-positive"
                            : "text-crypto-negative"
                        }
                      >
                        {formatCurrency(investment.profit || 0)}
                      </TableCell>
                      <TableCell
                        className={
                          investment.profitPercentage &&
                          investment.profitPercentage > 0
                            ? "text-crypto-positive"
                            : "text-crypto-negative"
                        }
                      >
                        {formatPercentage(investment.profitPercentage || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
              There are no deposits to show.
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioCalculator;
