import { Table, Typography } from 'antd'

const { Text } = Typography


const PITCH_TYPE_LABELS = {
  FF: 'Four-Seam FB',
  SI: 'Sinker',
  SL: 'Slider',
  CH: 'Changeup',
  CU: 'Curveball',
  FC: 'Cutter',
  ST: 'Sweeper', 
  FS: 'Splitter',
}

// 補上 ST 和 FS 的顏色
const PITCH_TYPE_COLORS = {
  FF: '#f0883e', SI: '#e3b341', SL: '#58a6ff',
  CH: '#3fb950', CU: '#bc8cff', FC: '#ff6b6b',
  ST: '#d2a8ff', 
  FS: '#2da44e', 
}

const mono = (color) => (v) => (
  <span style={{ color: color || '#8b949e', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{v}%</span>
)

const conditional = (hi, mid) => (v) => {
  const color = v >= hi ? '#ff6b6b' : v >= mid ? '#e3b341' : '#8b949e'
  return <span style={{ color, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{v}%</span>
}

const columns = [
  {
    title: 'PITCH',
    dataIndex: 'pitchType',
    render: (pt) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: PITCH_TYPE_COLORS[pt] || '#484f58', flexShrink: 0 }} />
        <span style={{ fontWeight: 700, color: '#e6edf3', fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>{pt}</span>
        <span style={{ color: '#484f58', fontSize: 11 }}>{PITCH_TYPE_LABELS[pt]}</span>
      </div>
    ),
  },
  {
    title: 'COUNT',
    dataIndex: 'count',
    sorter: (a, b) => a.count - b.count,
    render: v => <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8b949e', fontSize: 13 }}>{v}</span>,
    width: 80,
  },
  { title: 'USAGE%', dataIndex: 'pct', sorter: (a, b) => a.pct - b.pct, render: mono('#58a6ff'), width: 90 },
  { title: 'BALL%', dataIndex: 'ballPct', sorter: (a, b) => a.ballPct - b.ballPct, render: mono(), width: 80 },
  { title: 'CSW%', dataIndex: 'cswPct', sorter: (a, b) => a.cswPct - b.cswPct, render: conditional(30, 25), width: 80 },
  { title: 'WHIFF%', dataIndex: 'whiffPct', sorter: (a, b) => a.whiffPct - b.whiffPct, render: conditional(30, 20), width: 85 },
  { title: 'IN-PLAY%', dataIndex: 'inPlayPct', sorter: (a, b) => a.inPlayPct - b.inPlayPct, render: mono(), width: 90 },
  {
    title: 'HIT%',
    dataIndex: 'hitPct',
    sorter: (a, b) => a.hitPct - b.hitPct,
    render: (v) => <span style={{ color: v >= 8 ? '#ff6b6b' : '#8b949e', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{v}%</span>,
    width: 70,
  },
]

export default function PitchTypeTable({ data }) {
  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: '16px' }}>
      <Text style={{
        display: 'block', color: '#e6edf3', fontSize: 13, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
        fontFamily: "'Barlow Condensed', sans-serif",
      }}>
        Pitch Type Breakdown
      </Text>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="pitchType"
        pagination={false}
        size="small"
      />
    </div>
  )
}