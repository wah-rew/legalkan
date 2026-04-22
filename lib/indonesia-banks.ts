export interface Bank {
  id: string
  name: string       // full name: "Bank Central Asia (BCA)"
  shortName: string  // "BCA"
  category: 'Bank BUMN' | 'Bank Swasta' | 'Bank Syariah' | 'Bank Daerah' | 'Bank Digital' | 'Bank Asing'
}

export const INDONESIA_BANKS: Bank[] = [
  // ── Bank BUMN ──
  { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)', shortName: 'BRI', category: 'Bank BUMN' },
  { id: 'bni', name: 'Bank Negara Indonesia (BNI)', shortName: 'BNI', category: 'Bank BUMN' },
  { id: 'mandiri', name: 'Bank Mandiri', shortName: 'Mandiri', category: 'Bank BUMN' },
  { id: 'btn', name: 'Bank Tabungan Negara (BTN)', shortName: 'BTN', category: 'Bank BUMN' },
  { id: 'bsi', name: 'Bank Syariah Indonesia (BSI)', shortName: 'BSI', category: 'Bank BUMN' },

  // ── Bank Swasta Nasional ──
  { id: 'bca', name: 'Bank Central Asia (BCA)', shortName: 'BCA', category: 'Bank Swasta' },
  { id: 'cimb', name: 'CIMB Niaga', shortName: 'CIMB Niaga', category: 'Bank Swasta' },
  { id: 'danamon', name: 'Bank Danamon', shortName: 'Danamon', category: 'Bank Swasta' },
  { id: 'permata', name: 'Bank Permata', shortName: 'Permata', category: 'Bank Swasta' },
  { id: 'panin', name: 'Bank Panin', shortName: 'Panin', category: 'Bank Swasta' },
  { id: 'ocbc', name: 'OCBC Indonesia', shortName: 'OCBC', category: 'Bank Swasta' },
  { id: 'maybank', name: 'Maybank Indonesia', shortName: 'Maybank', category: 'Bank Swasta' },
  { id: 'uob', name: 'UOB Indonesia', shortName: 'UOB', category: 'Bank Swasta' },
  { id: 'mega', name: 'Bank Mega', shortName: 'Mega', category: 'Bank Swasta' },
  { id: 'bukopin', name: 'Bank Bukopin', shortName: 'Bukopin', category: 'Bank Swasta' },
  { id: 'sinarmas', name: 'Bank Sinarmas', shortName: 'Sinarmas', category: 'Bank Swasta' },
  { id: 'btpn', name: 'Bank BTPN', shortName: 'BTPN', category: 'Bank Swasta' },
  { id: 'bsmd', name: 'Bank Sahabat Sampoerna', shortName: 'Sahabat Sampoerna', category: 'Bank Swasta' },
  { id: 'artha', name: 'Bank Artha Graha', shortName: 'Artha Graha', category: 'Bank Swasta' },
  { id: 'bnp', name: 'Bank Nationalnobu (Nobu)', shortName: 'Nobu', category: 'Bank Swasta' },
  { id: 'ccb', name: 'Bank China Construction Bank Indonesia', shortName: 'CCB Indonesia', category: 'Bank Swasta' },
  { id: 'mayapada', name: 'Bank Mayapada', shortName: 'Mayapada', category: 'Bank Swasta' },
  { id: 'mestika', name: 'Bank Mestika Dharma', shortName: 'Mestika', category: 'Bank Swasta' },
  { id: 'bumi_arta', name: 'Bank Bumi Arta', shortName: 'Bumi Arta', category: 'Bank Swasta' },
  { id: 'index', name: 'Bank Index Selindo', shortName: 'Bank Index', category: 'Bank Swasta' },
  { id: 'victoria', name: 'Bank Victoria International', shortName: 'Bank Victoria', category: 'Bank Swasta' },
  { id: 'capital', name: 'Bank Capital Indonesia', shortName: 'Bank Capital', category: 'Bank Swasta' },
  { id: 'mnc', name: 'Bank MNC International', shortName: 'Bank MNC', category: 'Bank Swasta' },
  { id: 'ina', name: 'Bank Ina Perdana', shortName: 'Bank Ina', category: 'Bank Swasta' },
  { id: 'prima', name: 'Bank Prima Master', shortName: 'Bank Prima', category: 'Bank Swasta' },
  { id: 'multiarta', name: 'Bank Multi Arta Sentosa', shortName: 'Bank MAS', category: 'Bank Swasta' },
  { id: 'fama', name: 'Bank Fama International', shortName: 'Fama', category: 'Bank Swasta' },

  // ── Bank Syariah ──
  { id: 'muamalat', name: 'Bank Muamalat Indonesia', shortName: 'Muamalat', category: 'Bank Syariah' },
  { id: 'mega_syariah', name: 'Bank Mega Syariah', shortName: 'Mega Syariah', category: 'Bank Syariah' },
  { id: 'cimb_syariah', name: 'CIMB Niaga Syariah', shortName: 'CIMB Syariah', category: 'Bank Syariah' },
  { id: 'bca_syariah', name: 'BCA Syariah', shortName: 'BCA Syariah', category: 'Bank Syariah' },
  { id: 'btpn_syariah', name: 'Bank BTPN Syariah', shortName: 'BTPN Syariah', category: 'Bank Syariah' },
  { id: 'bukopin_syariah', name: 'Bank Bukopin Syariah', shortName: 'Bukopin Syariah', category: 'Bank Syariah' },
  { id: 'panin_syariah', name: 'Bank Panin Dubai Syariah', shortName: 'Panin Syariah', category: 'Bank Syariah' },
  { id: 'net_syariah', name: 'Bank Net Indonesia Syariah', shortName: 'Bank Net Syariah', category: 'Bank Syariah' },
  { id: 'aladin', name: 'Bank Aladin Syariah', shortName: 'Aladin Syariah', category: 'Bank Syariah' },

  // ── Bank Asing ──
  { id: 'hsbc', name: 'HSBC Indonesia', shortName: 'HSBC', category: 'Bank Asing' },
  { id: 'sc', name: 'Standard Chartered Indonesia', shortName: 'Standard Chartered', category: 'Bank Asing' },
  { id: 'citibank', name: 'Citibank Indonesia', shortName: 'Citibank', category: 'Bank Asing' },
  { id: 'deutsche', name: 'Deutsche Bank Indonesia', shortName: 'Deutsche Bank', category: 'Bank Asing' },
  { id: 'bnp_paribas', name: 'BNP Paribas Indonesia', shortName: 'BNP Paribas', category: 'Bank Asing' },
  { id: 'bangkok', name: 'Bangkok Bank Indonesia', shortName: 'Bangkok Bank', category: 'Bank Asing' },
  { id: 'boc', name: 'Bank of China Indonesia', shortName: 'Bank of China', category: 'Bank Asing' },
  { id: 'icbc', name: 'ICBC Indonesia', shortName: 'ICBC', category: 'Bank Asing' },
  { id: 'jpmorgan', name: 'JP Morgan Chase Indonesia', shortName: 'JP Morgan', category: 'Bank Asing' },
  { id: 'mizuho', name: 'Mizuho Bank Indonesia', shortName: 'Mizuho', category: 'Bank Asing' },
  { id: 'mufg', name: 'MUFG Bank Indonesia', shortName: 'MUFG', category: 'Bank Asing' },
  { id: 'smbc', name: 'Sumitomo Mitsui Banking Corp Indonesia', shortName: 'SMBC', category: 'Bank Asing' },
  { id: 'woori', name: 'Woori Bank Indonesia', shortName: 'Woori', category: 'Bank Asing' },
  { id: 'keb_hana', name: 'KEB Hana Bank Indonesia', shortName: 'KEB Hana', category: 'Bank Asing' },

  // ── Bank Daerah / BPD ──
  { id: 'bjb', name: 'Bank Jabar Banten (BJB)', shortName: 'BJB', category: 'Bank Daerah' },
  { id: 'bpd_jateng', name: 'BPD Jawa Tengah (Bank Jateng)', shortName: 'Bank Jateng', category: 'Bank Daerah' },
  { id: 'bpd_jatim', name: 'BPD Jawa Timur (Bank Jatim)', shortName: 'Bank Jatim', category: 'Bank Daerah' },
  { id: 'bank_dki', name: 'Bank DKI Jakarta', shortName: 'Bank DKI', category: 'Bank Daerah' },
  { id: 'bpd_bali', name: 'BPD Bali', shortName: 'BPD Bali', category: 'Bank Daerah' },
  { id: 'bpd_sulsel', name: 'BPD Sulawesi Selatan (Bank Sulselbar)', shortName: 'Bank Sulselbar', category: 'Bank Daerah' },
  { id: 'bpd_sumut', name: 'BPD Sumatera Utara (Bank Sumut)', shortName: 'Bank Sumut', category: 'Bank Daerah' },
  { id: 'bpd_sumbar', name: 'BPD Sumatera Barat (Bank Nagari)', shortName: 'Bank Nagari', category: 'Bank Daerah' },
  { id: 'bpd_riau', name: 'BPD Riau Kepri (Bank Riau Kepri)', shortName: 'Bank Riau Kepri', category: 'Bank Daerah' },
  { id: 'bpd_diy', name: 'BPD DIY (Bank BPD DIY)', shortName: 'BPD DIY', category: 'Bank Daerah' },
  { id: 'bpd_kalbar', name: 'BPD Kalimantan Barat (Bank Kalbar)', shortName: 'Bank Kalbar', category: 'Bank Daerah' },
  { id: 'bpd_kalsel', name: 'BPD Kalimantan Selatan (Bank Kalsel)', shortName: 'Bank Kalsel', category: 'Bank Daerah' },
  { id: 'bpd_kaltim', name: 'BPD Kalimantan Timur (Bank Kaltimtara)', shortName: 'Bank Kaltimtara', category: 'Bank Daerah' },
  { id: 'bpd_kalteng', name: 'BPD Kalimantan Tengah (Bank Kalteng)', shortName: 'Bank Kalteng', category: 'Bank Daerah' },
  { id: 'bpd_ntb', name: 'BPD Nusa Tenggara Barat (Bank NTB Syariah)', shortName: 'Bank NTB Syariah', category: 'Bank Daerah' },
  { id: 'bpd_ntt', name: 'BPD Nusa Tenggara Timur (Bank NTT)', shortName: 'Bank NTT', category: 'Bank Daerah' },
  { id: 'bpd_sulut', name: 'BPD Sulawesi Utara (Bank SulutGo)', shortName: 'Bank SulutGo', category: 'Bank Daerah' },
  { id: 'bpd_sulteng', name: 'BPD Sulawesi Tengah (Bank Sulteng)', shortName: 'Bank Sulteng', category: 'Bank Daerah' },
  { id: 'bpd_sultra', name: 'BPD Sulawesi Tenggara (Bank Sultra)', shortName: 'Bank Sultra', category: 'Bank Daerah' },
  { id: 'bpd_maluku', name: 'BPD Maluku (Bank Maluku-Malut)', shortName: 'Bank Maluku-Malut', category: 'Bank Daerah' },
  { id: 'bpd_papua', name: 'BPD Papua (Bank Papua)', shortName: 'Bank Papua', category: 'Bank Daerah' },
  { id: 'bpd_aceh', name: 'BPD Aceh (Bank Aceh Syariah)', shortName: 'Bank Aceh Syariah', category: 'Bank Daerah' },
  { id: 'bpd_lampung', name: 'BPD Lampung (Bank Lampung)', shortName: 'Bank Lampung', category: 'Bank Daerah' },
  { id: 'bpd_sumsel', name: 'BPD Sumatera Selatan Babel (Bank Sumsel Babel)', shortName: 'Bank Sumsel Babel', category: 'Bank Daerah' },
  { id: 'bpd_jambi', name: 'BPD Jambi (Bank Jambi)', shortName: 'Bank Jambi', category: 'Bank Daerah' },
  { id: 'bpd_bengkulu', name: 'BPD Bengkulu (Bank Bengkulu)', shortName: 'Bank Bengkulu', category: 'Bank Daerah' },
  { id: 'bpd_gorontalo', name: 'BPD Gorontalo (Bank Sulut Gorontalo)', shortName: 'Bank Gorontalo', category: 'Bank Daerah' },

  // ── Bank Digital ──
  { id: 'jenius', name: 'Jenius (BTPN)', shortName: 'Jenius', category: 'Bank Digital' },
  { id: 'jago', name: 'Bank Jago', shortName: 'Jago', category: 'Bank Digital' },
  { id: 'blu', name: 'Blu by BCA Digital', shortName: 'Blu BCA', category: 'Bank Digital' },
  { id: 'seabank', name: 'SeaBank Indonesia', shortName: 'SeaBank', category: 'Bank Digital' },
  { id: 'neo', name: 'Neo Commerce Bank (Neo Bank)', shortName: 'Neo Bank', category: 'Bank Digital' },
  { id: 'allo', name: 'Allo Bank Indonesia', shortName: 'Allo Bank', category: 'Bank Digital' },
  { id: 'motion', name: 'Motion Bank (MNC Bank Digital)', shortName: 'Motion Bank', category: 'Bank Digital' },
  { id: 'superbank', name: 'Superbank Indonesia', shortName: 'Superbank', category: 'Bank Digital' },
  { id: 'raya', name: 'Bank Raya Indonesia', shortName: 'Bank Raya', category: 'Bank Digital' },
  { id: 'amar', name: 'Amar Bank (Tunaiku)', shortName: 'Amar Bank', category: 'Bank Digital' },
]

export const BANK_CATEGORIES = [
  'Bank BUMN',
  'Bank Swasta',
  'Bank Syariah',
  'Bank Daerah',
  'Bank Digital',
  'Bank Asing',
] as const

export type BankCategory = typeof BANK_CATEGORIES[number]
