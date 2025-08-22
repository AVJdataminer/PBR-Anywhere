# PBR Anywhere - Quick Start Guide

Get your PBR Anywhere application up and running in minutes! 🚀

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Docker & Docker Compose** - [Install here](https://docs.docker.com/get-docker/)

## 🚀 Quick Start (Recommended)

### 1. Clone and Setup
```bash
# Clone the repository (if you haven't already)
git clone <your-repo-url>
cd PBR-Anywhere

# Run the automated setup script
./setup.sh
```

### 2. Start the Application
```bash
# Start all services with Docker
docker-compose up

# Or start without Docker
npm run dev
```

### 3. Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Manual Setup

If you prefer to set up manually:

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..

# Scraper
cd scraper && npm install && cd ..

# Recorder
cd recorder && npm install && cd ..

# Infrastructure
cd infrastructure && npm install && cd ..
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your settings
nano .env
```

### 3. Database Setup
```bash
# Start database services
docker-compose up -d postgres redis

# Run migrations
cd backend && npm run migrate && cd ..
```

### 4. Start Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build --no-cache
```

## 📱 What You'll See

1. **PBR Anywhere Homepage** - Beautiful PBR-themed landing page
2. **Event Schedule** - Upcoming PBR events from the official website
3. **Recording Management** - Schedule and monitor video recordings
4. **Video Playback** - Watch recorded events on-demand
5. **User Authentication** - Secure login system

## 🔍 Key Features

- **Automatic Event Scraping** - Monitors PBR.com for new events
- **Multi-Platform Recording** - Fox Nation, CW, CBS, RidePass
- **EC2-Based Recording** - Scalable cloud recording infrastructure
- **PBR Branding** - Authentic bull riding look and feel
- **Responsive Design** - Works on all devices

## 🚨 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :3000
lsof -i :8000

# Kill process
kill -9 <PID>
```

**Database connection failed:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres
```

**Dependencies not found:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- Check the logs: `docker-compose logs -f`
- Verify environment variables in `.env`
- Ensure all required ports are available
- Check Docker is running: `docker info`

## 🎯 Next Steps

1. **Customize Configuration** - Edit `.env` file
2. **Add AWS Credentials** - For cloud recording features
3. **Configure Streaming Platforms** - Add your login credentials
4. **Deploy to Production** - Use the infrastructure code
5. **Monitor Performance** - Check CloudWatch logs

## 📚 Documentation

- **README.md** - Comprehensive project overview
- **API Documentation** - Available at `/api/docs` when running
- **Infrastructure** - AWS CDK code in `/infrastructure`
- **Database Schema** - Check `/backend/migrations`

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs -f`
3. Verify your environment configuration
4. Check the GitHub issues page

---

**Happy Bull Riding! 🐂**

Your PBR Anywhere application is now ready to capture and deliver the thrill of professional bull riding events on-demand!
