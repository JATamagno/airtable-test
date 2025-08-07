import { formatDate } from '../utils';

const TimelineHeader = ({ 
  itemCount, 
  minDate, 
  maxDate, 
  zoom, 
  onZoomIn, 
  onZoomOut 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginBottom: '20px'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
          Project Timeline ✨
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>
          {itemCount} items • {formatDate(minDate.toISOString().split('T')[0])} - {formatDate(maxDate.toISOString().split('T')[0])}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          onClick={onZoomOut}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
          Zoom Out
        </button>
        <span style={{ fontSize: '14px', color: '#666', minWidth: '50px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={onZoomIn}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
        >
          Zoom In
        </button>
      </div>
    </div>
  );
};

export default TimelineHeader;
