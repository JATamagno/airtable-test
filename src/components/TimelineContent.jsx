import TimelineItem from './TimelineItem';

const TimelineContent = ({
  lanes,
  monthMarkers,
  zoom,
  timelineRef,
  totalDays,
  draggedItem,
  editingId,
  setEditingId,
  onDragStart,
  onDragEnd,
  onDrop,
  onNameEdit
}) => {
  return (
    <div 
      ref={timelineRef}
      style={{
        position: 'relative',
        height: `${Math.max(lanes.length * 60 + 20, 200)}px`,
        background: 'white',
        overflow: 'auto',
        minHeight: '200px'
      }}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
    >
      {monthMarkers.map((month, index) => {
        const leftPercent = (month.startPosition / totalDays) * 100;
        
        return (
          <div
            key={`grid-${month.year}-${month.month}`}
            style={{
              position: 'absolute',
              left: `${leftPercent * zoom}%`,
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: index === 0 ? '#d1d5db' : '#f0f0f0',
              pointerEvents: 'none',
              opacity: zoom < 0.5 ? 0.5 : 1,
              transition: 'opacity 0.2s ease'
            }}
          />
        );
      })}

      {zoom > 2 && monthMarkers.map((month) => {
        const dayLines = [];
        for (let day = 1; day <= month.daysInMonth; day++) {
          const dayPosition = month.startPosition + day - 1;
          const leftPercent = (dayPosition / totalDays) * 100;
          
          dayLines.push(
            <div
              key={`day-${month.year}-${month.month}-${day}`}
              style={{
                position: 'absolute',
                left: `${leftPercent * zoom}%`,
                top: 0,
                bottom: 0,
                width: '1px',
                backgroundColor: '#f9fafb',
                pointerEvents: 'none',
                opacity: 0.3
              }}
            />
          );
        }
        return dayLines;
      })}

      {lanes.map((_, laneIndex) => (
        <div
          key={`lane-bg-${laneIndex}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${laneIndex * 60}px`,
            height: '60px',
            backgroundColor: laneIndex % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)',
            pointerEvents: 'none'
          }}
        />
      ))}

      {lanes.map((lane, laneIndex) => (
        <div key={`lane-${laneIndex}`} style={{ position: 'relative' }}>
          {lane.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: `${laneIndex * 60 + 10}px`,
                left: 0,
                right: 0,
                height: '50px'
              }}>
              <TimelineItem
                item={item}
                laneIndex={laneIndex}
                monthMarkers={monthMarkers}
                zoom={zoom}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onNameEdit={onNameEdit}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            </div>
          ))}
        </div>
      ))}

      {draggedItem && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '2px',
            backgroundColor: '#3B82F6',
            pointerEvents: 'none',
            opacity: 0.6,
            zIndex: 1000,
            transform: 'translateX(-1px)'
          }}
        />
      )}

      {lanes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#9CA3AF',
            fontSize: '16px'
          }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
          <div>No timeline items to display</div>
        </div>
      )}
    </div>
  );
};

export default TimelineContent;
