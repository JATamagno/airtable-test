const TimelineMonthHeader = ({ monthMarkers, zoom, totalDays }) => {
  return (
    <div style={{ 
      height: '40px',
      background: '#f8f9fa',
      position: 'relative',
      borderBottom: '1px solid #e0e0e0',
      overflow: 'hidden'
    }}>
      {monthMarkers.map((month, index) => {
        const leftPercent = (month.startPosition / totalDays) * 100;
        const widthPercent = (month.daysInMonth / totalDays) * 100;
        
        return (
          <div
            key={`${month.year}-${month.month}`}
            style={{
              position: 'absolute',
              left: `${leftPercent * zoom}%`,
              width: `${widthPercent * zoom}%`,
              minWidth: `${Math.max(80, widthPercent * zoom)}px`,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              borderLeft: index > 0 ? '1px solid #d1d5db' : 'none',
              boxSizing: 'border-box'
            }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              lineHeight: '1.2'
            }}>
              <span style={{ fontSize: '13px' }}>
                {month.date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
              <span style={{ 
                fontSize: '11px', 
                color: '#6B7280',
                fontWeight: '400'
              }}>
                {month.daysInMonth} days
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineMonthHeader;
