
import { Investment } from "@/types/investment";

const STORAGE_KEY = "eth-investments";

export const saveInvestments = (investments: Investment[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
};

export const getInvestments = (): Investment[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing stored investments:", error);
    return [];
  }
};
