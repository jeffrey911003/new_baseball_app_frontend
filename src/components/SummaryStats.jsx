import { Typography } from 'antd'

const { Text } = Typography

const STAT_KEYS = [
  { key: 'total',      label: 'Pitches', format: v => v,       color: '#e6edf3' },
  { key: 'strikeRate', label: 'Strike%', format: v => `${v}%`, color: '#e3b341' },
  { key: 'swingRate',  label: 'Swing%',  format: v => `${v}%`, color: '#58a6ff' },
  { key: 'whiffRate',  label: 'Whiff%',  format: v => `${v}%`, color: '#ff6b6b' },
  { key: 'cswRate',    label: 'CSW%',    format: v => `${v}%`, color: '#bc8cff' },
  { key: 'babip',      label: 'BABIP%',  format: v => `${v}%`, color: '#3fb950' },
]

// Single set: 6 cards in a row
function SingleStats({ stats }) {
  if (!stats) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
      {STAT_KEYS.map(({ key, label, format, color }) => (
        <div key={key} style={{
          background: '#161b22', border: '1px solid #21262d',
          borderRadius: 8, padding: '12px 16px', textAlign: 'center',
        }}>
          <div style={{
            fontSize: 10, color: '#484f58', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: 6,
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>
            {label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
            {format(stats[key])}
          </div>
        </div>
      ))}
    </div>
  )
}

// Multiple sets: table layout
function ComparisonStats({ setsData }) {
  return (
    <div style={{
      background: '#161b22', border: '1px solid #21262d',
      borderRadius: 8, marginBottom: 16, overflow: 'hidden',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(6, 1fr)', borderBottom: '1px solid #21262d' }}>
        <div style={{ padding: '8px 14px' }} />
        {STAT_KEYS.map(({ key, label }) => (
          <div key={key} style={{
            padding: '8px 4px', textAlign: 'center',
            fontSize: 10, color: '#484f58', textTransform: 'uppercase',
            letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif",
          }}>
            {label}
          </div>
        ))}
      </div>

      {setsData.map(set => (
        <div
          key={set.id}
          style={{
            display: 'grid', gridTemplateColumns: '120px repeat(6, 1fr)',
            borderBottom: '1px solid #21262d',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: set.color, flexShrink: 0 }} />
            <Text style={{ fontSize: 12, fontWeight: 700, color: set.color }}>{set.name}</Text>
          </div>
          {STAT_KEYS.map(({ key, format, color }) => (
            <div key={key} style={{ padding: '10px 4px', textAlign: 'center' }}>
              <Text style={{
                fontSize: 18, fontWeight: 700,
                color: set.summaryStats ? color : '#484f58',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {set.summaryStats ? format(set.summaryStats[key]) : '—'}
              </Text>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function SummaryStats({ setsData }) {
  if (!setsData?.length) return null
  if (setsData.length === 1) return <SingleStats stats={setsData[0].summaryStats} />
  return <ComparisonStats setsData={setsData} />
}
