# MonkeFinance Replay Animation Frontend Specs

Version: 1.0  
Scope: Frontend  
Library: TradingView Lightweight Charts  
Framework: React  
Feature: Challenge Replay Animation  

This document defines how replay animation must work on frontend.

This applies to:

Direction Challenge  
Trade Challenge  

---

# 1. Overview

Replay animation shows forward candles one by one.

Speed:

1 candle per second

Maximum candles:

250

Animation stops early if trade resolves earlier.

Purpose:

Make challenge feel alive  
Simulate real-time market  

---

# 2. Core Architecture

Replay system consists of:

Replay Controller

Chart Renderer

Animation Engine

State Manager

---

# 3. Component Structure

Create folder:

src/features/replay/

Components:

ReplayChart.tsx

useReplayController.ts

replay.types.ts

replay.utils.ts

---

# 4. Data Flow

Backend sends:

snapshot_candles

forward_candles

resolution_index

trade_levels (optional)

Frontend must:

Load snapshot first

Then animate forward candles

---

# 5. Candle Types

Define type:

type Candle = {

time: number

open: number

high: number

low: number

close: number

}

---

# 6. Chart Initialization

Use Lightweight Charts:

createChart()

Create:

candlestickSeries

or

lineSeries

depending on user selection

---

# 7. Initial Chart Load

Step 1:

Render snapshot candles fully

Example:

candlestickSeries.setData(snapshotCandles)

Forward candles must NOT be shown initially

---

# 8. Replay Animation Logic

Animation begins when user submits challenge.

Use:

setInterval

Interval:

1000 ms

(1 second)

---

# 9. Replay Algorithm

Pseudo logic:

let currentIndex = 0

let maxIndex = resolution_index

interval:

Add forwardCandles[currentIndex]

Update chart:

candlestickSeries.update(candle)

Increment currentIndex

Stop when:

currentIndex > maxIndex

Clear interval

---

# 10. Animation Stop Conditions

Stop animation when:

currentIndex reaches resolution_index

OR

currentIndex reaches 250

Whichever is smaller

---

# 11. Replay Speed Control (Future Ready)

Prepare variable:

replaySpeed

Default:

1000 ms

Future options:

500 ms

200 ms

---

# 12. Trade Lines Rendering

If Trade Challenge:

Render horizontal lines:

Entry Line

Stop Loss Line

Take Profit Line

Use:

priceLine = series.createPriceLine()

Example:

series.createPriceLine({

price: entryPrice,

color: 'green',

lineWidth: 2,

})

---

# 13. Resolution Marker

When trade resolves:

Highlight candle

Example:

Add marker

series.setMarkers()

Marker position:

resolution_index

---

# 14. Replay State Management

Use React state:

isPlaying

isFinished

currentIndex

Example:

const [isPlaying, setIsPlaying] = useState(false)

---

# 15. Replay Controller Hook

Create hook:

useReplayController

Responsibilities:

Start replay

Stop replay

Reset replay

Track progress

Return:

startReplay()

stopReplay()

currentIndex

isPlaying

---

# 16. Reset Replay

Reset must:

Clear chart

Load snapshot candles again

Reset currentIndex

---

# 17. UI Controls

Add:

Play Button

Pause Button

Restart Button

Optional:

Speed selector

---

# 18. Chart Type Switching

Support:

Candlestick

Line chart

Maintain same replay logic

Switch series type

---

# 19. Performance Optimization

DO NOT re-render full chart

Use:

series.update()

NOT:

setData()

update() is critical for performance

---

# 20. Smooth Animation Requirement

Animation must:

Not freeze UI

Not re-render React unnecessarily

Use:

useRef for chart instance

NOT useState

---

# 21. Chart Instance Storage

Store in:

const chartRef = useRef()

const seriesRef = useRef()

---

# 22. Example Replay Timeline

Example:

snapshot candles: 100

forward candles: 250

resolution_index: 42

Replay shows:

snapshot instantly

then candle 1 → candle 42

Stops

---

# 23. Direction Challenge Replay

Replay logic identical

Only difference:

No trade lines

Only candles

---

# 24. Trade Challenge Replay

Replay includes:

Candles

Entry line

SL line

TP line

Resolution marker

---

# 25. Edge Cases

Handle:

No forward candles

Network delay

User leaving page

Pause replay

---

# 26. Cleanup

Clear interval on:

Component unmount

Replay stop

Use:

useEffect cleanup

---

# 27. Expected User Experience

User submits challenge

Monke message:

"Monke evaluating..."

Chart starts moving

User watches outcome

Replay stops automatically

Result displayed

---

# 28. File Responsibilities Summary

ReplayChart.tsx

Chart rendering

useReplayController.ts

Animation logic

replay.types.ts

Types

replay.utils.ts

Helpers

---

# 29. Library Version Requirement

Use latest:

lightweight-charts

---

# 30. Future Enhancements Ready

Fast forward

Manual stepping

Scrubbing timeline

Multiple timeframe replay

---

# End of Replay Frontend Specs
