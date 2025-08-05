# Lumino - Applicant Tracking system


Lumino is a an ai ATS that helps users optimize their resumes for Applicant Tracking Systems (ATS) and provides comprehensive analytics to improve job application success rates.

## Features

### Resume Analysis
- **ATS Score Calculation**: Get an objective score of how well your resume will perform with ATS systems
- **Detailed Feedback**: Receive specific suggestions to improve your resume
- **Keyword Analysis**: Identify missing keywords from job descriptions

### Analytics Dashboard
- **Resume Performance Metrics**: View average ATS scores and distribution
- **Skill Gap Analysis**: Identify missing skills based on your target job
- **Company Application Tracking**: Track which companies you've applied to

### Resume Management
- **Resume Comparison**: Compare multiple versions of your resume
- **Resume Export**: Download your resume in PDF, DOCX, or TXT formats
- **File Upload**: Easy drag-and-drop interface for uploading resumes

### Job Search Tools
- **Job Recommendations**: Get personalized job matches based on your skills
- **Skill Suggestions**: Receive recommendations for skills to add to your resume

### User Experience
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Tracking**: Visual feedback during file uploads

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/lumino.git
   cd lumino
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Technology Stack

- **Frontend**: React 19, React Router 7
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **PDF Processing**: PDF.js
- **File Handling**: React Dropzone
- **Containerization**: Docker

## Project Structure

```
├── app/                  # Main application code
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and context providers
│   ├── routes/           # Application routes
│   └── app.css           # Global styles
├── public/               # Static assets
│   ├── icons/            # SVG icons
│   └── images/           # Images and graphics
├── constants/            # Application constants
└── types/                # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

