import React, { useState } from 'react';
import { formatDate, calculateItemPosition, getTotalDays, LANE_COLORS } from '../utils.js';

const TimelineItem = ({
  item,
  laneIndex,
  monthMarkers,
  zoom,
  onDragStart,
  onDragEnd,
  onNameEdit,
  editingId,
  setEditingId
}) => {
  const [tempName, setTempName] = useState(item.name);

  const position = calculateItemPosition(item, monthMarkers);
  const totalDays = getTotalDays(monthMarkers);

  const leftPercent = (position.startPosition / totalDays) * 100;
  const widthPercent = (position.duration / totalDays) * 100;
  const pixelWidth = widthPercent * zoom * 8; 

  const isCompact = pixelWidth < 100;

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onNameEdit(item.id, tempName.trim());
    } else {
      setTempName(item.name);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setTempName(item.name);
      setEditingId(null);
    }
  };

  const isEditing = editingId === item.id;
  const backgroundColor = LANE_COLORS[laneIndex % LANE_COLORS.length];

  return (
    <div
      className="timeline-item"
      style={{
        position: 'absolute',
        left: `${leftPercent * zoom}%`,
        width: `${widthPercent * zoom}%`,
        height: '40px',
        backgroundColor,
        borderRadius: '6px',
        padding: '6px 8px',
        cursor: 'grab',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
        zIndex: isEditing ? 1000 : 1,
        overflow: 'hidden'
      }}
      draggable={!isEditing}
      onDragStart={(e) => {
        if (!isEditing) {
          onDragStart(e, item);
          e.target.style.cursor = 'grabbing';
          e.target.style.transform = 'scale(1.02)';
          e.target.style.borderColor = 'rgba(255,255,255,0.5)';
          e.target.style.zIndex = '1001';
        }
      }}
      onDragEnd={(e) => {
        if (!isEditing) {
          onDragEnd();
          e.target.style.cursor = 'grab';
          e.target.style.transform = 'scale(1)';
          e.target.style.borderColor = 'transparent';
          e.target.style.zIndex = '1';
        }
      }}
      onMouseOver={(e) => {
        if (!isEditing) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseOut={(e) => {
        if (!isEditing) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
      title={`${item.name}\n${formatDate(item.start)} - ${formatDate(item.end)}\nDuration: ${position.duration} day${position.duration > 1 ? 's' : ''}`}
    >
      <div style={{ 
        flex: 1, 
        minWidth: 0, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        overflow: 'hidden' 
      }}>
        {isEditing ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'white',
              fontSize: '14px',
              width: '100%',
              outline: 'none',
              fontWeight: '500'
            }}
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <span
            style={{
              cursor: 'text',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              maxWidth: '100%'
            }}
            onDoubleClick={() => setEditingId(item.id)}
          >
            {item.name}
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: '12px',
          opacity: 0.9,
          marginLeft: '6px',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.2)',
          padding: '2px 6px',
          borderRadius: '12px',
          minWidth: '28px',
          textAlign: 'center',
          fontWeight: '600'
        }}
      >
        {position.duration}d
      </div>
    </div>
  );
};

export default TimelineItem;
