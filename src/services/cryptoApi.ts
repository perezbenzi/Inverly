
import { toast } from "sonner";

const API_URL = "https://api.coingecko.com/api/v3";

export async function getEthPrice() {
  try {
    const response = await fetch(
      `${API_URL}/simple/price?ids=ethereum&vs_currencies=usd`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch ETH price");
    }
    
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    toast.error("Error fetching ETH price. Using estimated value.");
    return 3500;
  }
}
