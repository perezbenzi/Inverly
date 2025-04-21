import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, LogOut } from "lucide-react";
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
  getUserInvestments,
  logoutUser 
} from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(0);
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadInvestments();
    }
  }, [user]);

  const loadInvestments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const savedInvestments = await getUserInvestments(user.uid);
      
      const price = await getEthPrice();
      setCurrentEthPrice(price);
      
      const updatedInvestments = savedInvestments.map(investment => {
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
      
      setInvestments(updatedInvestments);
    } catch (error) {
      console.error("Error loading investments:", error);
      toast.error("Error al cargar las inversiones");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadInvestments();
    toast.success("Precios actualizados");
  };

  const handleAddInvestment = () => {
    setEditingInvestment(null);
    setIsAddingInvestment(true);
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
      const updatedInvestments = investments.filter(inv => inv.id !== id);
      setInvestments(updatedInvestments);
      toast.success("Inversión eliminada");
    } catch (error) {
      console.error("Error deleting investment:", error);
      toast.error("Error al eliminar la inversión");
    }
  };

  const handleSaveInvestment = async (investment: Investment) => {
    if (!user) return;
    
    try {
      let savedInvestment;
      if (editingInvestment) {

        await updateInvestmentInFirestore(investment);
        savedInvestment = investment;
      } else {

        const docRef = await saveInvestmentToFirestore(investment, user.uid);
        savedInvestment = { ...investment, id: docRef.id };
      }
      

      const currentValue = savedInvestment.ethAmount * currentEthPrice;
      const profit = currentValue - savedInvestment.amount;
      const profitPercentage = (profit / savedInvestment.amount) * 100;
      
      const finalInvestment = {
        ...savedInvestment,
        currentValue,
        profit,
        profitPercentage
      };
      
      const updatedInvestments = editingInvestment
        ? investments.map(inv => inv.id === finalInvestment.id ? finalInvestment : inv)
        : [...investments, finalInvestment];
      
      setInvestments(updatedInvestments);
      setIsAddingInvestment(false);
      setEditingInvestment(null);
      toast.success(editingInvestment ? "Inversión actualizada" : "Inversión agregada");
    } catch (error) {
      console.error("Error saving investment:", error);
      toast.error("Error al guardar la inversión");
    }
  };

  const handleCancelEdit = () => {
    setIsAddingInvestment(false);
    setEditingInvestment(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acceso no autorizado</h2>
          <p className="text-muted-foreground">Por favor, inicia sesión para ver tus inversiones.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Seguimiento de Inversiones en ETH</h1>
            <p className="text-muted-foreground">
              Monitorea y analiza tus inversiones en Ethereum
            </p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-pulse text-muted-foreground">Cargando datos...</div>
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
              <h2 className="text-xl font-semibold">Tus Inversiones</h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar Precios
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={handleAddInvestment}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Inversión
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
    </div>
  );
};

export default Index;
