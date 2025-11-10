# HPCMLX

A simple web application for tracking and managing HPC experiments.

## Features

- Track experiments with titles, descriptions, and markdown content
- Organize experiments with tags
- Link to GitHub repositories
- Search and filter experiments
- Clean, modern web interface

## Tech Stack

- **Backend**: Django REST Framework
- **Frontend**: Vue 3 + Vite
- **Database**: PostgreSQL
- **Deployment**: Docker Compose

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hpcmlx.git
cd hpcmlx
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Edit `.env` and fill in your configuration values.

4. Start the application:
```bash
docker-compose up -d
```

The application will be available at `http://localhost`.

## Development

For development with hot-reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Frontend dev server: `http://localhost:3000`  
Backend API: `http://localhost:8000`

## License

MIT License - see [LICENSE](LICENSE) file for details.

