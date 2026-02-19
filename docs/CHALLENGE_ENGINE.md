# Direction Challenge API v2 (Indian Stock Market)

**API Version: v2** — Use this document for frontend integration with the Direction Challenge.

**Direction challenge** = prediction only (BUY / SELL / HOLD). Practice using **historical Indian stock data**: see a chart snapshot, choose direction, then get instant scoring.

For **trade challenge** (LONG/SHORT + entry, SL, TP), see Trade Challenge API and `specs/Monke-Trade-Specs.md`.

**Forward window (v2):** Both challenges use a fixed **250-candle** forward window after the snapshot (see Trade Challenge Forward Window Spec in the specs). Scoring and replay use only these candles. Responses return **`forwardCandles`** (max 250); do not use `outcomeCandles`.

**Base path:** `/api/direction-challenge`  
**Auth:** All endpoints require `Authorization: Bearer <token>`.

---

## Response envelope

Same as rest of API:

- **Success:** `{ "success": true, "data": { ... }, "message": "..." }`
- **Error:** `{ "success": false, "message": "..." }`

---

## 1. Get a random challenge (show the chart)

**GET** `/api/direction-challenge/random`

Returns one random challenge. Use this to **show the chart** to the user. Only snapshot data is returned (no outcome).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-of-challenge",
    "symbol": "RELIANCE",
    "market": "NSE",
    "timeframe": "5m",
    "snapshotStart": "2020-06-01T09:15:00.000Z",
    "snapshotEnd": "2020-06-15T10:30:00.000Z",
    "snapshotCandles": [
      {
        "time": "2020-06-15T10:30:00.000Z",
        "open": 1520,
        "high": 1530,
        "low": 1510,
        "close": 1525,
        "volume": 120000
      }
    ]
  }
}
```

**Frontend usage:**

- Store `data.id` (challenge id) for the submit step.
- Render a **candlestick/OHLC chart** from `data.snapshotCandles` (array of `{ time, open, high, low, close, volume }`).
- Show `data.symbol` and `data.timeframe` (e.g. "RELIANCE · 5m").
- Do **not** show what happens after `snapshotEnd`; the user decides only from this snapshot.

---

## 2. Get a challenge by filters

**GET** `/api/direction-challenge/filter`

Returns one **random** challenge that matches the given filters. Use this when the user wants to practice a specific difficulty. Same response shape as `GET /api/direction-challenge/random` (snapshot only; no outcome).

**Query parameters:**

| Parameter    | Type   | Required | Description |
|--------------|--------|----------|-------------|
| `difficulty` | string | No       | Filter by difficulty: `Easy`, `Medium`, or `Hard`. If omitted, returns a random challenge (any difficulty). |

**Examples:**

```
GET /api/direction-challenge/filter
GET /api/direction-challenge/filter?difficulty=Easy
GET /api/direction-challenge/filter?difficulty=Hard
```

**Response (200):** Same as `GET /api/direction-challenge/random` (one challenge object with `id`, `symbol`, `market`, `timeframe`, `snapshotStart`, `snapshotEnd`, `snapshotCandles`).

**Validation:**

- If `difficulty` is provided, it must be exactly one of: `Easy`, `Medium`, `Hard` (case-sensitive). Otherwise **400** with message e.g. `"difficulty must be one of: Easy, Medium, Hard"`.

**404:** No challenges available for the given filters (e.g. no challenges with that difficulty). Try different filters or try again later.

**Frontend usage:**

- Add a difficulty selector (Easy / Medium / Hard / Any) and call this endpoint with `?difficulty=...` when the user picks a difficulty.
- More filters may be added in the future (e.g. symbol, timeframe); the same endpoint will accept additional query parameters.

---

## 3. Get a specific challenge by id

**GET** `/api/direction-challenge/:id`

Same shape as random, for a given challenge id. Use if the user bookmarks or reopens a challenge.

**Response (200):** Same as `GET /api/direction-challenge/random` (one challenge object with `id`, `symbol`, `market`, `timeframe`, `snapshotStart`, `snapshotEnd`, `snapshotCandles`).

**404:** Challenge not found.

---

## 4. Submit decision (and get score)

**POST** `/api/direction-challenge/submit`

**Body:**

```json
{
  "challengeId": "uuid-from-step-1",
  "decision": "BUY"
}
```

- `challengeId`: string (uuid from the challenge you showed).
- `decision`: one of `"BUY"` | `"SELL"` | `"HOLD"`.

**Response (201):**

```json
{
  "success": true,
  "message": "Submitted",
  "data": {
    "attemptId": "uuid-of-attempt",
    "correctDirection": "BUY",
    "userDirection": "BUY",
    "correct": true,
    "score": 2.5,
    "profitPercent": 2.5,
    "maxProfitPercent": 3.2,
    "maxLossPercent": -1.1,
    "explanation": "Correct. You chose BUY. Profit potential: 2.50% (max in outcome: +3.20% / -1.10%).",
    "forwardCandles": [
      {
        "time": "2020-06-15T10:35:00.000Z",
        "open": 1525,
        "high": 1570,
        "low": 1510,
        "close": 1560,
        "volume": 95000
      }
    ]
  }
}
```

**Frontend usage:**

- **Score:** Show `data.score` (range **-100 to +100**). Positive = correct direction and/or profit; wrong direction is negative.
- **Correct/incorrect:** Use `data.correct` (true if `userDirection === correctDirection`).
- **Explanation:** Show `data.explanation` as feedback text.
- **Replay:** Use `data.forwardCandles` to draw the **forward window** (max 250 candles after snapshot). Animate 1 candle per second; stop when trade resolves or at candle 250.
- **Result link:** You can link to the result with `GET /api/direction-challenge/result/:attemptId` using `data.attemptId`.

**Validation:**

- `challengeId` required, non-empty.
- `decision` required, must be exactly `"BUY"`, `"SELL"`, or `"HOLD"`.

**404:** Challenge not found.

---

## 5. Get result by attempt id

**GET** `/api/direction-challenge/result/:id`

- `:id` = **attempt id** (e.g. `data.attemptId` from submit response).
- Returns the same result payload as the submit response (correct direction, user direction, correct, score, profitPercent, maxProfitPercent, maxLossPercent, explanation, forwardCandles).
- Only the owner of the attempt can read it (401/404 if not).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "correctDirection": "BUY",
    "userDirection": "BUY",
    "correct": true,
    "score": 2.5,
    "profitPercent": 2.5,
    "maxProfitPercent": 3.2,
    "maxLossPercent": -1.1,
    "explanation": "Correct. You chose BUY. ...",
    "forwardCandles": [ ... ]
  }
}
```

Use this to **show a past result** (e.g. from history or shared link).

---

## 6. Get my challenge stats (score summary)

**GET** `/api/direction-challenge/stats`

Returns the **current user’s** aggregate stats across all attempts: total attempts, correct count, total score (sum of per-attempt scores), and average score.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalAttempts": 24,
    "correctCount": 16,
    "wrongCount": 8,
    "totalScore": 312.5,
    "averageScore": 13.02
  }
}
```

**Fields:**

- `totalAttempts` – Number of challenges submitted.
- `correctCount` – Number where `correct === true`.
- `wrongCount` – `totalAttempts - correctCount`.
- `totalScore` – Sum of all attempt `score` values (each in -100 to +100).
- `averageScore` – `totalScore / totalAttempts` (0 if no attempts).

**Frontend usage:**

- Show “Your challenge score: 312” (totalScore) or “Correct: 16/24” and “Avg score: 13.0”.
- Use for profile, dashboard, or “Play again” screen.

---

## 7. Get challenge leaderboard

**GET** `/api/direction-challenge/leaderboard`

Returns the **top users** by **total score** (sum of all their attempt scores). Same scoring as the crypto leaderboard is separate; this ranks only Indian stock challenge performance.

**Query parameters:**

| Parameter | Type   | Default | Description |
|-----------|--------|--------|-------------|
| `limit`  | number | 50     | Max entries (1–100). |

**Example:**

```
GET /api/direction-challenge/leaderboard
GET /api/direction-challenge/leaderboard?limit=20
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "rank": 1,
        "userId": 5,
        "username": "alice",
        "totalAttempts": 80,
        "correctCount": 58,
        "totalScore": 1250.5,
        "averageScore": 15.63,
        "isCurrentUser": true
      },
      {
        "rank": 2,
        "userId": 3,
        "username": "bob",
        "totalAttempts": 45,
        "correctCount": 32,
        "totalScore": 720.0,
        "averageScore": 16.0
      }
    ]
  }
}
```

**Fields:**

- `rank` – 1-based rank by total score (desc).
- `userId`, `username` – User id and display name.
- `totalAttempts` – Number of challenges they’ve submitted.
- `correctCount` – Number of correct decisions.
- `totalScore` – Sum of all attempt scores (used for ranking).
- `averageScore` – `totalScore / totalAttempts`.
- `isCurrentUser` – Present and `true` only for the authenticated user’s row.

**Frontend usage:**

- Render a table: rank, username, total score, correct count, attempts, average score.
- Highlight the row where `isCurrentUser === true`.

---

## Candle format

Every candle in `snapshotCandles` and `forwardCandles` (forward window: max 250 candles):

| Field   | Type   | Description        |
|--------|--------|--------------------|
| `time` | string | ISO datetime       |
| `open` | number | Open price         |
| `high` | number | High price         |
| `low`  | number | Low price          |
| `close`| number | Close price        |
| `volume` | number | Volume          |

Use **open/high/low/close** for candlestick or OHLC charts; **time** for the x-axis.

---

## How scoring works (for frontend)

- **Correct direction** is derived from forward window (max 250 candles) (price went up enough → BUY, down enough → SELL, else HOLD).
- **User correct:** `correct === (userDirection === correctDirection)`.
- **Profit % for user’s choice:**
  - **BUY:** from snapshot end close to **max high** in forward window.
  - **SELL:** from snapshot end close to **min low** in forward window.
  - **HOLD:** 0.
- **Score:** Based on that profit %; if direction was wrong, score is negative. Clamped between **-100** and **+100**.
- **Display:** Show `score` as the main number; use `correct` for “Correct / Incorrect” and `explanation` for short feedback.

---

## Suggested frontend flow

1. **Load challenge:** `GET /api/direction-challenge/random`, `GET /api/direction-challenge/filter?difficulty=Easy` (or other filters), or `GET /api/direction-challenge/:id`.
2. **Show chart:** Draw candlesticks from `snapshotCandles`; show `symbol`, `timeframe`.
3. **User chooses:** BUY / SELL / HOLD.
4. **Submit:** `POST /api/direction-challenge/submit` with `challengeId` and `decision`.
5. **Show result:** From submit response (or `GET /api/direction-challenge/result/:attemptId`):
   - Score (`score`), Correct/Incorrect (`correct`), `explanation`.
   - Optional: append `forwardCandles` to the chart for replay (animate 1 candle/sec, max 250).
6. **Next:** Call `GET /api/direction-challenge/random` or `GET /api/direction-challenge/filter?difficulty=...` again for another challenge.

**Challenge score and leaderboard:**

- After submit (or on a profile/dashboard): call **GET /api/direction-challenge/stats** to show the user’s total score, correct count, and average score.
- For a global ranking: call **GET /api/direction-challenge/leaderboard** to show top users by total challenge score and highlight the current user with `isCurrentUser`.

---

## Errors

| Status | Meaning                    |
|--------|----------------------------|
| 400    | Invalid body (e.g. bad `decision`) or invalid query (e.g. bad `difficulty`) |
| 401    | Missing or invalid token   |
| 404    | Challenge or result not found |

All errors: `{ "success": false, "message": "..." }`.

---

## v2 for frontend (breaking changes)

If you were integrating with an older "market replay" or "challenge" API, update as follows:

| v1 / legacy | v2 |
|-------------|-----|
| Base path `/api/challenge` | Base path **`/api/direction-challenge`** |
| Response field `outcomeCandles` | Response field **`forwardCandles`** (max 250 candles) |
| Outcome window (unspecified length) | **Forward window: 250 candles**; scoring and replay use only these |

**Action items for frontend:**

1. Point all challenge requests to **`/api/direction-challenge`** (e.g. `/api/direction-challenge/random`, `/api/direction-challenge/submit`).
2. Use **`data.forwardCandles`** instead of `data.outcomeCandles` in submit and result responses.
3. Replay: animate **forwardCandles** at 1 candle per second; stop at 250 candles or when the trade/direction is resolved (for trade challenge, use `resolution_index` when available).
