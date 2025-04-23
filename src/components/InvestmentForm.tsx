import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEthPrice } from "@/services/cryptoApi";
import { Investment } from "@/types/investment";
import { toast } from "sonner";

interface InvestmentFormProps {
  onAddInvestment: (investment: Investment) => void;
  editingInvestment: Investment | null;
  onCancelEdit: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  onAddInvestment,
  editingInvestment,
  onCancelEdit,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingInvestment) {
      setDate(new Date(editingInvestment.date).toISOString().split("T")[0]);
      setAmount(editingInvestment.amount.toString());
      setEthPrice(editingInvestment.ethPrice.toString());
    } else {
      fetchEthPrice();
    }
  }, [editingInvestment]);

  const fetchEthPrice = async () => {
    setIsLoading(true);
    try {
      const price = await getEthPrice();
      setEthPrice(price.toString());
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      toast.error("Error getting ETH price. Enter it manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !amount || !ethPrice) {
      toast.error("Please complete all fields");
      return;
    }

    const amountNumber = parseFloat(amount);
    const ethPriceNumber = parseFloat(ethPrice);
    
    if (isNaN(amountNumber) || isNaN(ethPriceNumber)) {
      toast.error("Please enter valid numeric values");
      return;
    }

    if (amountNumber <= 0 || ethPriceNumber <= 0) {
      toast.error("Values must be greater than zero");
      return;
    }

    const ethAmount = amountNumber / ethPriceNumber;

    const newInvestment: Investment = {
      id: editingInvestment?.id || Math.random().toString(36).substring(2, 9),
      date,
      amount: amountNumber,
      ethPrice: ethPriceNumber,
      ethAmount,
    };

    onAddInvestment(newInvestment);
    
    if (!editingInvestment) {
      setAmount("");
      fetchEthPrice();
    }
    
    toast.success(editingInvestment ? "Investment updated" : "Investment added");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingInvestment ? "Edit Investment" : "New Investment"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount Invested (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ex: 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <Label htmlFor="ethPrice">ETH Price (USD)</Label>
              <Input
              id="ethPrice"
              type="number"
              placeholder="Ex: 3500"
              value={ethPrice}
              onChange={(e) => setEthPrice(e.target.value)}
              step="0.01"
              min="0"
              required
            />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fetchEthPrice}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Loading..." : "Get Current Price"}
              </Button>
            </div>

          </div>
          
          <div className="flex justify-end space-x-2">
            {editingInvestment && (
              <Button variant="outline" type="button" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editingInvestment ? "Update" : "Add Investment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
