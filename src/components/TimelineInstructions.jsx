const TimelineInstructions = () => {
  return (
    <div style={{ 
      marginTop: '20px', 
      fontSize: '14px', 
      color: '#666',
      background: '#f8f9fa',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '12px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#495057'
      }}>
        <span style={{ marginRight: '8px' }}>ℹ️</span>
        How to use the Timeline
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <span style={{ marginRight: '8px', fontSize: '16px' }}>🖱️</span>
          <div>
            <strong>Drag items:</strong> Click and drag any item to change its start and end dates
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <span style={{ marginRight: '8px', fontSize: '16px' }}>✏️</span>
          <div>
            <strong>Edit names:</strong> Double-click on an item's name to edit it
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <span style={{ marginRight: '8px', fontSize: '16px' }}>🔍</span>
          <div>
            <strong>Zoom:</strong> Use the "+" and "-" buttons to zoom in or out of the timeline
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <span style={{ marginRight: '8px', fontSize: '16px' }}>👆</span>
          <div>
            <strong>Details:</strong> Hover over an item to see detailed information
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineInstructions;
