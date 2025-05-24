# GaxteIA - Expense Tracking Application

A modern expense tracking application built with React, TypeScript, and Firebase.

## Features

- User authentication
- Expense tracking with categories
- Expense reports with charts
- PDF report generation
- Offline support
- Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd vite-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Deployment

This application is configured for deployment on Vercel. To deploy:

1. Create a new project on Vercel
2. Connect your repository
3. Add the environment variables from your `.env` file to the Vercel project settings
4. Deploy!

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI
- Firebase
- React Router
- React PDF
- Chart.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details