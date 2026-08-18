# Lost Hill — AI-Powered Lost & Found Platform

Lost Hill is a full-stack lost-and-found application that goes beyond keyword search — it uses AI-driven semantic and image matching to automatically surface likely matches between lost and found item reports.

**Live:** [losthill.online](https://losthill.online)

## Features

- **Semantic + Image Matching** — Uses the Gemini API to compare item descriptions and photos, matching items based on meaning and visual similarity rather than exact keyword overlap.
- **Weighted Scoring Engine** — A dynamic, priority-redistributing scoring algorithm ranks potential matches by combining multiple signals (description similarity, image similarity, location, time) instead of relying on a single fixed metric.
- **Two-Tier Confidence Banding** — Matches are classified into confidence tiers (e.g., high-confidence vs. possible match), so users see the most likely matches first without being overwhelmed by weak ones.
- **Privacy-Scoped Result Visibility** — Match details are only revealed to relevant users, protecting reporter privacy until a match is confirmed.

## Tech Stack

- **Backend:** Node.js, Express
- **AI/Matching:** Gemini API
- **Frontend:** _TODO: fill in (e.g. EJS, React)_
- **Database:** _TODO: fill in (e.g. MongoDB)_

## How It Works

1. A user submits a lost or found item report with a description and optional photo.
2. The matching engine compares the new report against existing reports using the Gemini API for semantic text and image analysis.
3. A weighted scoring algorithm ranks candidate matches, redistributing weight across signals based on data availability (e.g., more weight to image similarity if a clear photo exists).
4. Matches above a confidence threshold are surfaced to the relevant users, with visibility scoped by confidence tier and privacy rules.

## Getting Started

```bash
git clone https://github.com/AdityaLour/lost-hill.git
cd lost-hill
npm install
npm start
```

You'll need a Gemini API key set in your environment variables (e.g., `GEMINI_API_KEY`) for the matching engine to work.

## Author

Built by [Aditya Lour](https://github.com/AdityaLour).
