"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { DollarSign, Clock, PlaySquare, AlertCircle } from "lucide-react"
import { getEarnings, getEarningHistory, getCpmRate } from "@/api/earnings"
import Loader from "@/components/Loader"

type Creator = {
  id: number
  username: string
  email: string
  role: string
  profile_picture: string | null
  followers_count: number
  following_count: number
  monthly_earnings: number
  total_earnings: number
}

type Video = {
  id: number
  title: string
  thumbnail: string | null
  video: string | null
  created_at: string
  duration: number
  duration_formatted?: string | null
  total_watch_time?: number
  total_watch_time_formatted?: string | null
  views?: number
  status?: string
}

type EarningHistoryItem = {
  id: number
  calculated_at: string
  cpm_rate_used: number
  earnings: number
  watch_time_minutes: number
  creator_id: number
  creator: Creator
  video_id: number
  video: Video
}

type EarningsOverviewResponse = {
  earnings: {
    current_month_earnings: number
    total_earnings: number
    earnings_history: EarningHistoryItem[]
  }
  success: boolean
}

type EarningsHistoryResponse = {
  earnings: {
    items: EarningHistoryItem[]
    total: number
  }
  success: boolean
}

type CpmRateResponse = {
  cpm_rate: number
  description: string
  success: boolean
}

type Toast = {
  id: number
  title: string
  description?: string
  variant?: "success" | "error" | "info"
}

function formatUSD(n?: number | null) {
  if (n == null || !isFinite(n)) return "$0.00"
  // Show more precision for micro-earnings
  const minimumFractionDigits = n < 1 ? 4 : 2
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits: Math.max(minimumFractionDigits, 4),
  })
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "-"
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "-" : d.toLocaleString()
}

export default function CreatorEarningsPage() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const pushToast = (t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random()
    const toast: Toast = { id, ...t }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 2800)
  }

  // Stats
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState<number>(0)
  const [totalEarnings, setTotalEarnings] = useState<number>(0)
  const [cpmRate, setCpmRate] = useState<number>(0)
  const [cpmDesc, setCpmDesc] = useState<string>("")
  const [isLoading,setIsLoading]=useState(true);

  // History
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState<string>("")
  const [items, setItems] = useState<EarningHistoryItem[]>([])

  async function loadStats() {
    try {
      setLoadingStats(true)
      setStatsError("")
      const [earningsRes, cpmRes] = await Promise.all([getEarnings(), getCpmRate()])
      const earningsOk =
        earningsRes && earningsRes.status < 400 && (earningsRes.data as EarningsOverviewResponse)?.success
      const cpmOk = cpmRes && cpmRes.status < 400 && (cpmRes.data as CpmRateResponse)?.success
      if (!earningsOk) throw new Error("Failed to load earnings")
      if (!cpmOk) throw new Error("Failed to load CPM rate")
      const earnings = (earningsRes.data as EarningsOverviewResponse).earnings
      const cpm = cpmRes.data as CpmRateResponse
      setCurrentMonth(earnings.current_month_earnings)
      setTotalEarnings(earnings.total_earnings)
      setCpmRate(cpm.cpm_rate)
      setCpmDesc(cpm.description)
      setIsLoading(false);
    } catch (e: any) {
      const msg = e?.message ?? "Unknown error"
      setStatsError(msg)
      pushToast({ title: "Could not load stats", description: msg, variant: "error" })
    } finally {
      setLoadingStats(false)
    }
  }

  async function loadHistory() {
    try {
      setLoadingHistory(true)
      setHistoryError("")
      const res = await getEarningHistory()
      const ok = res && res.status < 400 && (res.data as EarningsHistoryResponse)?.success
      if (!ok) throw new Error("Failed to load earning history")
      const data = (res.data as EarningsHistoryResponse).earnings
      setItems(data.items || [])
    } catch (e: any) {
      const msg = e?.message ?? "Unknown error"
      setHistoryError(msg)
      pushToast({ title: "Could not load history", description: msg, variant: "error" })
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    // Fetch on mount to sync UI with your APIs while visible. [^1]
    loadStats()
    loadHistory()
  }, [])

  if(isLoading){
    return <Loader></Loader>
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">


      <header className="mx-auto  px-6 sm:px-8 pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Creator Earnings</h1>
        <p className="mt-2 text-slate-600">
          Track your current month, lifetime totals, CPM rate, and per-video earnings.
        </p>
      </header>

      <main className="mx-auto px-6 sm:px-8 pb-20 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Current Month</p>
                {loadingStats ? (
                  <div className="h-7 w-28 bg-slate-100 animate-pulse rounded mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatUSD(currentMonth)}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                {loadingStats ? (
                  <div className="h-7 w-28 bg-slate-100 animate-pulse rounded mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatUSD(totalEarnings)}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">CPM Rate</p>
                {loadingStats ? (
                  <div className="h-7 w-28 bg-slate-100 animate-pulse rounded mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ${cpmRate.toFixed(2)} <span className="text-sm font-normal text-slate-600">CPM</span>
                  </p>
                )}
                {!loadingStats && cpmDesc ? <p className="text-xs text-slate-500 mt-1">{cpmDesc}</p> : null}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <PlaySquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </section>

     

        {/* History */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Earnings History</h2>
              <p className="text-sm text-slate-600">Per-video calculations and watch time</p>
            </div>
          </div>

       

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Date</th>
                  <th className="text-left font-semibold px-4 py-3">Video</th>
                  <th className="text-left font-semibold px-4 py-3">Watch Time</th>
                  <th className="text-left font-semibold px-4 py-3">CPM Used</th>
                  <th className="text-left font-semibold px-4 py-3">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {loadingHistory ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-slate-200">
                      <td className="px-4 py-3">
                        <div className="h-4 w-36 bg-slate-100 animate-pulse rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-24 bg-slate-100 animate-pulse rounded" />
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-slate-100 animate-pulse rounded" />
                            <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-20 bg-slate-100 animate-pulse rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-16 bg-slate-100 animate-pulse rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-20 bg-slate-100 animate-pulse rounded" />
                      </td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr className="border-t border-slate-200">
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-600">
                      No earnings yet.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200 hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-slate-900">{formatDateTime(row.calculated_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-24 overflow-hidden rounded bg-slate-100">
                            <Image
                              src={
                                row.video?.thumbnail ||
                                "/placeholder.svg?height=56&width=100&query=video-thumbnail" ||
                                "/placeholder.svg"
                              }
                              alt={row.video?.title || "Video thumbnail"}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 truncate max-w-sm">
                              {row.video?.title || "Untitled"}
                            </div>
                            <div className="text-xs text-slate-600 truncate max-w-sm">
                              @{row.creator?.username || "creator"} · Video #{row.video_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{row.watch_time_minutes} min</td>
                      <td className="px-4 py-3 text-slate-900">${row.cpm_rate_used?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-900">{formatUSD(row.earnings)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
