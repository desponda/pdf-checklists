# PDF Checklists - Development Guide

## Development Environment

### VS Code Remote Container (Recommended)
1. Install VS Code and Docker
2. Install "Remote - Containers" extension
3. Open project in VS Code
4. Click "Reopen in Container" when prompted
5. Container includes:
   - Node.js 20
   - Docker-in-Docker
   - Kubernetes tools
   - Development extensions

### Local Development
1. Install Node.js 20+
2. Install dependencies:
   ```bash
   make install
   ```
3. Start development:
   ```bash
   make dev-up
   ```

## Project Structure

### Monorepo Organization
```
apps/
├── frontend/           # React application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
└── backend/           # Express application
    ├── server/        # Server code
    └── package.json   # Backend dependencies
```

### Development Tools
- Vite for frontend development
- Nodemon for backend auto-reload
- ESLint + Prettier for code quality
- Jest and Vitest for testing

## Current Status (Updated May 2024)

### Completed Features
1. **Frontend**
   - Modern UI with shadcn/ui components
   - Responsive design implementation
   - Dark/light mode support
   - PDF generation interface
   - Aircraft selection component

2. **Backend**
   - RESTful API implementation
   - PDF generation with caching
   - Error handling and logging
   - Health check endpoints

3. **Infrastructure**
   - Development container setup
   - Kubernetes deployment configuration
   - GitHub Actions CI/CD pipeline
   - Docker multi-stage builds

### In Progress
1. **Frontend Enhancements**
   - [ ] Progress tracking for PDF generation
   - [ ] Enhanced error notifications
   - [ ] Checklist preview functionality
   - [ ] Search and filtering improvements

2. **Backend Optimizations**
   - [ ] Cache optimization
   - [ ] Image processing improvements
   - [ ] API rate limiting
   - [ ] Enhanced error recovery

3. **Infrastructure**
   - [ ] Monitoring setup
   - [ ] Automated scaling
   - [ ] Backup strategy
   - [ ] CDN integration

## Development Workflow

### Starting Development
```bash
# Start all services
make dev-up

# Stop services
make dev-down

# Run tests
make test

# Run linting
make lint
```

### Building for Production
```bash
# Build Docker images
make build

# Deploy to Kubernetes
make deploy
```

### Common Development Tasks

#### Adding New Dependencies
```bash
# Frontend dependencies
npm install package-name --workspace=@pdf-checklists/frontend

# Backend dependencies
npm install package-name --workspace=@pdf-checklists/backend
```

#### Running Individual Services
```bash
# Frontend only
npm run dev --workspace=@pdf-checklists/frontend

# Backend only
npm run dev --workspace=@pdf-checklists/backend
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Frontend uses port 3000
   - Backend uses port 3001
   - Solution: Use `make dev-down` to clean up

2. **Development Container**
   - Issue: Container not rebuilding
   - Solution: Use VS Code "Rebuild Container" command

3. **Hot Reload**
   - Frontend uses Vite HMR
   - Backend uses Nodemon
   - Both should auto-reload on changes

## Resources

### Documentation
- [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)

### API Endpoints
- Checklist API: https://msfschecklist.de/ebag/
- File Index: https://msfschecklist.de/ebag/file_index.js

### Tools
- PDF Generation: pdf-lib
- Testing: Jest/Vitest
- Linting: ESLint
- Formatting: Prettier
