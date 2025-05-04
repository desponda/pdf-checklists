# Aircraft Checklist PDF Generator

A modern web application that allows users to select aircraft checklists and convert them into downloadable PDF files. The application fetches checklist images from msfschecklist.de and compiles them into a single PDF document.

## Features

- Browse available aircraft checklists
- Choose between standard and dark mode variants
- Generate and download PDF checklists
- Responsive design for mobile and desktop use

## Tech Stack

- **Frontend:** React.js with Styled Components
- **Backend:** Node.js with Express
- **PDF Generation:** pdf-lib
- **API Calls:** Axios
- **Styling:** Custom CSS

## Getting Started

### Prerequisites

- Node.js (>= 12.x)
- npm (>= 6.x)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/aircraft-checklist-pdf-generator.git
   cd aircraft-checklist-pdf-generator
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

This will start both the backend server and the React development server concurrently.

- Backend server runs on http://localhost:5000
- Frontend development server runs on http://localhost:3000

### Production Build

To create a production build, run:
```bash
npm run build
```

Then start the server:
```bash
npm start
```

The production server will serve the static files from the build directory and handle API requests.

## How It Works

1. The application fetches a list of available aircraft checklist files from msfschecklist.de
2. Users can browse and select the desired aircraft and variant (standard or dark mode)
3. When a user clicks "Generate PDF", the application fetches the individual checklist images
4. The images are compiled into a single PDF document
5. The PDF is sent to the user's browser for download

## License

MIT