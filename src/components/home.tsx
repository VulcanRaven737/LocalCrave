import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Paper,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search, Menu, ShoppingBag, ChevronRight} from 'lucide-react';
import { useRouter } from 'next/navigation'

// Styled components
const StyledIconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '50%',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
  '& svg': {
    width: 48,
    height: 48,
    color: '#FC8019',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      icon: <Search />,
      title: "Find Your Chef",
      description: "Browse through our curated selection of home chefs in your area"
    },
    {
      icon: <Menu />,
      title: "Choose Your Meal",
      description: "Select from a variety of fresh, home-cooked dishes"
    },
    {
      icon: <ShoppingBag />,
      title: "Enjoy Your Food",
      description: "Get your meal delivered fresh to your doorstep"
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
          How It <Box component="span" sx={{ color: '#FC8019' }}>Works</Box>
        </Typography>
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <StyledIconWrapper>
                  {step.icon}
                </StyledIconWrapper>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Featured Dishes Section
const FeaturedDishes = () => {
  const dishes = [
    {
      name: "Homestyle Biryani",
      chef: "Chef Priya",
      price: "₹299",
      image: "/api/placeholder/300/200"
    },
    {
      name: "Butter Chicken",
      chef: "Chef Rahul",
      price: "₹349",
      image: "/api/placeholder/300/200"
    },
    {
      name: "South Indian Thali",
      chef: "Chef Lakshmi",
      price: "₹249",
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
          Featured <Box component="span" sx={{ color: '#FC8019' }}>Dishes</Box>
        </Typography>
        <Grid container spacing={4}>
          {dishes.map((dish, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={dish.image}
                  alt={dish.name}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {dish.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {dish.chef}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" component="span" sx={{ color: '#FC8019', fontWeight: 'bold' }}>
                      {dish.price}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        borderColor: '#FC8019', 
                        color: '#FC8019',
                        '&:hover': {
                          borderColor: '#FC8019',
                          backgroundColor: 'rgba(252, 128, 25, 0.04)'
                        }
                      }}
                    >
                      Order Now
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Call to Action Banner
const CTABanner = () => {
    const router = useRouter();
  return (
    <Box sx={{ bgcolor: '#FC8019', py: 8, color: 'white' }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 3, md: 0 }
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Become a Home Chef
            </Typography>
            <Typography variant="h6" component="p" sx={{ opacity: 0.9 }}>
              Share your culinary passion with food lovers in your community
            </Typography>
          </Box>
          <Button 
            variant="contained"
            size="large"
            endIcon={<ChevronRight />}
            sx={{ 
              bgcolor: 'white',
              color: '#FC8019',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
            onClick={()=>router.push('/auth/signin')}
          >
            Join as Chef
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export { HowItWorks, FeaturedDishes, CTABanner };