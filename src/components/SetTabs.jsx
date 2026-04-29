import { Typography } from 'antd'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function SetTabs({ sets, activeSetId, onSelect, onAdd, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '10px 14px', borderBottom: '1px solid #21262d',
      flexWrap: 'wrap',
    }}>
      {sets.map(set => {
        const active = set.id === activeSetId
        return (
          <div
            key={set.id}
            onClick={() => onSelect(set.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
              border: `1px solid ${active ? set.color : '#30363d'}`,
              background: active ? `${set.color}20` : 'transparent',
              color: active ? set.color : '#484f58',
              fontSize: 12, fontWeight: active ? 700 : 400,
              transition: 'all 0.15s', userSelect: 'none',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: set.color, flexShrink: 0 }} />
            <Text style={{ color: 'inherit', fontSize: 12, fontWeight: 'inherit' }}>{set.name}</Text>
            {sets.length > 1 && (
              <CloseOutlined
                onClick={e => { e.stopPropagation(); onRemove(set.id) }}
                style={{ fontSize: 9, color: '#484f58', marginLeft: 2 }}
              />
            )}
          </div>
        )
      })}

      {sets.length < 4 && (
        <div
          onClick={onAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
            border: '1px dashed #30363d', color: '#484f58',
            fontSize: 12, transition: 'all 0.15s', userSelect: 'none',
          }}
        >
          <PlusOutlined style={{ fontSize: 10 }} />
          Compare
        </div>
      )}
    </div>
  )
}
