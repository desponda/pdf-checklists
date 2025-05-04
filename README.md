# Flight Simulation Checklists

A modern web application for generating aircraft checklists as downloadable PDFs. Built with a modern monorepo structure, the application fetches checklist images from msfschecklist.de and compiles them into professional PDF documents.

## Features

- 🛩️ Browse available aircraft checklists
- 🌓 Automatic dark/light mode support
- 📑 Generate and download PDF checklists
- 📱 Responsive design with modern UI
- 🚀 Fast and efficient caching system
- 🔄 Real-time updates and hot reloading

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS for styling
- shadcn/ui for components
- Modern animations and transitions

### Backend
- Node.js with Express
- PDF generation with pdf-lib
- Efficient caching system
- RESTful API design

### Infrastructure
- Kubernetes deployment ready
- GitHub Actions CI/CD
- Docker containerization
- Helm charts for deployment

## Project Structure

```
pdf-checklists/
├── apps/                      # Application code
│   ├── frontend/             # Frontend React application
│   │   ├── src/             # Source code
│   │   ├── public/          # Static assets
│   │   └── Dockerfile       # Frontend container
│   └── backend/             # Backend Express application
│       ├── server/          # Server code
│       └── Dockerfile       # Backend container
├── deploy/                   # Deployment configurations
│   ├── docker/              # Docker configurations
│   ├── helm/                # Kubernetes Helm charts
│   └── scripts/             # Deployment scripts
├── docs/                     # Documentation
└── .devcontainer/           # Development container
```

## Development

### Prerequisites
- Node.js >= 20.x
- VS Code with Remote Containers extension (recommended)
- Docker and Kubernetes for deployment

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pdf-checklists.git
   cd pdf-checklists
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Start development servers:
   ```bash
   make dev-up
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Development with VS Code Remote Containers

1. Open the project in VS Code
2. Click "Reopen in Container" when prompted
3. Wait for the container to build
4. Run `make dev-up` to start development servers

## Deployment

### Local Docker Build
```bash
make build
```

### Kubernetes Deployment
```bash
make deploy
```

### Production URLs
- Configure the domain in `deploy/helm/pdf-checklists/values.yaml`
- Default: https://checklists.example.com

## Architecture

### Frontend
- Modern React with Vite for fast development
- Tailwind CSS for utility-first styling
- shadcn/ui for accessible components
- Efficient state management
- Responsive design system

### Backend
- Express.js REST API
- PDF generation with caching
- Image optimization
- Error handling and logging
- Health checks and monitoring

### Infrastructure
- Multi-stage Docker builds
- Kubernetes deployment with Helm
- GitHub Actions automation
- Development container support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT