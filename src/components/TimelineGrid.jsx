const TimelineGrid = ({ monthMarkers, zoom }) => {
  return (
    <>
      {monthMarkers.map((marker, index) => (
        <div
          key={`grid-${index}`}
          style={{
            position: 'absolute',
            left: `${marker.position * zoom}%`,
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: index === 0 ? '#e0e0e0' : '#f0f0f0',
            pointerEvents: 'none',
            opacity: zoom < 0.5 ? 0.3 : 1,
            transition: 'opacity 0.2s ease'
          }}
        />
      ))}
    </>
  );
};

export default TimelineGrid;
