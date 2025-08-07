# Airtable Technical Challenge

## Overview

This project is a timeline visualization component designed for displaying events compactly across horizontal lanes. Items are positioned based on their start and end dates, with an emphasis on space efficiency.

## Features

- Compact lane assignment based on event overlap
- Dynamically sized event blocks
- Support for multi-month visualizations
- Event names with ellipsis when space is limited

## What I liked about my implementation

- The timeline layout is visually clean and easy to interpret.
- Lane assignment logic ensures minimal vertical space usage.
- Simple and intuitive visual representation of event durations.

## What I would change if I did it again

- Improve responsiveness on all screens
- Add tooltips or modals to show full event details
- Refactor the lane assignment algorithm to better handle edge cases
- Add unit and integration tests

## Design Decisions

- Took inspiration from Google Calendar.
- Prioritized compactness while ensuring readability of event labels.

## How to Run the Project

1. Clone the repository
2. Navigate to the project directory
3. Run:

```bash
npm install
npm start
````

This will launch the project in your default browser.

## How I Would Test (with more time)

* Unit tests for lane assignment logic
* Integration tests for drag-and-drop and zoom (if implemented)
* Visual regression tests to ensure consistent layout
* Accessibility tests for screen readers and keyboard navigation

## Tech Stack

* React
* JavaScript (ES6+)
