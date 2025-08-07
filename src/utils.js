// utils/timelineUtils.js

/**
 * Formats a date string to US English format
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

/**
 * Calculates the difference in days between two dates (inclusive)
 * @param {string} start - Start date in YYYY-MM-DD format
 * @param {string} end - End date in YYYY-MM-DD format
 * @returns {number} Number of days including both start and end dates
 */
export const getDaysDifference = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Gets the start and end months from timeline items
 * @param {Array} items - Array of timeline items
 * @returns {Object} Object containing startMonth, endMonth, and totalMonths
 */
export const getTimelineMonths = (items) => {
  const dates = items.flatMap(item => [item.start, item.end]);
  const minDate = new Date(Math.min(...dates.map(d => new Date(d))));
  const maxDate = new Date(Math.max(...dates.map(d => new Date(d))));
  
  // Get first day of start month and last day of end month
  const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
  
  // Calculate total months
  const totalMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + 
                      (maxDate.getMonth() - minDate.getMonth()) + 1;
  
  return { startMonth, endMonth, totalMonths, minDate, maxDate };
};

/**
 * Gets the number of days in a specific month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {number} Number of days in the month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Generates month markers for the timeline header
 * @param {Date} startMonth - Start month date
 * @param {Date} endMonth - End month date
 * @returns {Array} Array of month objects with metadata
 */
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

/**
 * Calculates the position of an item in the timeline
 * @param {Object} item - Timeline item
 * @param {Array} monthMarkers - Array of month markers
 * @returns {Object} Position information
 */
export const calculateItemPosition = (item, monthMarkers) => {
  const startDate = new Date(item.start);
  const endDate = new Date(item.end);
  
  let startPosition = 0;
  let endPosition = 0;
  
  // Find start position
  for (const month of monthMarkers) {
    if (month.year === startDate.getFullYear() && month.month === startDate.getMonth()) {
      startPosition = month.startPosition + startDate.getDate() - 1;
      break;
    }
  }
  
  // Find end position
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

/**
 * Checks if two items overlap (including adjacent dates)
 * @param {Object} item1 - First item
 * @param {Object} item2 - Second item
 * @param {Array} monthMarkers - Array of month markers
 * @returns {boolean} True if items overlap or are adjacent
 */
export const itemsOverlap = (item1, item2, monthMarkers) => {
  const pos1 = calculateItemPosition(item1, monthMarkers);
  const pos2 = calculateItemPosition(item2, monthMarkers);
  
  // Check for overlap (including adjacent dates)
  return !(pos1.endPosition < pos2.startPosition || pos2.endPosition < pos1.startPosition);
};

/**
 * Assigns items to lanes with overlap detection
 * @param {Array} items - Array of timeline items
 * @param {Array} monthMarkers - Array of month markers
 * @returns {Object} Object containing lanes and any overlap errors
 */
export const assignItemsToLanes = (items, monthMarkers) => {
  const sortedItems = [...items].sort((a, b) => new Date(a.start) - new Date(b.start));
  const lanes = [];
  const errors = [];
  
  for (const item of sortedItems) {
    let placed = false;
    
    // Try to place item in existing lanes
    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
      const lane = lanes[laneIndex];
      let canPlace = true;
      
      // Check for overlaps with items in this lane
      for (const existingItem of lane) {
        if (itemsOverlap(item, existingItem, monthMarkers)) {
          canPlace = false;
          
          // Check if it's an exact overlap (error condition)
          const itemPos = calculateItemPosition(item, monthMarkers);
          const existingPos = calculateItemPosition(existingItem, monthMarkers);
          
          if ((itemPos.startPosition <= existingPos.endPosition && 
               itemPos.endPosition >= existingPos.startPosition)) {
            errors.push({
              message: `Items "${item.name}" and "${existingItem.name}" overlap in time and cannot be placed in the same timeline.`,
              item1: item,
              item2: existingItem
            });
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
    
    // If couldn't place in existing lanes, create new lane
    if (!placed) {
      lanes.push([item]);
    }
  }
  
  return { lanes, errors };
};

/**
 * Calculates the total number of days in the timeline
 * @param {Array} monthMarkers - Array of month markers
 * @returns {number} Total days
 */
export const getTotalDays = (monthMarkers) => {
  return monthMarkers.reduce((total, month) => total + month.daysInMonth, 0);
};

/**
 * Converts a pixel position to day position
 * @param {number} pixelX - X position in pixels
 * @param {number} containerWidth - Width of container
 * @param {number} totalDays - Total days in timeline
 * @param {number} zoom - Current zoom level
 * @returns {number} Day position
 */
export const pixelToDayPosition = (pixelX, containerWidth, totalDays, zoom) => {
  const normalizedX = pixelX / zoom;
  const percentage = normalizedX / containerWidth;
  return Math.round(percentage * totalDays);
};

/**
 * Converts a day position to date
 * @param {number} dayPosition - Day position in timeline
 * @param {Array} monthMarkers - Array of month markers
 * @returns {string} Date string in YYYY-MM-DD format
 */
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
  
  // Fallback to last day of timeline
  const lastMonth = monthMarkers[monthMarkers.length - 1];
  const date = new Date(lastMonth.year, lastMonth.month, lastMonth.daysInMonth);
  return date.toISOString().split('T')[0];
};

// Colors for different lanes
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
