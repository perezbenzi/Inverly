import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import ScenarioCalculator from "@/components/ScenarioCalculator"
import { Investment } from "@/types/investment"
import { useAuth } from "@/contexts/AuthContext"
import { getUserInvestments } from "@/lib/firebase"
import { getEthPrice } from "@/services/cryptoApi"
import { toast } from "sonner"

const Scenarios = () => {
  const { user } = useAuth()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        const [fetchedInvestments, ethPrice] = await Promise.all([
          getUserInvestments(user.uid),
          getEthPrice()
        ])
        
        setInvestments(fetchedInvestments)
        setCurrentEthPrice(ethPrice)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error loading data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Unauthorized Access</h2>
          <p className="text-muted-foreground">Please log in to view scenarios.</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Scenarios</h1>
          <p className="text-muted-foreground">
            Calculate potential returns based on different ETH prices.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading...</p>
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No investments found. Add investments to calculate scenarios.
            </p>
          </div>
        ) : (
          <ScenarioCalculator
            investments={investments}
            currentEthPrice={currentEthPrice}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default Scenarios 