#!/bin/bash

# PBR Anywhere Setup Script
# This script sets up the development environment for the PBR Anywhere application

set -e

echo "🚀 Setting up PBR Anywhere Development Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) ✓"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    print_success "npm $(npm --version) ✓"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Docker is required for local development."
        print_status "Visit: https://docs.docker.com/get-docker/"
    else
        print_success "Docker $(docker --version) ✓"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. Docker Compose is required for local development."
        print_status "Visit: https://docs.docker.com/compose/install/"
    else
        print_success "Docker Compose $(docker-compose --version) ✓"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi
    
    # Install scraper dependencies
    if [ -d "scraper" ]; then
        print_status "Installing scraper dependencies..."
        cd scraper
        npm install
        cd ..
    fi
    
    # Install recorder dependencies
    if [ -d "recorder" ]; then
        print_status "Installing recorder dependencies..."
        cd recorder
        npm install
        cd ..
    fi
    
    # Install infrastructure dependencies
    if [ -d "infrastructure" ]; then
        print_status "Installing infrastructure dependencies..."
        cd infrastructure
        npm install
        cd ..
    fi
    
    print_success "All dependencies installed successfully!"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "Environment file created from template"
            print_warning "Please edit .env file with your actual configuration values"
        else
            print_warning "No environment template found. Please create .env file manually"
        fi
    else
        print_success "Environment file already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Starting database services with Docker Compose..."
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        # Run database migrations
        if [ -d "backend" ]; then
            print_status "Running database migrations..."
            cd backend
            npm run migrate
            cd ..
        fi
        
        print_success "Database setup completed!"
    else
        print_warning "Docker not available. Please set up PostgreSQL and Redis manually."
        print_status "Database connection details:"
        print_status "  Host: localhost"
        print_status "  Port: 5432"
        print_status "  Database: pbr_anywhere"
        print_status "  Username: pbr_user"
        print_status "  Password: pbr_password"
    fi
}

# Build Docker images
build_docker_images() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Building Docker images..."
        docker-compose build
        
        print_success "Docker images built successfully!"
    else
        print_warning "Docker not available. Skipping Docker build."
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p uploads
    mkdir -p recordings
    mkdir -p temp
    
    print_success "Directories created successfully!"
}

# Setup Git hooks (optional)
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_status "Setting up Git hooks..."
        
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."
npm run lint
npm run test
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configured!"
    fi
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo "=================================="
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Configure your environment:"
    echo "   - Edit .env file with your configuration"
    echo "   - Set up AWS credentials if using cloud features"
    echo ""
    echo "2. Start the development environment:"
    echo "   - With Docker: docker-compose up"
    echo "   - Without Docker: npm run dev"
    echo ""
    echo "3. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:8000"
    echo "   - Database: localhost:5432"
    echo "   - Redis: localhost:6379"
    echo ""
    echo "4. Useful commands:"
    echo "   - npm run dev          # Start development servers"
    echo "   - npm run build        # Build for production"
    echo "   - npm run test         # Run tests"
    echo "   - docker-compose up    # Start all services"
    echo "   - docker-compose down  # Stop all services"
    echo ""
    echo "5. Documentation:"
    echo "   - README.md            # Project overview"
    echo "   - API docs: http://localhost:8000/docs"
    echo ""
    echo "Happy coding! 🐂"
}

# Main setup function
main() {
    echo "Starting PBR Anywhere setup..."
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    create_directories
    setup_database
    build_docker_images
    setup_git_hooks
    show_next_steps
}

# Run setup
main "$@"
