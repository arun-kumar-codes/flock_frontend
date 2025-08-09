'use client'

import { useEffect, useMemo, useState } from 'react'
import { getCpm, updateCpm, getHistory, deleteHistory } from '@/api/managment'

// Types (based on your payloads)
type Admin = {
  email: string | null
  followers_count: number
  following_count: number
  id: number
  profile_picture: string | null
  role: string
  username: string
}
type CpmConfig = {
  id: number
  cpm_rate: number
  admin: Admin
  is_active: boolean
  created_at: string
  updated_at: string
  updated_by: number
}
type CreatorDataResponse = {
  config: CpmConfig
  success: boolean
}
type CpmHistoryResponse = {
  configs: CpmConfig[]
  success: boolean
}
type FetchState<T> = {
  data?: T
  loading: boolean
  error?: string
}
type Toast = {
  id: number
  title: string
  description?: string
  variant?: 'success' | 'error' | 'info'
}

function formatDate(d?: string | null) {
  if (!d) return '-'
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? '-' : dt.toLocaleString()
}
function formatRate(n: number | string) {
  const val = typeof n === 'string' ? parseFloat(n) : n
  if (!isFinite(val)) return '-'
  return val.toFixed(2)
}

export default function CPMAdminPage() {
  // Toasts with soft colors
  const [toasts, setToasts] = useState<Toast[]>([])
  const pushToast = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    const item: Toast = { id, ...t }
    setToasts((prev) => [...prev, item])
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 2500)
  }

  // Active config
  const [active, setActive] = useState<FetchState<CpmConfig>>({ loading: true })
  const [refreshingActive, setRefreshingActive] = useState(false)

  // History
  const [history, setHistory] = useState<FetchState<CpmHistoryResponse>>({ loading: true })
  const [refreshingHistory, setRefreshingHistory] = useState(false)

  // Update form
  const [rateInput, setRateInput] = useState<string>('')
  const [updating, setUpdating] = useState(false)
  const [clearing, setClearing] = useState(false)

  const historyItems = useMemo(() => history.data?.configs ?? [], [history.data])

  async function loadActive() {
    try {
      setRefreshingActive(true)
      const res = await getCpm()
      const ok = res && res.status < 400
      const data = (res?.data as CreatorDataResponse | undefined)?.config
      if (!ok || !data) throw new Error('Failed to load active config')
      setActive({ loading: false, data })
    } catch (e: any) {
      setActive({ loading: false, error: e?.message ?? 'Unknown error' })
      pushToast({ title: 'Failed to load active config', description: 'Please try again.', variant: 'error' })
    } finally {
      setRefreshingActive(false)
    }
  }

  async function loadHistory() {
    try {
      setRefreshingHistory(true)
      const res = await getHistory()
      const ok = res && res.status < 400
      const data = res?.data as CpmHistoryResponse | undefined
      if (!ok || !data?.success) throw new Error('Failed to load history')
      setHistory({ loading: false, data })
    } catch (e: any) {
      setHistory({ loading: false, error: e?.message ?? 'Unknown error' })
      pushToast({ title: 'Failed to load history', description: 'Please try again.', variant: 'error' })
    } finally {
      setRefreshingHistory(false)
    }
  }

  useEffect(() => {
    loadActive()
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault()
    const val = parseFloat(rateInput)
    if (!isFinite(val) || val <= 0) {
      pushToast({ title: 'Invalid rate', description: 'Enter a positive number (e.g., 3.50).', variant: 'error' })
      return
    }
    try {
      setUpdating(true)
      const res = await updateCpm(parseFloat(rateInput))
      if (!res || res.status >= 400) throw new Error('Update failed')
      pushToast({ title: 'CPM updated', description: `New CPM set to ${formatRate(rateInput)}.`, variant: 'success' })
      setRateInput('')
      await Promise.all([loadActive(), loadHistory()])
    } catch (e: any) {
      pushToast({ title: 'Update failed', description: e?.message ?? 'Unknown error', variant: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  async function onClearHistory() {
    try {
      setClearing(true)
      const res = await deleteHistory()
      if (!res || res.status >= 400) throw new Error('Clear history failed')
      pushToast({
        title: 'History cleared',
        description: 'All history entries have been removed.',
        variant: 'success',
      })
      await loadHistory()
    } catch (e: any) {
      pushToast({
        title: 'Clear failed',
        description: e?.message ?? 'Unknown error',
        variant: 'error',
      })
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'rounded-lg border px-4 py-2.5 text-sm w-80 bg-white shadow-md',
              t.variant === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : t.variant === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-slate-200 bg-white text-slate-900',
            ].join(' ')}
            role="status"
            aria-live="polite"
          >
            <div className="font-medium">{t.title}</div>
            {t.description ? <div className="text-slate-600">{t.description}</div> : null}
          </div>
        ))}
      </div>

      <header className="mx-auto px-6 sm:px-8 pt-5 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          CPM Configuration
        </h1>
        <p className="mt-2 text-slate-600">
          View the active CPM, update the rate, and manage history.
        </p>
      </header>

      <main className="mx-auto  px-6 sm:px-8 pb-20 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Card */}
          <section className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">Active Configuration</h2>
                <p className="text-sm text-slate-600">Current CPM rate and details</p>
              </div>
              <div className="p-6">
                {active.loading ? (
                  <div className="space-y-4">
                    <div className="h-5 w-48 bg-slate-100 animate-pulse rounded" />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="h-20 bg-slate-100 animate-pulse rounded" />
                      <div className="h-20 bg-slate-100 animate-pulse rounded" />
                    </div>
                  </div>
                ) : active.error || !active.data ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-red-700">Unable to load active configuration.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-medium">
                          Active
                        </span>
                        <div className="text-2xl font-semibold text-slate-900">
                          CPM: <span className="tabular-nums">{formatRate(active.data.cpm_rate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-200 p-4">
                        <div className="text-xs text-slate-600">Admin</div>
                        <div className="mt-1 font-medium text-slate-900">
                          {active.data.admin?.username ?? '—'}
                        </div>
                        <div className="text-sm text-slate-600">
                          {active.data.admin?.email ?? '—'}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 p-4">
                        <div className="text-xs text-slate-600">Timestamps</div>
                        <div className="mt-1 text-sm text-slate-900">
                          Created: {formatDate(active.data.created_at)}
                        </div>
                        <div className="text-sm text-slate-900">
                          Updated: {formatDate(active.data.updated_at)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Update Card */}
          <section className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">Update CPM</h2>
                <p className="text-sm text-slate-600">Set a new CPM rate</p>
              </div>
              <div className="p-6">
                <form onSubmit={onUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="cpm" className="text-sm font-medium text-slate-800">
                      CPM Rate
                    </label>
                    <input
                      id="cpm"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 3.50"
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={rateInput}
                      onChange={(e) => setRateInput(e.target.value)}
                      aria-describedby="cpm-help"
                    />
                    <p id="cpm-help" className="text-xs text-slate-600">
                      Enter a positive number. This creates a new active configuration.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updating}
                      className={[
                        'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm',
                        'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
                        'focus:outline-none focus:ring-2 focus:ring-purple-400/40',
                        updating ? 'opacity-60 cursor-not-allowed' : '',
                      ].join(' ')}
                    >
                      {updating ? 'Updating…' : 'Update'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>

        {/* History */}
        <section>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">History</h2>
                <p className="text-sm text-slate-600">Previous configuration entries</p>
              </div>
              <button
                type="button"
                onClick={onClearHistory}
                disabled={clearing || history.loading || historyItems.length === 0}
                className={[
                  'inline-flex items-center rounded-lg px-3.5 py-2 text-xs font-semibold',
                  'border border-red-300 text-red-700 hover:bg-red-50',
                  'focus:outline-none focus:ring-2 focus:ring-red-200',
                  (clearing || history.loading || historyItems.length === 0) ? 'opacity-60 cursor-not-allowed' : '',
                ].join(' ')}
                title="Clear all history"
              >
                {clearing ? 'Clearing…' : 'Clear history'}
              </button>
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3">ID</th>
                    <th className="text-left font-semibold px-4 py-3">CPM</th>
                    <th className="text-left font-semibold px-4 py-3">Admin</th>
                    <th className="text-left font-semibold px-4 py-3">Created</th>
                    <th className="text-left font-semibold px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {history.loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-t border-slate-200">
                        <td className="px-4 py-3">
                          <div className="h-4 w-10 bg-slate-100 animate-pulse rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-14 bg-slate-100 animate-pulse rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-40 bg-slate-100 animate-pulse rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-40 bg-slate-100 animate-pulse rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-40 bg-slate-100 animate-pulse rounded" />
                        </td>
                      </tr>
                    ))
                  ) : historyItems.length === 0 ? (
                    <tr className="border-t border-slate-200">
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-600">
                        No history yet.
                      </td>
                    </tr>
                  ) : (
                    historyItems.map((cfg) => (
                      <tr key={cfg.id} className="border-t border-slate-200 hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-mono">{cfg.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded border border-slate-300 px-2.5 py-0.5 text-xs text-slate-900">
                              {formatRate(cfg.cpm_rate)}
                            </span>
                            {cfg.is_active ? (
                              <span className="inline-flex items-center rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-medium">
                                Active
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="truncate max-w-xs">
                            <span className="font-medium text-slate-900">{cfg.admin?.username ?? '—'}</span>
                            <span className="text-slate-600"> · {cfg.admin?.email ?? '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">{formatDate(cfg.created_at)}</td>
                        <td className="px-4 py-3 text-slate-900">{formatDate(cfg.updated_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
