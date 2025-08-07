import React from "react";
import ReactDOM from "react-dom/client";
import Timeline from './components/Timeline';
import timelineItems from "./timelineItems.js";

function App() {
  return (
    <div>
      <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Timeline initialItems={timelineItems} />
    </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
