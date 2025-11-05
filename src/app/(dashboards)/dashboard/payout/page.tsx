"use client"

import { useState, useEffect } from "react"
import { getEarning, setupStripeAccount, getStripeAccount, removeStripeAccount, refreshStripeAccount, requestWithdrawal, withdrawalHistory, setupPayPalAccount, requestPayPalWithdrawal, payPalWithdrawalHistory, getPayPalAccount, removePayPalAccount } from "@/api/earnings";
import { DollarSign, TrendingUp, Clock, CheckCircle, CreditCard, ArrowUpRight, Wallet, Plus, RefreshCw, Trash2 } from "lucide-react"
import Loader from "@/components/Loader2";
import toast from "react-hot-toast";

type PaymentProvider = 'stripe' | 'payoneer' | 'paypal' | null;

export default function PayoutPage() {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(null)
  const [isAccountConnected, setIsAccountConnected] = useState(false)
  const [isAccountPending, setIsAccountPending] = useState(false)
  const [connectedProvider, setConnectedProvider] = useState<PaymentProvider>(null)
  const [earningsData, setEarningsData] = useState({
    available_for_withdrawal: 0,
    completed_withdrawals: 0,
    pending_withdrawals: 0,
    success: false,
    total_earnings: 0,
    total_withdrawn: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showVerifyAgain, setShowVerifyAgain] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState<number | "">("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10;

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

  useEffect(() => {
    const fetchPaymentAccounts = async () => {
      try {
        // Check Stripe account
        const stripeResponse = await getStripeAccount();
        if (stripeResponse?.status === 200 && stripeResponse.data?.success) {
          const account = stripeResponse.data.account;

          if (
            account?.account_status === "active" &&
            account?.charges_enabled &&
            account?.payouts_enabled
          ) {
            setIsAccountConnected(true)
            setIsAccountPending(false)
            setConnectedProvider('stripe')
            setOnboardingUrl(null)
            return;
          } else if (account) {
            setIsAccountConnected(false)
            setIsAccountPending(true)
            setConnectedProvider('stripe')
            setOnboardingUrl(null)
            return;
          }
        }

        // Check PayPal account
        const paypalResponse = await getPayPalAccount();
        if (paypalResponse?.status === 200 && paypalResponse.data?.success) {
          const account = paypalResponse.data.account;
          if (account?.account_status === "verified") {
            setIsAccountConnected(true);
            setIsAccountPending(false);
            setConnectedProvider("paypal");
          } else if (account) {
            setIsAccountConnected(false);
            setIsAccountPending(true);
            setConnectedProvider("paypal");
          }
        }

      } catch (error) {
        console.error("Error fetching payment accounts:", error);
      }
    };

    fetchPaymentAccounts();
  }, []);

  useEffect(() => {
    fetchWithdrawalHistory();
  }, [connectedProvider])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWithdrawals = withdrawals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);


  const fetchWithdrawalHistory = async () => {
    try {
      if (connectedProvider === 'stripe') {
        const response = await withdrawalHistory();
        if (response?.status === 200 && response.data?.success) {
          setWithdrawals(response.data.withdrawals || []);
        } else {
          setWithdrawals([]);
        }
      } else if (connectedProvider === "paypal") {
      const response = await payPalWithdrawalHistory();
      if (response?.status === 200 && response.data?.success) {
        setWithdrawals(response.data.withdrawals || []);
      } else {
        setWithdrawals([]);
      }
    }
    } catch (error) {
      console.error("Error Fetching withdrawal history.");
      setWithdrawals([]);
    } finally {
      setIsHistoryLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
    }).format(amount)
  }

  const handleConnectAccount = async (provider: PaymentProvider) => {
    try {
      if (provider === 'stripe') {
        const response = await setupStripeAccount()
        if (response?.status === 200) {
          setOnboardingUrl(response.data.onboarding_url)
          setIsAccountConnected(false)
          setIsAccountPending(false)
          setConnectedProvider('stripe')
        } else {
          console.error("Stripe Setup Failed:", response?.data)
        }
      } else if (provider === "paypal") {
  try {
    const response = await setupPayPalAccount(); // no prompt; backend handles OAuth
    if (response?.status === 200 && response.data?.success) {
      const { onboarding_url, status } = response.data;

      if (onboarding_url) {
        // open PayPal OAuth page
        window.open(onboarding_url, "_blank");
        toast("Redirecting to PayPal for verification...", { icon: "🔗" });
      }

      if (status === "already_active") {
        toast.success("Your PayPal account is already connected 🎉");
        setConnectedProvider("paypal");
        setIsAccountConnected(true);
        setIsAccountPending(false);
      } else if (status === "existing_incomplete") {
        toast("Continue your PayPal onboarding.", { icon: "⏳" });
        setConnectedProvider("paypal");
        setIsAccountPending(true);
        setIsAccountConnected(false);
        setOnboardingUrl(onboarding_url);
      } else if (status === "new_created") {
        toast("PayPal onboarding started ✅");
        setConnectedProvider("paypal");
        setIsAccountPending(true);
        setIsAccountConnected(false);
        setOnboardingUrl(onboarding_url);
      }
    } else {
      toast.error(response?.data?.error || "PayPal setup failed.");
    }
  } catch (error) {
    console.error("Error connecting PayPal account:", error);
    toast.error("Something went wrong while connecting PayPal.");
  }
}
    } catch (error) {
      console.error("Error connecting account:", error)
    }
  }

 const handleRefreshAccount = async () => {
  setIsRefreshing(true);
  try {
    if (connectedProvider === "stripe") {
      const response = await refreshStripeAccount();
      if (response.status === 200 && response.data?.success) {
        const account = response.data.account;
        if (
          account?.account_status === "active" &&
          account?.charges_enabled &&
          account?.payouts_enabled
        ) {
          setIsAccountConnected(true);
          setIsAccountPending(false);
          setShowVerifyAgain(false);
        } else {
          setIsAccountConnected(false);
          setIsAccountPending(true);
          setShowVerifyAgain(true);
        }
      } else {
        setIsAccountConnected(false);
        setIsAccountPending(true);
        setShowVerifyAgain(true);
      }
    } 
    else if (connectedProvider === "paypal") {
      // ✅ Correct logic for PayPal
      const response = await getPayPalAccount();
      if (response.status === 200 && response.data?.success) {
        const account = response.data.account;
        if (account?.account_status === "verified") {
          setIsAccountConnected(true);
          setIsAccountPending(false);
          setShowVerifyAgain(false);
        } else {
          setIsAccountConnected(false);
          setIsAccountPending(true);
          setShowVerifyAgain(true);
        }
      } else {
        setIsAccountConnected(false);
        setIsAccountPending(true);
        setShowVerifyAgain(true);
      }
    } 
    else if (connectedProvider === "payoneer") {
      // Payoneer not yet connected to backend
      toast("Payoneer refresh not available yet.", { icon: "🛠️" });
      setIsAccountConnected(false);
      setIsAccountPending(true);
    }
  } catch (error) {
    console.error("Error refreshing account:", error);
  } finally {
    setIsRefreshing(false);
  }
};

  const handleVerifyAgain = async () => {
  try {
    if (connectedProvider === "stripe") {
      const response = await setupStripeAccount();
      if (response?.status === 200) {
        setOnboardingUrl(response.data.onboarding_url);
        setIsAccountConnected(false);
        setIsAccountPending(true);
        setShowVerifyAgain(false);
      }
    } else if (connectedProvider === "paypal") {
      // PayPal doesn't use onboarding links — simply re-fetch the account
      const response = await getPayPalAccount();
      if (response?.status === 200 && response.data?.success) {
        const account = response.data.account;
        if (account.account_status === "verified") {
          toast.success("PayPal account verified successfully 🎉");
          setIsAccountConnected(true);
          setIsAccountPending(false);
        } else {
          toast("PayPal account still pending verification.", { icon: "⏳" });
        }
      } else {
        toast.error("Unable to verify PayPal account at this time.");
      }
    } else if (connectedProvider === "payoneer") {
      // No backend integration yet → show friendly placeholder
      toast("Payoneer verification is not available yet.", { icon: "🛠️" });
    }
  } catch (error) {
    console.error("Error verifying account again:", error);
    toast.error("Something went wrong while verifying your account.");
  }
};

  const handleRemoveAccount = async () => {
  try {
    if (connectedProvider === 'stripe') {
      const response = await removeStripeAccount();
      if (response?.status === 200 && response.data?.success) {
        toast.success("Stripe account removed successfully");
      } else {
        toast.error("Failed to remove Stripe account");
      }
    } else if (connectedProvider === 'paypal') {
      const response = await removePayPalAccount();
      if (response?.status === 200 && response.data?.success) {
        toast.success("PayPal account removed successfully");
      } else {
        toast.error("Failed to remove PayPal account");
      }
    } else if (connectedProvider === 'payoneer') {
      toast("Payoneer removal not implemented yet", { icon: "🛠️" });
    }

    // ✅ Reset UI after any successful removal
    setIsAccountConnected(false);
    setIsAccountPending(false);
    setConnectedProvider(null);
    setOnboardingUrl(null);

  } catch (error) {
    console.error("Error removing account:", error);
    toast.error("Something went wrong while removing account");
  }
};

  const handleWithdraw = async () => {
    if (!isAccountConnected) {
      toast.error("No connected account found.")
      return;
    }

    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }
    if (withdrawAmount > earningsData.available_for_withdrawal) {
      toast.error("Amount exceeds available balance");
      return;
    }
    setIsWithdrawing(true);

    try {
      let response;
      if (connectedProvider === 'stripe') {
        response = await requestWithdrawal(Number(withdrawAmount));
      } else if (connectedProvider === "paypal") {
        response = await requestPayPalWithdrawal(Number(withdrawAmount));
      }

      if (response?.status === 200 && response.data?.success) {
        toast.success(`Withdrawal of $${withdrawAmount} requested successfully 🎉`);
        setWithdrawAmount("");
        const refreshEarnings = await getEarning();
        setEarningsData(refreshEarnings.data);

        await fetchWithdrawalHistory();
      } else {
        toast.error(response?.data?.error);
      }
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      toast.error("Something went wrong while requesting withdrawal.");
    } finally {
      setIsWithdrawing(false);
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  const formatFailureReason = (reason: string | null) => {
    if (!reason) return "—";
    const parts = reason.split(":");
    return parts.length > 1 ? parts.slice(1).join(":").trim() : reason;
  };

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Creator Earnings</h1>
          <p className="text-gray-600 text-sm md:text-base">Manage your earnings and withdrawals</p>
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
                {isAccountConnected && (
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
                    <p className="text-gray-700 font-medium">
                                          Your {connectedProvider === 'stripe'
                      ? 'Stripe'
                      : connectedProvider === 'paypal'
                      ? 'PayPal'
                      : 'Payoneer'} account is connected 🎉
                    </p>
                    <button
                      onClick={handleRemoveAccount}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Account
                    </button>
                  </div>
                )}

                {!isAccountConnected && !isAccountPending && !onboardingUrl && (
                  <div>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Payment Method</h3>
                      <p className="text-gray-600 mb-6">
                        Select your preferred payment provider to start receiving withdrawals
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Stripe Option */}
                      <div
                        onClick={() => handleConnectAccount('stripe')}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                      >
                        <div className="flex flex-col items-center">
                          <div className="p-3 bg-blue-100 rounded-full mb-4">
                            <CreditCard className="h-8 w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Fast payouts to your bank account
                          </p>
                          <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Connect Stripe
                          </div>
                        </div>
                      </div>

                      {/* Payoneer Option */}
                      <div
                        onClick={() => handleConnectAccount('paypal')}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all"
                      >
                        <div className="flex flex-col items-center">
                          <div className="p-3 bg-orange-100 rounded-full mb-4">
                            <Wallet className="h-8 w-8 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payoneer</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Global payment solution
                          </p>
                          <div className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                            Connect Payoneer
                          </div>
                        </div>
                      </div>

                      {/* PayPal Option just UI integrate backend later*/}
                  <div
                    onClick={() => handleConnectAccount('paypal')}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-green-100 rounded-full mb-4">
                        <CreditCard className="h-8 w-8 text-green-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">PayPal</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Trusted worldwide payment platform
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                        Connect PayPal
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
                )}

                {!isAccountConnected && onboardingUrl && (
                  <div className="space-y-4 text-center">
                    <p className="text-gray-700">
                      Please complete your {connectedProvider === 'stripe' ? 'Stripe' : 'Payoneer'} onboarding to start receiving payouts.
                    </p>
                    <a
                      href={onboardingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      Complete Onboarding →
                    </a>
                  </div>
                )}

                {!isAccountConnected && isAccountPending && !onboardingUrl && (
                  <div className="text-center space-y-4">
                    {!showVerifyAgain ? (
                      <>
                        <p className="text-gray-700 font-medium">
                          <span className="text-xl font-bold text-red-600 p-1">!!!</span>
                          Your {connectedProvider === 'stripe' ? 'Stripe' : 'Payoneer'} account status is pending.
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={handleRefreshAccount}
                            disabled={isRefreshing}
                            className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-lg transition-colors ${isRefreshing
                              ? "bg-gray-400 text-white"
                              : "bg-indigo-600 text-white hover:bg-blue-700"
                              }`}
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                            {isRefreshing ? "Refreshing..." : "Check Status"}
                          </button>
                          <button
                            onClick={handleRemoveAccount}
                            className="inline-flex items-center cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Account
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 font-medium">
                          <span className="text-xl font-bold text-red-600 p-1">!!!</span>
                          Your account status is still pending, you can verify again.
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={handleVerifyAgain}
                            className="inline-flex items-center cursor-pointer px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Verify Again
                          </button>
                          <button
                            onClick={handleRemoveAccount}
                            className="inline-flex items-center cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Account
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
              <p className="text-gray-600 text-sm">
                Enter an amount to withdraw (Available: {formatCurrency(earningsData.available_for_withdrawal)})
              </p>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <input
                type="number"
                min="1"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter amount"
              />

              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing || !isAccountConnected}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${isWithdrawing || !isAccountConnected ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {isWithdrawing ? "Processing..." : "Request Withdrawal"}
              </button>

              {!isAccountConnected && (
                <p className="text-xs text-red-600 text-center">
                  Please connect an account first
                </p>
              )}
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="lg:col-span-3 overflow-x-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>

              <div className="p-6">
                {isHistoryLoading ? (
                  <div className="text-center py-8">
                    <Loader />
                  </div>
                ) : withdrawals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-3 bg-gray-100 rounded-full mx-auto mb-4 w-fit">
                      <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      No Recent Activity
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your withdrawal history will appear here once you start making withdrawals.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Amount</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Failure Reason</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Requested At</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Processed At</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentWithdrawals.map((w, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {formatCurrency(w.amount)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {w.failure_reason === null ? "—" : formatFailureReason(w.failure_reason)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {formatDateTime(w.requested_at)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {w.processed_at ? formatDateTime(w.processed_at) : "—"}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium
                        ${w.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : w.status === "failed"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                              >
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {withdrawals.length > 0 && (
                <div className="flex justify-between items-center px-8 py-4">
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer rounded disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer rounded disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}