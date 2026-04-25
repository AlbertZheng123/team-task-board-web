# Team Task Board Web

A lightweight frontend for the Team Task Board app. This React app reads task data from the paired backend repo and lets a user create tasks and move them between statuses.

## Features

- Fetches summary and task data from the API
- Shows tasks grouped by status
- Creates new tasks
- Moves tasks forward through the workflow
- Handles loading and error states

## Tech Stack

- React 18
- Vite
- Plain CSS

## Project Structure

```text
team-task-board-web/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Local Setup

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## API Configuration

Set the backend base URL with:

```bash
cp .env.example .env
```

Default:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Expected Backend

This frontend expects the paired API repo to expose:

- `GET /health`
- `GET /tasks`
- `GET /summary`
- `POST /tasks`
- `PATCH /tasks/{task_id}`
