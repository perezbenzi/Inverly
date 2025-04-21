
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Investment } from "@/types/investment";

interface InvestmentTableProps {
  investments: Investment[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const InvestmentTable: React.FC<InvestmentTableProps> = ({ 
  investments, 
  onEdit, 
  onDelete 
}) => {
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "-";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatEth = (num: number) => {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5
    }).format(num);
  };

  const formatPercentage = (num: number | undefined) => {
    if (num === undefined) return "-";
    return new Intl.NumberFormat("es-ES", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num / 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES");
  };

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Inversión</TableHead>
            <TableHead>Precio ETH</TableHead>
            <TableHead>Cantidad ETH</TableHead>
            <TableHead>Valor Actual</TableHead>
            <TableHead>Ganancia/Pérdida</TableHead>
            <TableHead>% Retorno</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No hay inversiones. Agrega una para comenzar a hacer seguimiento.
              </TableCell>
            </TableRow>
          ) : (
            investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>{formatDate(investment.date)}</TableCell>
                <TableCell>{formatNumber(investment.amount)}</TableCell>
                <TableCell>{formatNumber(investment.ethPrice)}</TableCell>
                <TableCell>{formatEth(investment.ethAmount)}</TableCell>
                <TableCell>{formatNumber(investment.currentValue)}</TableCell>
                <TableCell className={investment.profit && investment.profit > 0 ? "text-crypto-positive" : "text-crypto-negative"}>
                  {formatNumber(investment.profit)}
                </TableCell>
                <TableCell className={investment.profitPercentage && investment.profitPercentage > 0 ? "text-crypto-positive" : "text-crypto-negative"}>
                  {formatPercentage(investment.profitPercentage)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(investment.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(investment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestmentTable;
