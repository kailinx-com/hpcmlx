# HPC Experiment Tracker - Frontend

Vue 3 frontend for the HPC Experiment Tracker application.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-style components** - Custom UI components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── api/              # API service layer
│   └── experiments.js
├── components/       # Reusable UI components
│   ├── Button.vue
│   ├── Input.vue
│   ├── Spinner.vue
│   ├── ToastContainer.vue
│   ├── EmptyState.vue
│   └── ErrorState.vue
├── router/           # Vue Router configuration
│   └── index.js
├── stores/           # Pinia stores
│   ├── experiments.js
│   └── toast.js
├── views/            # Page components
│   ├── ExperimentsList.vue
│   └── ExperimentDetail.vue
├── App.vue           # Root component
├── main.js           # Application entry point
└── style.css         # Global styles
```

## Features

### Experiments List Page
- Search experiments by name
- Filter by tags
- Pagination support
- Responsive table layout
- Loading states
- Error handling with retry
- Empty states

### Experiment Detail Page
- View experiment metadata
- Display experiment tags
- List all runs for an experiment
- Run status indicators
- Refresh functionality

### UX Components
- **Loading Spinners** - Shown during data fetching
- **Error Toasts** - Non-intrusive error notifications
- **Empty States** - Helpful messages when no data is available
- **Retry Buttons** - Easy error recovery

## API Integration

The frontend expects the following API endpoints:

- `GET /api/experiments/` - List experiments (supports `page`, `page_size`, `search`, `tag` query params)
- `GET /api/experiments/:id/` - Get single experiment
- `GET /api/experiments/:id/runs/` - Get runs for an experiment

The API service layer is organized in `src/api/experiments.js` for easy maintenance and updates.

## Development

The Vite dev server is configured to proxy `/api` requests to `http://localhost:8000` (Django backend).

## Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

