'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string
  order_id: string | null
  nama_usaha: string | null
  jenis_usaha: string | null
  kota_usaha: string | null
  omzet_per_bulan: string | null
  jumlah_karyawan: string | null
  punya_nib: boolean | null
  nama_owner: string | null
  kontak_email: string | null
  kontak_telepon: string | null
  lead_source: string | null
  status: string
  partner_assigned: string | null
  notes: string | null
  created_at: string
  contacted_at: string | null
  converted_at: string | null
}

type LeadStatus = 'all' | 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_LEADS: Lead[] = [
  {
    id: 'demo-1', order_id: 'KUR-2026-001', nama_usaha: 'Toko Makmur Jaya', jenis_usaha: 'Perdagangan',
    kota_usaha: 'Jakarta Selatan', omzet_per_bulan: '5-20jt', jumlah_karyawan: '1-5',
    punya_nib: true, nama_owner: 'Budi Santoso', kontak_email: 'budi@example.com',
    kontak_telepon: '081234567890', lead_source: 'kur_wizard_lendana', status: 'new',
    partner_assigned: null, notes: null, created_at: new Date().toISOString(),
    contacted_at: null, converted_at: null,
  },
  {
    id: 'demo-2', order_id: 'KUR-2026-002', nama_usaha: 'Warung Bu Siti', jenis_usaha: 'Kuliner',
    kota_usaha: 'Surabaya', omzet_per_bulan: '<5jt', jumlah_karyawan: '0',
    punya_nib: false, nama_owner: 'Siti Rahayu', kontak_email: 'siti@example.com',
    kontak_telepon: '082234567891', lead_source: 'kur_wizard_lendana', status: 'contacted',
    partner_assigned: 'lendana', notes: 'Sudah dihubungi via WA', created_at: new Date(Date.now() - 86400000).toISOString(),
    contacted_at: new Date(Date.now() - 43200000).toISOString(), converted_at: null,
  },
  {
    id: 'demo-3', order_id: 'KUR-2026-003', nama_usaha: 'CV Maju Bersama', jenis_usaha: 'Manufaktur/Produksi',
    kota_usaha: 'Bandung', omzet_per_bulan: '20-50jt', jumlah_karyawan: '6-20',
    punya_nib: true, nama_owner: 'Ahmad Farhan', kontak_email: 'ahmad@example.com',
    kontak_telepon: '083334567892', lead_source: 'kur_wizard_lendana', status: 'qualified',
    partner_assigned: 'bri', notes: null, created_at: new Date(Date.now() - 172800000).toISOString(),
    contacted_at: new Date(Date.now() - 150000000).toISOString(), converted_at: null,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const OMZET_LABEL: Record<string, string> = {
  '<5jt': '< Rp 5 juta',
  '5-20jt': 'Rp 5–20 juta',
  '20-50jt': 'Rp 20–50 juta',
  '>50jt': '> Rp 50 juta',
}

const KARYAWAN_LABEL: Record<string, string> = {
  '0': 'Solo',
  '1-5': '1–5 orang',
  '6-20': '6–20 orang',
  '>20': '> 20 orang',
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: 'rgba(155,138,251,0.15)', color: '#4B3FAF', label: '🆕 Baru' },
  contacted: { bg: 'rgba(255,209,102,0.2)', color: '#9A6F00', label: '📞 Dihubungi' },
  qualified: { bg: 'rgba(13,27,62,0.08)', color: '#3D4F7C', label: '✅ Qualified' },
  converted: { bg: 'rgba(6,214,160,0.15)', color: '#028A66', label: '🎉 Converted' },
  lost: { bg: 'rgba(255,77,109,0.1)', color: '#CC1830', label: '❌ Lost' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { bg: '#F0F0F0', color: '#666', label: status }
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(13,27,62,0.08)', boxShadow: '0 2px 8px rgba(13,27,62,0.06)' }}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs font-semibold mb-1" style={{ color: '#9BA3C4' }}>{label}</p>
      <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState<LeadStatus>('all')
  const [isDemo, setIsDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadLeads = useCallback(async () => {
    setLoading(true)
    try {
      const url = statusFilter === 'all' ? '/api/leads?limit=100' : `/api/leads?status=${statusFilter}&limit=100`
      const res = await fetch(url)
      const json = await res.json()
      if (json.isDemo) {
        setLeads(DEMO_LEADS)
        setIsDemo(true)
      } else {
        setLeads(json.leads || [])
        setIsDemo(false)
      }
    } catch {
      setLeads(DEMO_LEADS)
      setIsDemo(true)
    }
    setLoading(false)
  }, [statusFilter])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  async function markAsContacted(lead: Lead) {
    if (lead.status === 'contacted' || lead.status === 'converted') return
    setUpdatingId(lead.id)
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: 'contacted' }),
      })
      if (res.ok) {
        setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status: 'contacted', contacted_at: new Date().toISOString() } : l))
      }
    } catch (e) {
      console.error('Failed to update lead:', e)
    }
    setUpdatingId(null)
  }

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  }

  // Filtered leads for table
  const filteredLeads = statusFilter === 'all' ? leads : leads.filter((l) => l.status === statusFilter)

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: '#F8F9FF' }}>
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin/dashboard" className="text-xs font-semibold" style={{ color: '#6B7FA8' }}>
                ← Admin Dashboard
              </Link>
            </div>
            <h1 className="font-jakarta text-3xl font-extrabold mt-2" style={{ color: '#0D1B3E' }}>
              🏦 KUR Lead CRM
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6B7FA8' }}>
              {isDemo
                ? 'Demo data — Supabase belum dikonfigurasi'
                : 'Leads dari KUR wizard yang opt-in dibantu proses pengajuan'}
            </p>
            {isDemo && (
              <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,77,109,0.1)', color: '#FF4D6D' }}>
                Demo Data
              </span>
            )}
          </div>
          <button
            onClick={loadLeads}
            className="text-xs font-bold px-4 py-2 rounded-xl"
            style={{ background: 'rgba(13,27,62,0.06)', color: '#3D4F7C', border: 'none', cursor: 'pointer' }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <StatCard label="Total Leads" value={stats.total} color="#0D1B3E" icon="📋" />
          <StatCard label="Baru" value={stats.new} color="#4B3FAF" icon="🆕" />
          <StatCard label="Dihubungi" value={stats.contacted} color="#9A6F00" icon="📞" />
          <StatCard label="Qualified" value={stats.qualified} color="#3D4F7C" icon="✅" />
          <StatCard label="Converted" value={stats.converted} color="#028A66" icon="🎉" />
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'new', 'contacted', 'qualified', 'converted', 'lost'] as LeadStatus[]).map((s) => {
            const cfg = s === 'all'
              ? { label: `Semua (${leads.length})` }
              : { label: `${STATUS_CONFIG[s]?.label || s} (${leads.filter((l) => l.status === s).length})` }
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
                style={{
                  background: statusFilter === s ? '#0D1B3E' : 'white',
                  color: statusFilter === s ? 'white' : '#3D4F7C',
                  border: '1.5px solid',
                  borderColor: statusFilter === s ? '#0D1B3E' : 'rgba(13,27,62,0.12)',
                  cursor: 'pointer',
                }}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>

        {/* Leads table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">⏳</div>
            <p style={{ color: '#6B7FA8' }}>Memuat leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 rounded-3xl" style={{ background: 'white', border: '1px solid rgba(13,27,62,0.08)' }}>
            <div className="text-4xl mb-3">📭</div>
            <p className="font-bold" style={{ color: '#0D1B3E' }}>Belum ada leads</p>
            <p className="text-sm mt-1" style={{ color: '#6B7FA8' }}>
              {statusFilter === 'all' ? 'Leads akan muncul di sini saat pengguna opt-in di wizard KUR.' : `Tidak ada lead dengan status "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(13,27,62,0.08)', boxShadow: '0 2px 12px rgba(13,27,62,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F8F9FF' }}>
                    <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: '#9BA3C4' }}>Usaha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#9BA3C4' }}>Kota</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#9BA3C4' }}>Omzet</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#9BA3C4' }}>Kontak</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#9BA3C4' }}>Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#9BA3C4' }}>Tanggal</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#9BA3C4' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      style={{ borderTop: i > 0 ? '1px solid rgba(13,27,62,0.05)' : undefined }}
                    >
                      {/* Usaha */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-sm" style={{ color: '#0D1B3E' }}>{lead.nama_usaha || '-'}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9BA3C4' }}>{lead.jenis_usaha || '-'}</p>
                        {lead.punya_nib && (
                          <span className="text-xs font-semibold" style={{ color: '#028A66' }}>✓ NIB</span>
                        )}
                      </td>

                      {/* Kota */}
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: '#3D4F7C' }}>{lead.kota_usaha || '-'}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9BA3C4' }}>{KARYAWAN_LABEL[lead.jumlah_karyawan || ''] || lead.jumlah_karyawan || ''}</p>
                      </td>

                      {/* Omzet */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold" style={{ color: '#3D4F7C' }}>
                          {OMZET_LABEL[lead.omzet_per_bulan || ''] || lead.omzet_per_bulan || '-'}
                        </p>
                      </td>

                      {/* Kontak */}
                      <td className="px-4 py-4">
                        <p className="font-semibold text-sm" style={{ color: '#0D1B3E' }}>{lead.nama_owner || '-'}</p>
                        {lead.kontak_email && (
                          <a href={`mailto:${lead.kontak_email}`} className="text-xs block mt-0.5" style={{ color: '#FF4D6D', textDecoration: 'none' }}>
                            ✉ {lead.kontak_email}
                          </a>
                        )}
                        {lead.kontak_telepon && (
                          <a href={`https://wa.me/${lead.kontak_telepon.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs block mt-0.5" style={{ color: '#06D6A0', textDecoration: 'none' }}>
                            📱 {lead.kontak_telepon}
                          </a>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={lead.status} />
                        {lead.contacted_at && (
                          <p className="text-xs mt-1" style={{ color: '#9BA3C4' }}>
                            {formatDate(lead.contacted_at)}
                          </p>
                        )}
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-4">
                        <p className="text-xs" style={{ color: '#9BA3C4' }}>{formatDate(lead.created_at)}</p>
                        {lead.order_id && (
                          <p className="text-xs mt-0.5 font-mono" style={{ color: '#B8BDD6' }}>#{lead.order_id}</p>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-4 text-center">
                        {lead.status === 'new' ? (
                          <button
                            onClick={() => markAsContacted(lead)}
                            disabled={updatingId === lead.id}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                            style={{
                              background: updatingId === lead.id ? 'rgba(13,27,62,0.04)' : 'rgba(255,209,102,0.15)',
                              color: updatingId === lead.id ? '#9BA3C4' : '#9A6F00',
                              border: '1.5px solid',
                              borderColor: updatingId === lead.id ? 'rgba(13,27,62,0.08)' : 'rgba(255,209,102,0.4)',
                              cursor: updatingId === lead.id ? 'not-allowed' : 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {updatingId === lead.id ? '...' : '📞 Mark Contacted'}
                          </button>
                        ) : lead.status === 'contacted' ? (
                          <span className="text-xs" style={{ color: '#9BA3C4' }}>Sudah dihubungi</span>
                        ) : (
                          <span className="text-xs" style={{ color: '#9BA3C4' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 text-xs" style={{ color: '#9BA3C4', borderTop: '1px solid rgba(13,27,62,0.06)' }}>
              Menampilkan {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
              {statusFilter !== 'all' && ` dengan status "${statusFilter}"`}
            </div>
          </div>
        )}

        {/* SQL Setup note */}
        <div className="mt-6 rounded-2xl p-5" style={{ background: 'rgba(155,138,251,0.06)', border: '1px solid rgba(155,138,251,0.2)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: '#4B3FAF' }}>📋 Setup Database</p>
          <p className="text-xs" style={{ color: '#6B7FA8' }}>
            Jalankan <code style={{ fontFamily: 'monospace', background: 'rgba(155,138,251,0.12)', padding: '1px 5px', borderRadius: '4px' }}>docs/add-leads-table.sql</code> di Supabase SQL editor untuk mengaktifkan penyimpanan leads.
          </p>
        </div>
      </div>
    </div>
  )
}
