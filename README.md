# Aircraft Checklist PDF Generator

A modern web application that allows users to select aircraft checklists and convert them into downloadable PDF files. The application fetches checklist images from msfschecklist.de and compiles them into a single PDF document.

## Features

- Browse available aircraft checklists
- Choose between standard and dark mode variants
- Generate and download PDF checklists
- Responsive design for mobile and desktop use

## Tech Stack

- **Frontend:** React.js with Tailwind CSS and shadcn/ui
- **Backend:** Node.js with Express
- **PDF Generation:** pdf-lib
- **API Calls:** Axios
- **Styling:** Tailwind CSS, shadcn/ui

## Tailwind CSS & shadcn/ui

This project uses [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and [shadcn/ui](https://ui.shadcn.com/) for accessible, beautiful React components. All custom CSS and styled-components have been removed in favor of this modern stack.

- To customize styles, edit `tailwind.config.js` and use Tailwind utility classes in your components.
- To add new UI components, use shadcn/ui or Headless UI for best accessibility and design.
- Dark mode is enabled via Tailwind's `dark` class strategy.

## Project Structure

```
pdf-checklists/
├── public/              # Static public assets
├── server/              # Backend server code
│   ├── routes/          # API route handlers
│   │   ├── files.js     # Aircraft file index routes
│   │   └── pdf.js       # PDF generation routes
│   ├── utils/           # Utility functions
│   │   └── pdfGenerator.js  # PDF generation logic
│   └── server.js        # Main server application
├── src/                 # React frontend code
│   ├── components/      # React components
│   ├── services/        # API service functions
│   ├── styles/          # CSS modules
│   │   ├── base.css     # Base styling
│   │   ├── layout.css   # Layout components
│   │   ├── aircraft.css # Aircraft components
│   │   ├── ...          # Other component styles
│   │   └── index.css    # CSS entry point
│   ├── ThemeProvider.js # Styled-components theme
│   ├── App.js           # Main React component
│   └── index.js         # React entry point
└── server.js            # Server entry point
```

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