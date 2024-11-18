'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Package,
  Clock,
  ChefHat,
  MapPin,
  ShoppingBag,
  AlertCircle
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Container,
  Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ParticleBackground from '@/components/particles'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <Typography variant="h5" color="error">Failed to load orders: {error}</Typography>
      </Box>
    )
  }

  if (orders.length === 0) {
    return (
      <Box className="min-h-screen flex flex-col items-center justify-center gap-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
        <Typography variant="h4" sx={{ color: 'text.secondary' }}>No orders yet</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Your order history will appear here</Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/ourchefs')}
          sx={{
            bgcolor: '#FC8019',
            '&:hover': {
              bgcolor: '#e67316',
            }
          }}
        >
          Browse Chefs
        </Button>
      </Box>
    )
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>Your Orders</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {orders.map((order) => (
          <Card key={order._id} elevation={2}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Package className="w-5 h-5" />
                    <Typography variant="h6">Order #{order._id.slice(-8)}</Typography>
                  </Box>
                  <Chip
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    color={
                      order.status === 'completed' ? 'success' :
                      order.status === 'processing' ? 'primary' :
                      'warning'
                    }
                  />
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <Clock className="w-4 h-4" />
                  <Typography>
                    {new Date(order.createdAt).toLocaleDateString()} at {
                      new Date(order.createdAt).toLocaleTimeString()
                    }
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <ChefHat className="w-4 h-4" />
                  <Typography>Chef: {order.chefName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <MapPin className="w-4 h-4" />
                  <Typography>{order.deliveryAddress}</Typography>
                </Box>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Order Items</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {order.items.map((item, index) => (
                        <Box key={index}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            py: 1
                          }}>
                            <Typography>{item.name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography color="text.secondary">x{item.quantity}</Typography>
                              <Typography>₹{item.price}</Typography>
                            </Box>
                          </Box>
                          {index !== order.items.length - 1 && <Divider />}
                        </Box>
                      ))}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pt: 2,
                        fontWeight: 'bold'
                      }}>
                        <Typography fontWeight="bold">Total</Typography>
                        <Typography fontWeight="bold">₹{order.total}</Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}