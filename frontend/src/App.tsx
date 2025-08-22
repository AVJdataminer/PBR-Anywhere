import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import RecordingsPage from './pages/RecordingsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import EventDetailPage from './pages/EventDetailPage';
import RecordingDetailPage from './pages/RecordingDetailPage';

// Context
import { AuthProvider } from './contexts/AuthContext';

// PBR Theme
const pbrTheme = createTheme({
  palette: {
    primary: {
      main: '#8B0000', // Dark red - PBR brand color
      light: '#B22222',
      dark: '#660000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFD700', // Gold - PBR accent color
      light: '#FFE55C',
      dark: '#B8860B',
      contrastText: '#000000',
    },
    background: {
      default: '#1A1A1A', // Dark background
      paper: '#2D2D2D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
    },
    error: {
      main: '#FF4444',
    },
    warning: {
      main: '#FF8800',
    },
    success: {
      main: '#00CC44',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.15)',
    '0 8px 16px rgba(0,0,0,0.2)',
    '0 16px 32px rgba(0,0,0,0.25)',
    '0 32px 64px rgba(0,0,0,0.3)',
    ...Array(19).fill('none'),
  ],
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={pbrTheme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
              }}
            >
              <Header />
              <Navigation />
              
              <Box
                component="main"
                sx={{
                  flex: 1,
                  py: 3,
                  px: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/recordings" element={<RecordingsPage />} />
                  <Route path="/recordings/:id" element={<RecordingDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </Box>
              
              <Footer />
              
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#2D2D2D',
                    color: '#FFFFFF',
                    border: '1px solid #8B0000',
                  },
                  success: {
                    iconTheme: {
                      primary: '#00CC44',
                      secondary: '#FFFFFF',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF4444',
                      secondary: '#FFFFFF',
                    },
                  },
                }}
              />
            </Box>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
