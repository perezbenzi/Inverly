import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Investment } from "@/types/investment"

interface ScenarioCalculatorProps {
  investments: Investment[]
  currentEthPrice: number
}

const ScenarioCalculator: React.FC<ScenarioCalculatorProps> = ({
  investments,
  currentEthPrice,
}) => {
  const [scenarioPrice, setScenarioPrice] = useState("")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const totalInvested = investments.reduce((total, investment) => total + investment.amount, 0)
  const totalEth = investments.reduce((total, investment) => total + investment.ethAmount, 0)
  
  const scenarioPriceNumber = parseFloat(scenarioPrice || currentEthPrice.toString())
  const scenarioValue = isNaN(scenarioPriceNumber) ? 0 : totalEth * scenarioPriceNumber
  const scenarioProfit = scenarioValue - totalInvested
  const scenarioProfitPercentage = totalInvested > 0 
    ? (scenarioProfit / totalInvested) * 100 
    : 0

  return (
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
            <p className="text-sm font-medium text-muted-foreground mb-1">Portfolio Value</p>
            <p className="text-2xl font-bold">{formatCurrency(scenarioValue)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Profit/Loss</p>
            <p className={`text-2xl font-bold ${scenarioProfit >= 0 ? "text-crypto-positive" : "text-crypto-negative"}`}>
              {formatCurrency(scenarioProfit)}
            </p>
            <p className={`text-sm ${scenarioProfit >= 0 ? "text-crypto-positive" : "text-crypto-negative"}`}>
              {scenarioProfitPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScenarioCalculator 