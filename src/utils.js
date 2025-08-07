export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

export const getDaysDifference = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

export const getTimelineMonths = (items) => {
  const dates = items.flatMap(item => [item.start, item.end]);
  const minDate = new Date(Math.min(...dates.map(d => new Date(d))));
  const maxDate = new Date(Math.max(...dates.map(d => new Date(d))));
  
  const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
  
  const totalMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + 
                      (maxDate.getMonth() - minDate.getMonth()) + 1;
  
  return { startMonth, endMonth, totalMonths, minDate, maxDate };
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const generateMonthMarkers = (startMonth, endMonth) => {
  const months = [];
  const current = new Date(startMonth);
  let cumulativeDays = 0;
  
  while (current <= endMonth) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    months.push({
      date: new Date(current),
      year,
      month,
      daysInMonth,
      startPosition: cumulativeDays,
      endPosition: cumulativeDays + daysInMonth
    });
    
    cumulativeDays += daysInMonth;
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
};

export const calculateItemPosition = (item, monthMarkers) => {
  const startDate = new Date(item.start);
  const endDate = new Date(item.end);
  
  let startPosition = 0;
  let endPosition = 0;
  
  for (const month of monthMarkers) {
    if (month.year === startDate.getFullYear() && month.month === startDate.getMonth()) {
      startPosition = month.startPosition + startDate.getDate() - 1;
      break;
    }
  }
  
  for (const month of monthMarkers) {
    if (month.year === endDate.getFullYear() && month.month === endDate.getMonth()) {
      endPosition = month.startPosition + endDate.getDate() - 1;
      break;
    }
  }
  
  return {
    startPosition,
    endPosition,
    duration: endPosition - startPosition + 1,
    startDate,
    endDate
  };
};

export const itemsOverlap = (item1, item2, monthMarkers) => {
  const pos1 = calculateItemPosition(item1, monthMarkers);
  const pos2 = calculateItemPosition(item2, monthMarkers);
  
  return !(pos1.endPosition < pos2.startPosition || pos2.endPosition < pos1.startPosition);
};

export const assignItemsToLanes = (items, monthMarkers, isDragging) => {
  const sortedItems = [...items].sort((a, b) => new Date(a.start) - new Date(b.start));
  const lanes = [];
  const errors = [];

  for (const item of sortedItems) {
    let placed = false;

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
      const lane = lanes[laneIndex];
      let canPlace = true;

      for (const existingItem of lane) {
        if (itemsOverlap(item, existingItem, monthMarkers)) {
          canPlace = false;

          if (isDragging) { 
            const itemPos = calculateItemPosition(item, monthMarkers);
            const existingPos = calculateItemPosition(existingItem, monthMarkers);

            if (
              itemPos.startPosition <= existingPos.endPosition &&
              itemPos.endPosition >= existingPos.startPosition
            ) {
              errors.push({
                message: `Items "${item.name}" and "${existingItem.name}" overlap in time and cannot be placed in the same timeline.`,
                item1: item,
                item2: existingItem
              });
            }
          }
          break;
        }
      }

      if (canPlace) {
        lane.push(item);
        placed = true;
        break;
      }
    }

    if (!placed) {
      lanes.push([item]);
    }
  }

  return { lanes, errors };
};


export const getTotalDays = (monthMarkers) => {
  return monthMarkers.reduce((total, month) => total + month.daysInMonth, 0);
};

export const pixelToDayPosition = (pixelX, containerWidth, totalDays, zoom) => {
  const normalizedX = pixelX / zoom;
  const percentage = normalizedX / containerWidth;
  return Math.round(percentage * totalDays);
};

export const dayPositionToDate = (dayPosition, monthMarkers) => {
  let remainingDays = dayPosition;
  
  for (const month of monthMarkers) {
    if (remainingDays < month.daysInMonth) {
      const day = remainingDays + 1;
      const date = new Date(month.year, month.month, day);
      return date.toISOString().split('T')[0];
    }
    remainingDays -= month.daysInMonth;
  }
  
  const lastMonth = monthMarkers[monthMarkers.length - 1];
  const date = new Date(lastMonth.year, lastMonth.month, lastMonth.daysInMonth);
  return date.toISOString().split('T')[0];
};

export const LANE_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export default {
  formatDate,
  getDaysDifference,
  getTimelineMonths,
  getDaysInMonth,
  generateMonthMarkers,
  calculateItemPosition,
  itemsOverlap,
  assignItemsToLanes,
  getTotalDays,
  pixelToDayPosition,
  dayPositionToDate,
  LANE_COLORS
};
