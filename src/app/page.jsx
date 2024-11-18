'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ParticleBackground from '@/components/particles'
import ReviewsInfiniteScroll from '@/components/reviewsinfinite'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { LocalShipping, Timer, Restaurant, Security } from '@mui/icons-material'
import { HowItWorks, CTABanner } from '@/components/home'

// Styled components
const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2.5rem',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#FEF2E8',
  borderRadius: '50%',
  padding: '1.25rem',
  marginBottom: '1.5rem',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#FC8019',
  },
}));

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.userType === 'chef') {
      router.push('/chefs')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.userType === 'chef') {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      {/* Main Hero Section */}
      <main className="container mx-auto flex items-center justify-center min-h-screen pt-16 md:pt-32 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          {/* Left side content */}
          <div className="text-center lg:text-left lg:max-w-[45%] space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight">
              Premium <span> </span>
              <span className="text-[#FC8019] font-bold block sm:inline">
                quality <br className="hidden lg:hidden" />
                home-cooked
              </span>
              <span className="text-black block sm:inline mt-2 sm:mt-0 sm:ml-2">
                meals
              </span>
            </h1>
            <p className="text-base md:text-lg text-[#404040] leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
              Discover the comfort of fresh, home-cooked meals delivered right
              to your door. Ideal for anyone craving homemade flavors without
              the hassle of cooking, we offer a convenient, delicious way to
              enjoy nourishing meals that feel like home!
            </p>
            <div className="hidden md:hidden lg:block space-y-6">
              <p className="text-base md:text-lg text-black leading-relaxed font-bold">
                Popular cities in India
              </p>
              <p className="text-base md:text-lg text-black leading-relaxed">
                <button
                  onClick={() => router.push('/ourchefs')}
                  className="text-[#404040] hover:text-[#FC8019] transition-colors"
                >
                  Bengaluru
                </button>
                <button
                  onClick={() => router.push('/ourchefs')}
                  className="ml-8 text-[#FC8019] hover:text-[#404040] transition-colors"
                >
                  Chennai
                </button>
                <button
                  onClick={() => router.push('/ourchefs')}
                  className="ml-8 text-[#404040] hover:text-[#FC8019] transition-colors"
                >
                  Hyderabad
                </button>
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="flex gap-8 items-end overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 max-w-full scrollbar-hide">
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="images/rectangle1.svg"
                  alt="rect1"
                  width={400}
                  height={600}
                  className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 rounded-2xl shadow-lg"
                />
              </div>
              <div className="relative transform hover:scale-105 transition-transform duration-300 -mt-16">
                <Image
                  src="images/rectangle2.svg"
                  alt="rect2"
                  width={300}
                  height={450}
                  className="w-44 sm:w-48 md:w-56 lg:w-64 flex-shrink-0 rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12, mt: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 8, fontWeight: 'bold' }}
        >
          Why Choose <span style={{ color: '#FC8019' }}>Us</span>
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <IconWrapper>
                <LocalShipping />
              </IconWrapper>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quick and reliable delivery right to your doorstep
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <IconWrapper>
                <Timer />
              </IconWrapper>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                  Fresh Cooking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Meals prepared fresh upon order
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <IconWrapper>
                <Restaurant />
              </IconWrapper>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                  Expert Chefs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experienced home chefs with passion
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <IconWrapper>
                <Security />
              </IconWrapper>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                  Safety First
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Strict quality and hygiene standards
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ my: 12 }}>
        <HowItWorks />
      </Box>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: '#FEF2E8', py: 12, my: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} sm={4} md={3}>
              <Box textAlign="center">
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ color: '#FC8019', fontWeight: 'bold', mb: 2 }}
                >
                  500+
                </Typography>
                <Typography variant="h6" component="div">
                  Active Chefs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Box textAlign="center">
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ color: '#FC8019', fontWeight: 'bold', mb: 2 }}
                >
                  10k+
                </Typography>
                <Typography variant="h6" component="div">
                  Happy Customers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Box textAlign="center">
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ color: '#FC8019', fontWeight: 'bold', mb: 2 }}
                >
                  50k+
                </Typography>
                <Typography variant="h6" component="div">
                  Meals Delivered
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Reviews Section with added spacing */}
      <Box sx={{ my: 12 }}>
        <ReviewsInfiniteScroll />
      </Box>

      {/* CTA Banner with spacing */}
      <Box sx={{ mt: 12, mb: 8 }}>
        <CTABanner />
      </Box>
      
    </div>
  )
}