import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow,
  Schedule,
  LocationOn,
  SportsMotorsports,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Mock featured events data
  const featuredEvents = [
    {
      id: 1,
      title: 'Austin Gambler Days',
      date: 'Aug 22-24, 2025',
      location: 'Austin, TX',
      platform: 'Fox Nation & CW',
      image: '/api/placeholder/400/250',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Missouri Thunder Days',
      date: 'Aug 29-31, 2025',
      location: 'Springfield, MO',
      platform: 'Fox Nation & CBS',
      image: '/api/placeholder/400/250',
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'PBR Teams: Anaheim',
      date: 'Sep 5-7, 2025',
      location: 'Anaheim, CA',
      platform: 'Fox Nation & CW',
      image: '/api/placeholder/400/250',
      status: 'upcoming',
    },
  ];

  const features = [
    {
      icon: <SportsMotorsports sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Live Event Recording',
      description: 'Automatically record PBR events from Fox Nation, CW, CBS, and more streaming platforms.',
    },
    {
      icon: <PlayArrow sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'On-Demand Playback',
      description: 'Watch recorded events anytime, anywhere with our high-quality video player.',
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Smart Scheduling',
      description: 'Never miss a PBR event with our intelligent recording scheduler.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Multi-Platform Support',
      description: 'Access your recordings across all devices and platforms.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, rgba(139, 0, 0, 0.9) 0%, rgba(102, 0, 0, 0.9) 100%), 
                       url('/api/placeholder/1920/800') center/cover`,
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    color: theme.palette.secondary.main,
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  PBR ANYWHERE
                </Typography>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 4,
                    fontWeight: 600,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  Never Miss a Bull Riding Event Again
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 4,
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  Watch PBR events on-demand after they've aired live. Our intelligent recording system 
                  captures events from Fox Nation, CW, CBS, and more platforms, so you can enjoy 
                  the thrill of bull riding anytime, anywhere.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={() => navigate('/events')}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                    }}
                  >
                    View Events
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="secondary"
                    onClick={() => navigate('/recordings')}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.main,
                      '&:hover': {
                        borderColor: theme.palette.secondary.light,
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    }}
                  >
                    Watch Recordings
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  <SportsMotorsports
                    sx={{
                      fontSize: 200,
                      color: theme.palette.secondary.main,
                      opacity: 0.3,
                      filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
                    }}
                  />
                  <Typography
                    variant="h2"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: theme.palette.text.primary,
                      fontWeight: 800,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    8 SECONDS
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{ mb: 6, color: theme.palette.text.primary }}
          >
            Why Choose PBR Anywhere?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ mb: 2, color: theme.palette.text.primary }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Featured Events Section */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              component="h2"
              align="center"
              sx={{ mb: 6, color: theme.palette.text.primary }}
            >
              Upcoming Events
            </Typography>
            
            <Grid container spacing={4}>
              {featuredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                        },
                      }}
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={event.image}
                        alt={event.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Chip
                            label={event.status}
                            color="primary"
                            size="small"
                            icon={<Star />}
                          />
                          <Chip
                            label={event.platform}
                            color="secondary"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{ mb: 2, color: theme.palette.text.primary }}
                        >
                          {event.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Schedule sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.date}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationOn sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<PlayArrow />}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                onClick={() => navigate('/events')}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    borderColor: theme.palette.secondary.light,
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                View All Events
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{ mb: 3, color: theme.palette.text.primary }}
            >
              Ready to Never Miss a PBR Event?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: theme.palette.text.secondary }}
            >
              Join thousands of bull riding fans who trust PBR Anywhere to deliver 
              the best PBR content on-demand.
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => navigate('/register')}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 700,
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Get Started Today
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
