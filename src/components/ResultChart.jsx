import { Typography } from 'antd'
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

const { Text } = Typography

const RESULT_CONFIG = {
  ball:            { label: 'Ball',            color: '#58a6ff' },
  called_strike:   { label: 'Called Strike',   color: '#e3b341' },
  swinging_strike: { label: 'Swinging Strike', color: '#ff6b6b' },
  foul:            { label: 'Foul',            color: '#484f58' },
  in_play_out:     { label: 'In Play — Out',   color: '#3fb950' },
  in_play_hit:     { label: 'In Play — Hit',   color: '#56d364' },
}
const RESULT_ORDER = ['ball', 'called_strike', 'swinging_strike', 'foul', 'in_play_out', 'in_play_hit']

const Title = () => (
  <Text style={{
    display: 'block', color: '#e6edf3', fontSize: 13, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16,
    fontFamily: "'Barlow Condensed', sans-serif",
  }}>
    Pitch Outcomes
  </Text>
)

// Single set: colored bars
function SingleChart({ data }) {
  const chartData = data.map(d => ({
    ...d,
    name: RESULT_CONFIG[d.result]?.label || d.result,
    color: RESULT_CONFIG[d.result]?.color || '#484f58',
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: 6, padding: '8px 12px' }}>
        <div style={{ fontWeight: 700, color: '#e6edf3', fontSize: 13, marginBottom: 2 }}>{d.name}</div>
        <div style={{ color: '#8b949e', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
          {d.pct}% · {d.count} pitches
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 52, left: 114, bottom: 0 }}>
        <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`}
          tick={{ fontSize: 11, fill: '#484f58', fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={{ stroke: '#21262d' }} tickLine={false} />
        <YAxis type="category" dataKey="name"
          tick={{ fontSize: 12, fill: '#8b949e' }} axisLine={false} tickLine={false} width={112} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {chartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
          <LabelList dataKey="pct" position="right" formatter={v => `${v}%`}
            style={{ fontSize: 12, fill: '#8b949e', fontFamily: 'JetBrains Mono, monospace' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Multiple sets: grouped bars
function ComparisonChart({ setsData }) {
  const chartData = RESULT_ORDER.map(result => {
    const obj = { result, name: RESULT_CONFIG[result]?.label || result }
    setsData.forEach(set => {
      const found = set.resultData.find(d => d.result === result)
      obj[set.name] = found?.pct || 0
      obj[`${set.name}_count`] = found?.count || 0
    })
    return obj
  }).filter(d => setsData.some(set => d[set.name] > 0))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: 6, padding: '8px 12px' }}>
        <div style={{ fontWeight: 700, color: '#e6edf3', fontSize: 13, marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} style={{ color: '#8b949e', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>
            <span style={{ color: p.fill, fontWeight: 700 }}>{p.dataKey}</span>: {p.value}%
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 52, left: 114, bottom: 0 }}>
        <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`}
          tick={{ fontSize: 11, fill: '#484f58', fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={{ stroke: '#21262d' }} tickLine={false} />
        <YAxis type="category" dataKey="name"
          tick={{ fontSize: 12, fill: '#8b949e' }} axisLine={false} tickLine={false} width={112} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        {setsData.map(set => (
          <Bar key={set.id} dataKey={set.name} fill={set.color} fillOpacity={0.85}
            radius={[0, 3, 3, 0]} maxBarSize={18} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function ResultChart({ setsData }) {
  const isEmpty = !setsData?.length || setsData.every(s => !s.resultData?.length)

  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: '16px' }}>
      <Title />
      {isEmpty ? (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#484f58' }}>
          No data
        </div>
      ) : setsData.length === 1 ? (
        <SingleChart data={setsData[0].resultData} />
      ) : (
        <ComparisonChart setsData={setsData} />
      )}
    </div>
  )
}
