import React, { useState, useRef } from 'react';
import { 
  getTimelineMonths, 
  generateMonthMarkers, 
  assignItemsToLanes,
  getTotalDays,
  pixelToDayPosition,
  dayPositionToDate,
  getDaysDifference
} from '../utils.js';
import TimelineHeader from './TimelineHeader';
import TimelineMonthHeader from './TimelineMonthHeader';
import TimelineContent from './TimelineContent';
import TimelineInstructions from './TimelineInstructions';

const Timeline = ({ initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [zoom, setZoom] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState([]);
  const timelineRef = useRef(null);

  const { startMonth, endMonth, minDate, maxDate } = getTimelineMonths(items);
  const monthMarkers = generateMonthMarkers(startMonth, endMonth);
  const totalDays = getTotalDays(monthMarkers);
  const { lanes, errors: laneErrors } = assignItemsToLanes(items, monthMarkers);

  React.useEffect(() => {
    setErrors(laneErrors);
  }, [items]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const dayPosition = pixelToDayPosition(x, rect.width, totalDays, zoom);
    
    const currentDuration = getDaysDifference(draggedItem.start, draggedItem.end);
    
    const newStartDate = dayPositionToDate(dayPosition, monthMarkers);
    const newStartDateObj = new Date(newStartDate);
    const newEndDateObj = new Date(newStartDateObj);
    newEndDateObj.setDate(newEndDateObj.getDate() + currentDuration - 1);
    
    const newEndDate = newEndDateObj.toISOString().split('T')[0];
    
    const tempItem = {
      ...draggedItem,
      start: newStartDate,
      end: newEndDate
    };
    
    const otherItems = items.filter(item => item.id !== draggedItem.id);
    const { errors: overlapErrors } = assignItemsToLanes([...otherItems, tempItem], monthMarkers);
    
    if (overlapErrors.length > 0) {
      setErrors(overlapErrors);
      setTimeout(() => setErrors([]), 5000);
      return;
    }
    
    setItems(prev => prev.map(item => 
      item.id === draggedItem.id 
        ? { ...item, start: newStartDate, end: newEndDate }
        : item
    ));
        setErrors([]);
  };

  const handleNameEdit = (itemId, newName) => {
    if (newName.trim()) {
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, name: newName.trim() }
          : item
      ));
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.3));

  const dismissError = (index) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <TimelineHeader
        itemCount={items.length}
        minDate={minDate}
        maxDate={maxDate}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {errors.map((error, index) => (
        <div
          key={index}
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#B91C1C',
            fontSize: '14px'
          }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontSize: '16px' }}>⚠️</span>
            <span>{error.message}</span>
          </div>
          <button
            onClick={() => dismissError(index)}
            style={{
              background: 'none',
              border: 'none',
              color: '#B91C1C',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0 4px',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(185, 28, 28, 0.1)'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            ×
          </button>
        </div>
      ))}

      <div style={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <TimelineMonthHeader 
          monthMarkers={monthMarkers} 
          zoom={zoom}
          totalDays={totalDays}
        />
        
        <TimelineContent
          lanes={lanes}
          monthMarkers={monthMarkers}
          zoom={zoom}
          timelineRef={timelineRef}
          totalDays={totalDays}
          draggedItem={draggedItem}
          editingId={editingId}
          setEditingId={setEditingId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onNameEdit={handleNameEdit}
        />
      </div>

      <TimelineInstructions />

      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Debug Info:</strong><br />
          Total Days: {totalDays} | Lanes: {lanes.length} | Months: {monthMarkers.length}
          <br />
          Timeline: {startMonth.toLocaleDateString()} - {endMonth.toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default Timeline;
