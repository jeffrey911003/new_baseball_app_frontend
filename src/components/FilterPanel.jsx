import { Divider, Button, Typography, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

const { Text } = Typography


const PITCHER_LABEL_OPTIONS = [
  { value: 'Power', label: 'Power' },
  { value: 'Finesse', label: 'Finesse' },
  { value: 'Sinker', label: 'Sinker' }
]

const ALL_PITCH_TYPES = ['FF', 'SI', 'SL', 'CH', 'CU', 'FC', 'ST', 'FS']

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

const PITCH_TYPE_COLORS = {
  FF: '#f0883e', SI: '#e3b341', SL: '#58a6ff',
  CH: '#3fb950', CU: '#bc8cff', FC: '#ff6b6b',
  ST: '#d2a8ff', // 新增 Sweeper 的顏色
  FS: '#2da44e', // 新增 Splitter 的顏色
}

// ✨ 預先準備好 Statcast 時代 (2015起) 到未來的年份，全部使用字串確保與 game_date 匹配
const YEAR_OPTIONS = [
  '2025', '2024', '2023', '2022', '2021', 
  '2020', '2019', '2018', '2017', '2016', '2015'
]

const ZONE_GRID = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
const COUNT_ROWS = [
  [{ b: 0, s: 0 }, { b: 0, s: 1 }, { b: 0, s: 2 }],
  [{ b: 1, s: 0 }, { b: 1, s: 1 }, { b: 1, s: 2 }],
  [{ b: 2, s: 0 }, { b: 2, s: 1 }, { b: 2, s: 2 }],
  [{ b: 3, s: 0 }, { b: 3, s: 1 }, { b: 3, s: 2 }],
]

function SectionLabel({ children }) {
  return (
    <Text style={{
      display: 'block', fontSize: 10, fontWeight: 700, color: '#484f58',
      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8,
      fontFamily: "'Barlow Condensed', sans-serif",
    }}>
      {children}
    </Text>
  )
}

function Pill({ label, selected, onClick, color }) {
  const c = color || '#f0883e'
  return (
    <div
      onClick={onClick}
      style={{
        padding: '4px 12px', borderRadius: 4,
        border: `1px solid ${selected ? c : '#30363d'}`,
        background: selected ? `${c}25` : 'transparent',
        color: selected ? c : '#8b949e',
        cursor: 'pointer', fontSize: 12, fontWeight: selected ? 700 : 400,
        letterSpacing: '0.05em', userSelect: 'none', transition: 'all 0.15s',
      }}
    >
      {label}
    </div>
  )
}

// 用於處理「複選」的陣列按鈕
function TogglePills({ options, value, onChange, color }) {
  const toggle = (v) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v))
    else onChange([...value, v])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => (
        <Pill
          key={opt.value}
          label={opt.label}
          selected={value.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          color={color}
        />
      ))}
    </div>
  )
}

// 用於處理「單選」的字串按鈕 (專門給左右投、先發後援使用)
function SingleTogglePills({ options, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => (
        <Pill
          key={opt.value}
          label={opt.label}
          selected={value === opt.value} // 變成直接比對字串
          onClick={() => onChange(opt.value)} // 直接回傳點選的字串
          color={color}
        />
      ))}
    </div>
  )
}

function CountGrid({ selectedCounts, onChange }) {
  const toggle = (key) => {
    if (selectedCounts.includes(key)) onChange(selectedCounts.filter(c => c !== key))
    else onChange([...selectedCounts, key])
  }
  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 3, paddingLeft: 26 }}>
        {['0S', '1S', '2S'].map(s => (
          <div key={s} style={{
            width: 34, textAlign: 'center', fontSize: 10,
            color: '#484f58', fontFamily: 'JetBrains Mono, monospace',
          }}>{s}</div>
        ))}
      </div>
      {COUNT_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
          <div style={{
            width: 22, fontSize: 10, color: '#484f58',
            textAlign: 'right', marginRight: 4,
            fontFamily: 'JetBrains Mono, monospace',
          }}>{ri}B</div>
          {row.map(({ b, s }) => {
            const key = `${b}-${s}`
            const sel = selectedCounts.includes(key)
            return (
              <div
                key={key}
                onClick={() => toggle(key)}
                style={{
                  width: 32, height: 24, marginRight: 2, borderRadius: 3,
                  border: `1px solid ${sel ? '#f0883e' : '#30363d'}`,
                  background: sel ? 'rgba(240,136,62,0.2)' : '#161b22',
                  color: sel ? '#f0883e' : '#484f58',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 10, fontWeight: sel ? 700 : 400,
                  userSelect: 'none', transition: 'all 0.12s',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {b}-{s}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function ZoneSelector({ selectedZones, onChange }) {
  const toggle = (zone) => {
    if (selectedZones.includes(zone)) onChange(selectedZones.filter(z => z !== zone))
    else onChange([...selectedZones, zone])
  }
  return (
    <div style={{ display: 'inline-block', border: '2px solid #30363d', borderRadius: 4, overflow: 'hidden' }}>
      {ZONE_GRID.map((row, ri) => (
        <div key={ri} style={{ display: 'flex' }}>
          {row.map(zone => {
            const sel = selectedZones.includes(zone)
            return (
              <div
                key={zone}
                onClick={() => toggle(zone)}
                style={{
                  width: 40, height: 40, border: '1px solid #21262d',
                  background: sel ? 'rgba(240,136,62,0.2)' : '#161b22',
                  color: sel ? '#f0883e' : '#484f58',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  userSelect: 'none', transition: 'all 0.12s',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {zone}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function FilterPanel({ filters, pitchers = [], onChange, onReset }) {
  const set = (key) => (val) => onChange(f => ({ ...f, [key]: val }))

  const uniquePitchers = Array.from(new Map(pitchers.map(p => [String(p.id), p])).values());

  const pitcherOptions = uniquePitchers.map(p => ({
    value: String(p.id),
    label: p.name,
  }))

  return (
    <div style={{ padding: '16px 14px', color: '#e6edf3' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={{ color: '#484f58', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Filters
        </Text>
        <Button
          size="small" type="text" icon={<ReloadOutlined />} onClick={onReset}
          style={{ color: '#484f58', fontSize: 11 }}
        >
          Reset
        </Button>
      </div>

      <SectionLabel>Season</SectionLabel>
      {/* 🚀 修正關鍵：原本這裡用 season，現在統一改成 year 才能跟 App.jsx 對接 */}
      <SingleTogglePills   
        options={[
          { value: '', label: 'ALL' },
          ...YEAR_OPTIONS.map(year => ({ value: year, label: year }))
        ]}
        value={filters.year}        
        onChange={set('year')}      
      />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher</SectionLabel>
      <Select
        mode="multiple"
        allowClear
        showSearch
        placeholder="Search by name..."
        value={filters.pitcherIds}
        onChange={(val) => onChange(f => ({ ...f, pitcherIds: val, ...(val.length > 0 ? { pitcherHands: '', pitcherLabels: [] } : {}) }))}
        options={pitcherOptions}
        style={{ width: '100%', marginBottom: 8 }}
        maxTagCount={2}
        filterOption={(input, option) =>
          (option?.label || '').toLowerCase().includes(input.toLowerCase())
        }
      />
      <div style={{ opacity: filters.pitcherIds?.length > 0 ? 0.3 : 1, pointerEvents: filters.pitcherIds?.length > 0 ? 'none' : 'auto' }}>
        <div style={{ marginBottom: 4 }}>
          <Text style={{ fontSize: 10, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            or filter by label
          </Text>
        </div>
        <TogglePills
          options={PITCHER_LABEL_OPTIONS}
          value={filters.pitcherLabels}
          onChange={set('pitcherLabels')}
          color='#bc8cff'
        />
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher Hand</SectionLabel>
      <div style={{ opacity: filters.pitcherIds?.length > 0 ? 0.3 : 1, pointerEvents: filters.pitcherIds?.length > 0 ? 'none' : 'auto' }}>
        <SingleTogglePills
          options={[
            { value: '', label: 'ALL' },
            { value: 'R', label: 'RHP' },
            { value: 'L', label: 'LHP' }
          ]}
          value={filters.pitcherHands}
          onChange={set('pitcherHands')}
        />
      </div>
      
      <div style={{ marginTop: 10 }}>
        <SectionLabel>Pitcher Role</SectionLabel>
        <SingleTogglePills
          options={[
            { value: 'All', label: 'ALL' },
            { value: 'SP', label: 'Starter' },
            { value: 'RP', label: 'Reliever' }
          ]}
          value={filters.pitcherRole}
          onChange={set('pitcherRole')}
        />
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Count</SectionLabel>
      <CountGrid selectedCounts={filters.counts} onChange={set('counts')} />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitch Type</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ALL_PITCH_TYPES.map(pt => {
          const sel = filters.pitchTypes.includes(pt)
          return (
            <div
              key={pt}
              onClick={() => {
                if (sel) set('pitchTypes')(filters.pitchTypes.filter(t => t !== pt))
                else set('pitchTypes')([...filters.pitchTypes, pt])
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 8px', borderRadius: 4,
                border: `1px solid ${sel ? PITCH_TYPE_COLORS[pt] : 'transparent'}`,
                background: sel ? `${PITCH_TYPE_COLORS[pt]}18` : 'transparent',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: PITCH_TYPE_COLORS[pt] || '#484f58', flexShrink: 0 }} />
              <Text style={{ fontSize: 12, color: sel ? '#e6edf3' : '#8b949e', fontWeight: sel ? 600 : 400 }}>
                <span style={{ fontWeight: 700, marginRight: 4 }}>{pt}</span>
                {PITCH_TYPE_LABELS[pt]}
              </Text>
            </div>
          )
        })}
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Zone</SectionLabel>
      <ZoneSelector selectedZones={filters.zones} onChange={set('zones')} />
      <Text style={{ display: 'block', fontSize: 10, color: '#484f58', marginTop: 4 }}>
        Click to select zones
      </Text>
    </div>
  )
}