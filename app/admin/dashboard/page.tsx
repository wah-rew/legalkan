'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  order_id: string
  contract_type: string
  contract_title: string | null
  amount: number
  status: string
  customer_name: string | null
  customer_email: string | null
  created_at: string
}

interface FeedbackRow {
  id: string
  order_id: string | null
  rating: number
  message: string | null
  created_at: string
}

interface Stats {
  totalOrders: number
  ordersToday: number
  revenueToday: number
  revenueMonth: number
  byType: Record<string, number>
}

// ─── Demo data (shown when Supabase is not configured) ───────────────────────

const DEMO_ORDERS: Order[] = [
  { order_id: 'LK-202604-1001', contract_type: 'freelancer', contract_title: 'Kontrak Jasa Freelancer', amount: 29000, status: 'paid', customer_name: 'Budi Santoso', customer_email: 'budi@example.com', created_at: new Date().toISOString() },
  { order_id: 'LK-202604-1002', contract_type: 'hutang-piutang', contract_title: 'Perjanjian Hutang Piutang', amount: 29000, status: 'delivered', customer_name: 'Siti Rahayu', customer_email: 'siti@example.com', created_at: new Date().toISOString() },
  { order_id: 'LK-202604-1003', contract_type: 'jual-beli', contract_title: 'Surat Perjanjian Jual Beli', amount: 29000, status: 'pending', customer_name: 'Ahmad Farhan', customer_email: 'ahmad@example.com', created_at: new Date(Date.now() - 86400000).toISOString() },
  { order_id: 'LK-202604-1004', contract_type: 'sewa-kendaraan', contract_title: 'Perjanjian Sewa Kendaraan', amount: 29000, status: 'paid', customer_name: 'Dewi Kusuma', customer_email: 'dewi@example.com', created_at: new Date(Date.now() - 86400000).toISOString() },
  { order_id: 'LK-202604-1005', contract_type: 'konsinyasi', contract_title: 'Perjanjian Konsinyasi', amount: 29000, status: 'delivered', customer_name: 'Rizky Pratama', customer_email: 'rizky@example.com', created_at: new Date(Date.now() - 172800000).toISOString() },
]

const DEMO_FEEDBACK: FeedbackRow[] = [
  { id: '1', order_id: 'LK-202604-1001', rating: 5, message: 'Proses cepat & dokumen sangat profesional!', created_at: new Date().toISOString() },
  { id: '2', order_id: 'LK-202604-1002', rating: 4, message: 'Bagus, tapi perlu lebih banyak pilihan kontrak', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', order_id: 'LK-202604-1005', rating: 5, message: 'Sangat membantu untuk bisnis saya!', created_at: new Date(Date.now() - 172800000).toISOString() },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending:   { bg: '#FFF9E6', color: '#9A6F00', label: 'Pending' },
    paid:      { bg: '#E6F4FF', color: '#0050AA', label: 'Paid' },
    delivered: { bg: '#D1FAF0', color: '#028A66', label: 'Delivered' },
    failed:    { bg: '#FFE6E9', color: '#CC1830', label: 'Failed' },
  }
  const s = map[status] || { bg: '#F0F0F0', color: '#666', label: status }
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#FFB800' : '#E0E0E0', fontSize: '14px' }}>★</span>
      ))}
    </span>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: string }) {
  return (
    <div
      className="rounded-2xl p-5 shadow-sm"
      style={{ background: 'white', border: '1px solid rgba(13,27,62,0.08)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-xs font-semibold mb-1" style={{ color: '#9BA3C4' }}>{label}</p>
      <p className="text-2xl font-extrabold" style={{ color: '#0D1B3E' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: '#9BA3C4' }}>{sub}</p>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [feedback, setFeedback] = useState<FeedbackRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!supabase) {
        // No Supabase configured — show demo data
        setOrders(DEMO_ORDERS)
        setFeedback(DEMO_FEEDBACK)
        computeStats(DEMO_ORDERS)
        setIsDemo(true)
        setLoading(false)
        return
      }

      try {
        const [ordersRes, feedbackRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(20),
        ])

        const allOrdersRes = await supabase.from('orders').select('order_id,amount,status,contract_type,created_at')

        const allOrders = (allOrdersRes.data || []) as Order[]
        setOrders((ordersRes.data || []) as Order[])
        setFeedback((feedbackRes.data || []) as FeedbackRow[])
        computeStats(allOrders)
      } catch {
        // Fallback to demo on error
        setOrders(DEMO_ORDERS)
        setFeedback(DEMO_FEEDBACK)
        computeStats(DEMO_ORDERS)
        setIsDemo(true)
      }

      setLoading(false)
    }

    function computeStats(allOrders: Order[]) {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      const paid = allOrders.filter(o => o.status === 'paid' || o.status === 'delivered')
      const today = paid.filter(o => o.created_at.startsWith(todayStr))
      const month = paid.filter(o => o.created_at.startsWith(monthStr))

      const byType: Record<string, number> = {}
      for (const o of allOrders) {
        byType[o.contract_type] = (byType[o.contract_type] || 0) + 1
      }

      setStats({
        totalOrders: allOrders.length,
        ordersToday: today.length,
        revenueToday: today.reduce((s, o) => s + o.amount, 0),
        revenueMonth: month.reduce((s, o) => s + o.amount, 0),
        byType,
      })
    }

    load()
  }, [])

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: '#F8F9FF' }}>
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: '#0D1B3E' }}>
              Admin Dashboard
            </h1>
            {isDemo && (
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,77,109,0.1)', color: '#FF4D6D' }}
              >
                Demo Data
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: '#6B7FA8' }}>
            {isDemo
              ? 'Supabase tidak dikonfigurasi — menampilkan data demo. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk data nyata.'
              : 'Overview pesanan dan aktivitas LegalKan'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">⏳</div>
            <p style={{ color: '#6B7FA8' }}>Memuat data...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Orders" value={String(stats.totalOrders)} icon="📋" />
                <StatCard label="Orders Hari Ini" value={String(stats.ordersToday)} icon="📅" />
                <StatCard label="Revenue Hari Ini" value={formatRp(stats.revenueToday)} icon="💰" />
                <StatCard label="Revenue Bulan Ini" value={formatRp(stats.revenueMonth)} icon="📈" />
              </div>
            )}

            {/* Orders by Contract Type */}
            {stats && Object.keys(stats.byType).length > 0 && (
              <div
                className="rounded-3xl p-6 mb-6 shadow-sm"
                style={{ background: 'white', border: '1px solid rgba(13,27,62,0.08)' }}
              >
                <h2 className="font-jakarta text-lg font-bold mb-4" style={{ color: '#0D1B3E' }}>
                  📊 Orders by Contract Type
                </h2>
                <div className="space-y-3">
                  {Object.entries(stats.byType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => {
                      const pct = Math.round((count / stats.totalOrders) * 100)
                      return (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span style={{ color: '#3D4F7C' }} className="font-semibold">{type}</span>
                            <span style={{ color: '#6B7FA8' }}>{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(13,27,62,0.07)' }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #FF4D6D, #FF8FA0)' }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Recent Orders Table */}
            <div
              className="rounded-3xl overflow-hidden mb-6 shadow-sm"
              style={{ background: 'white', border: '1px solid rgba(13,27,62,0.08)' }}
            >
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(13,27,62,0.06)' }}>
                <h2 className="font-jakarta text-lg font-bold" style={{ color: '#0D1B3E' }}>
                  🗂️ Recent Orders
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#F8F9FF', color: '#9BA3C4', fontSize: '11px' }}>
                      <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Type</th>
                      <th className="px-4 py-3 text-right font-semibold">Amount</th>
                      <th className="px-4 py-3 text-center font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((o, i) => (
                      <tr
                        key={o.order_id}
                        style={{
                          borderTop: i > 0 ? '1px solid rgba(13,27,62,0.05)' : undefined,
                        }}
                      >
                        <td className="px-6 py-3 font-mono text-xs" style={{ color: '#3D4F7C' }}>
                          {o.order_id}
                        </td>
                        <td className="px-4 py-3" style={{ color: '#6B7FA8' }}>
                          {o.contract_type}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold" style={{ color: '#0D1B3E' }}>
                          {formatRp(o.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {statusBadge(o.status)}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#9BA3C4' }}>
                          {formatDate(o.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="text-center py-10" style={{ color: '#9BA3C4' }}>
                    Belum ada orders
                  </div>
                )}
              </div>
            </div>

            {/* Recent Feedback */}
            <div
              className="rounded-3xl overflow-hidden shadow-sm"
              style={{ background: 'white', border: '1px solid rgba(13,27,62,0.08)' }}
            >
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(13,27,62,0.06)' }}>
                <h2 className="font-jakarta text-lg font-bold" style={{ color: '#0D1B3E' }}>
                  ⭐ Recent Feedback
                </h2>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(13,27,62,0.05)' }}>
                {feedback.slice(0, 10).map((f) => (
                  <div key={f.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <StarRating rating={f.rating} />
                      <span className="text-xs" style={{ color: '#9BA3C4' }}>{formatDate(f.created_at)}</span>
                    </div>
                    {f.message && (
                      <p className="text-sm mt-1" style={{ color: '#3D4F7C' }}>{f.message}</p>
                    )}
                    {f.order_id && (
                      <p className="text-xs mt-1 font-mono" style={{ color: '#B8BDD6' }}>#{f.order_id}</p>
                    )}
                  </div>
                ))}
                {feedback.length === 0 && (
                  <div className="text-center py-10" style={{ color: '#9BA3C4' }}>
                    Belum ada feedback
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
