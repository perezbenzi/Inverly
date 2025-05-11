export interface Investment {
  id: string;
  date: string;
  amount: number;
  ethPrice: number;
  ethAmount: number;
  currentValue?: number;
  profit?: number;
  profitPercentage?: number;
  type: 'deposit' | 'withdrawal';
}

export interface EthPriceData {
  ethereum: {
    usd: number;
  };
}
