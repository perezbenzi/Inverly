import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import InvestmentTable from "@/components/InvestmentTable";
import InvestmentForm from "@/components/InvestmentForm";
import InvestmentSummary from "@/components/InvestmentSummary";
import CurrentEthPrice from "@/components/CurrentEthPrice";
import { Investment } from "@/types/investment";
import { getEthPrice } from "@/services/cryptoApi";
import { useAuth } from "@/contexts/AuthContext";
import { 
  saveInvestmentToFirestore, 
  updateInvestmentInFirestore, 
  deleteInvestmentFromFirestore, 
  getUserInvestments 
} from "@/lib/firebase";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Index = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEthPrice, setCurrentEthPrice] = useState(0);
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    if (user) {
      loadInvestments();
    }
  }, [user]);

  useEffect(() => {
    if (investments.length > 0 && currentEthPrice > 0) {
      const updatedInvestments = updateCalculations(investments, currentEthPrice);
      setInvestments(updatedInvestments);
    }
  }, [currentEthPrice]);

  const loadInvestments = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [userInvestments, price] = await Promise.all([
        getUserInvestments(user.uid),
        getEthPrice()
      ]);
      
      setCurrentEthPrice(price);
      
      const calculatedInvestments = userInvestments.map(investment => {
        const currentValue = investment.ethAmount * price;
        const profit = currentValue - investment.amount;
        const profitPercentage = (profit / investment.amount) * 100;
        
        return {
          ...investment,
          currentValue,
          profit,
          profitPercentage
        };
      });
      
      setInvestments(calculatedInvestments);
    } catch (error) {
      console.error("Error loading investments:", error);
      toast.error("Could not load investments");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCalculations = (investments: Investment[], ethPrice: number) => {
    return investments.map(investment => {
      const currentValue = investment.ethAmount * ethPrice;
      const profit = currentValue - investment.amount;
      const profitPercentage = (profit / investment.amount) * 100;
      
      return {
        ...investment,
        currentValue,
        profit,
        profitPercentage
      };
    });
  };

  const handleRefresh = async () => {
    const price = await fetchCurrentEthPrice();
    if (price > 0) {
      const updatedInvestments = updateCalculations(investments, price);
      setInvestments(updatedInvestments);
      toast.success("Prices updated");
    }
  };

  const handleAddInvestment = () => {
    setIsAddingInvestment(true);
    setEditingInvestment(null);
  };

  const handleEditInvestment = (id: string) => {
    const investment = investments.find(inv => inv.id === id);
    if (investment) {
      setEditingInvestment(investment);
      setIsAddingInvestment(true);
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    try {
      await deleteInvestmentFromFirestore(id);
      setInvestments(prev => prev.filter(inv => inv.id !== id));
      toast.success("Investment successfully deleted");
    } catch (error) {
      console.error("Error deleting investment:", error);
      toast.error("Error deleting investment");
    }
  };

  const handleSaveInvestment = async (investment: Investment) => {
    try {
      const currentValue = investment.ethAmount * currentEthPrice;
      const profit = currentValue - investment.amount;
      const profitPercentage = (profit / investment.amount) * 100;
      
      const completedInvestment = {
        ...investment,
        currentValue,
        profit,
        profitPercentage
      };
      
      if (editingInvestment) {
        await updateInvestmentInFirestore(investment);
        setInvestments(prev => 
          prev.map(inv => inv.id === investment.id ? completedInvestment : inv)
        );
        toast.success("Investment successfully updated");
      } else {
        if (user) {
          const newInvestmentRef = await saveInvestmentToFirestore(investment, user.uid);
          const newInvestment = {
            ...completedInvestment,
            id: newInvestmentRef.id
          };
          setInvestments(prev => [...prev, newInvestment]);
          toast.success("Investment successfully saved");
        }
      }
      setIsAddingInvestment(false);
      setEditingInvestment(null);
    } catch (error) {
      console.error("Error saving investment:", error);
      toast.error("Error saving investment");
    }
  };

  const handleCancelEdit = () => {
    setIsAddingInvestment(false);
    setEditingInvestment(null);
  };

  const fetchCurrentEthPrice = async () => {
    try {
      const price = await getEthPrice();
      setCurrentEthPrice(price);
      return price;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      toast.error("Could not get current ETH price");
      return 0;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Unauthorized Access</h2>
          <p className="text-muted-foreground">Please log in to view your investments.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">Investment Tracking in ETH</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Monitor and analyze your Ethereum investments
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-pulse text-muted-foreground">Loading data...</div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="md:col-span-1">
                <CurrentEthPrice />
              </div>
              <div className="md:col-span-4">
                <InvestmentSummary 
                  investments={investments} 
                  currentEthPrice={currentEthPrice} 
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-semibold">Your Investments</h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Prices
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={handleAddInvestment}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Investment
                </Button>
              </div>
            </div>
            
            {isAddingInvestment ? (
              <InvestmentForm 
                onAddInvestment={handleSaveInvestment}
                editingInvestment={editingInvestment}
                onCancelEdit={handleCancelEdit}
              />
            ) : (
              <InvestmentTable 
                investments={investments}
                onEdit={handleEditInvestment}
                onDelete={handleDeleteInvestment}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
