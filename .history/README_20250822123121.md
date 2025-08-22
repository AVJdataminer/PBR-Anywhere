# PBR Anywhere

A comprehensive application that allows users to view PBR (Professional Bull Riders) events on-demand after they've aired live. Users can access recorded events from various streaming platforms including Fox Nation, CW, CBS, and more.

## Features

- **Live Event Monitoring**: Automatically tracks PBR events from the official schedule
- **Multi-Platform Recording**: Records events from Fox Nation, CW, CBS, and other platforms
- **User Authentication**: Secure login system for various streaming platform credentials
- **On-Demand Playback**: Watch recorded events anytime after they've aired
- **PBR Branded Interface**: Authentic PBR look and feel throughout the application
- **Cloud Infrastructure**: Scalable EC2-based recording and storage system

## Architecture

### Frontend
- React.js with TypeScript
- PBR-themed UI components
- Responsive design for mobile and desktop
- Video player with PBR branding

### Backend
- Node.js/Express API
- Web scraping for PBR event schedules
- User authentication and credential management
- Video recording orchestration

### Infrastructure
- AWS EC2 instances for video recording
- S3 for video storage
- RDS for user data and event metadata
- CloudFront for video delivery

## Prerequisites

- Node.js 18+
- AWS CLI configured
- Docker (for local development)
- FFmpeg (for video processing)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PBR-Anywhere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS credentials and other settings
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

## Configuration

### AWS Setup
- Create EC2 instances for video recording
- Configure S3 buckets for video storage
- Set up RDS database
- Configure CloudFront distribution

### Streaming Platform Credentials
- Fox Nation account
- CW account
- CBS/Hulu credentials
- Other platform access

## Development

### Project Structure
```
PBR-Anywhere/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── scraper/           # PBR schedule web scraper
├── recorder/          # Video recording service
├── infrastructure/    # AWS infrastructure code
└── docs/             # Documentation
```

### Available Scripts
- `npm run dev` - Start development environment
- `npm run build` - Build for production
- `npm run deploy` - Deploy to AWS
- `npm run test` - Run test suite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is designed for personal use and educational purposes. Users are responsible for ensuring they have proper access to streaming platforms and comply with all applicable terms of service.
