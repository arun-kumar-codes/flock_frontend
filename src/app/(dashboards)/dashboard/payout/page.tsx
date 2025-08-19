"use client"

import { useState, useEffect } from "react"
import { getEarning } from "@/api/earnings";
import { DollarSign, TrendingUp, Clock, CheckCircle, CreditCard, ArrowUpRight, Wallet, Plus } from "lucide-react"
import Loader from "@/components/Loader2";

export default function PayoutPage() {
  const [isAccountConnected, setIsAccountConnected] = useState(false)
  const [earningsData, setEarningsData] = useState({
    available_for_withdrawal: 0,
    completed_withdrawals: 0,
    pending_withdrawals: 0,
    success: false,
    total_earnings: 0,
    total_withdrawn: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await getEarning()
    
        setEarningsData(response.data)
      } catch (error) {
        console.error("Failed to load earnings data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEarnings()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
    }).format(amount)
  }

  const handleConnectAccount = () => {
    setIsAccountConnected(true)
  }

  const handleWithdraw = () => {
    // Handle withdrawal logic here
    //console.log("Initiating withdrawal...")
  }

  if (isLoading) {
    return (
     <Loader></Loader>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Earnings</h1>
          <p className="text-gray-600">Manage your earnings and withdrawals</p>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Earnings</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.total_earnings)}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Available for Withdrawal</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.available_for_withdrawal)}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Withdrawals</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.pending_withdrawals)}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Withdrawn</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.total_withdrawn)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Details</h2>
                <p className="text-gray-600">Connect your bank account to receive payments</p>
              </div>

              <div className="p-6">
                {!isAccountConnected ? (
                  <div
                    onClick={handleConnectAccount}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-gray-100 rounded-full mb-4">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Account</h3>
                      <p className="text-gray-600 mb-4">
                        Add your bank account or payment method to start receiving withdrawals
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Connect Now
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-900">Account Connected</h4>
                          <p className="text-sm text-green-700">Bank Account •••• 1234</p>
                        </div>
                      </div>
                      <div className="text-green-600">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    </div>

                    <button
                      onClick={handleWithdraw}
                      disabled={earningsData.available_for_withdrawal <= 0}
                      className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUpRight className="h-5 w-5 mr-2" />
                      Withdraw {formatCurrency(earningsData.available_for_withdrawal)}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>

              <div className="p-6">
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-100 rounded-full mx-auto mb-4 w-fit">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-sm text-gray-600">
                    Your withdrawal history will appear here once you start making withdrawals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
