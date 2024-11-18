// ChefCard.tsx
import Image from 'next/image';
import { Star, Mail, Clock, Users, Leaf, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  cookingTime: string;
  available: boolean;
  isVegetarian: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChefMenuData {
  chefEmail: string;
  items: MenuItem[];
}

interface ChefCardProps {
  chef: {
    _id: string;
    email: string;
    name: string;
    image: string | null;
    createdAt: string;
    rating?: number;
    specialities?: string[];
    city?: string;
  };
  userId: string;
}

export const ChefCard = ({ chef, userId }: ChefCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchChefMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/ourchefs?chefEmail=${encodeURIComponent(chef.email)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.statusText}`);
      }
      
      const data: ChefMenuData = await response.json();
      setMenuItems(data.items || []);
    } catch (error) {
      console.error('Error fetching chef menu:', error);
      setError('Failed to load menu items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async () => {
    setIsMenuOpen(true);
    if (menuItems.length === 0 && !error) {
      await fetchChefMenu();
    }
  };

  const handleClose = () => {
    setIsMenuOpen(false);
    setError(null);
    setSelectedItem(null);
    setQuantity(1);
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prev => {
      const newQuantity = increment ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(10, newQuantity));
    });
  };

  const handleAddToCart = async (item: MenuItem) => {
    try {
      setAddingToCart(true);
      const response = await fetch('/api/ourchefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          chefId: chef._id,
          itemId: item.id,
          quantity,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to add to cart');
      }
  
      // Store cart item in localStorage
      const cartItem = {
        userId,
        chefId: chef._id,
        chefName: chef.name,
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        quantity,
        image: item.image,
        addedAt: new Date().toISOString()
      };
  
      // Retrieve existing cart items
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(
        (cartItem: any) => 
          cartItem.itemId === item.id && cartItem.chefId === chef._id
      );
  
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        existingCart.push(cartItem);
      }
  
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
  
      showNotification('Item added to cart successfully!', 'success');
      setSelectedItem(null);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add item to cart. Please try again.', 'error');
    } finally {
      setAddingToCart(false);
    }
  };
  
  return (
    <>
      <Card 
        sx={{ 
          maxWidth: 345,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)'
          },
          borderRadius: 4
        }}
      >
        <CardActionArea onClick={handleCardClick}>
          <Box sx={{ position: 'relative', height: 200 }}>
            <Image 
              src={chef.image || '/images/chefs-hat.webp'}
              alt={chef.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" component="h3">
                {chef.name}
              </Typography>
              {chef.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star style={{ width: 16, height: 16, color: '#FFB400', fill: '#FFB400' }} />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {chef.rating}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Mail style={{ width: 16, height: 16, marginRight: 8 }} />
              <Typography variant="body2" color="text.secondary">
                {chef.email}
              </Typography>
            </Box>

            {chef.specialities && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {chef.specialities.map((speciality, index) => (
                  <Chip
                    key={index}
                    label={speciality}
                    size="small"
                    sx={{ bgcolor: 'grey.100' }}
                  />
                ))}
              </Box>
            )}

            {chef.city && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📍 {chef.city}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              Member since {new Date(chef.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Dialog 
        open={isMenuOpen} 
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6">{chef.name}'s Menu</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#FC8019' }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error">{error}</Typography>
              <Button 
                onClick={fetchChefMenu}
                variant="contained"
                sx={{ mt: 2, bgcolor: '#FC8019', '&:hover': { bgcolor: '#E57316' } }}
              >
                Retry
              </Button>
            </Box>
          ) : menuItems.length === 0 ? (
            <Typography 
              align="center" 
              color="text.secondary" 
              sx={{ py: 4 }}
            >
              No menu items available
            </Typography>
          ) : (
            <Grid container spacing={3} sx={{ pt: 2 }}>
              {menuItems.map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      height: '100%'
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 200, mb: 2 }}>
                      <Image
                        src={item.image || '/images/food.jpeg'}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">
                          {item.name}
                        </Typography>
                        {item.isVegetarian && (
                          <Chip
                            icon={<Leaf size={16} />}
                            label="Veg"
                            size="small"
                            sx={{
                              bgcolor: '#E8F5E9',
                              color: '#2E7D32',
                              '& .MuiChip-icon': {
                                color: '#2E7D32'
                              }
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ color: '#FC8019' }}>
                        ₹{item.price}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{ mb: 2, bgcolor: 'grey.100' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'text.secondary',
                        mb: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Clock size={16} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {item.cookingTime} mins
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.available ? (
                          <Chip
                            label="Available"
                            size="small"
                            sx={{ bgcolor: '#E8F5E9' }}
                          />
                        ) : (
                          <Chip
                            label="Unavailable"
                            size="small"
                            sx={{ bgcolor: '#FFEBEE' }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {selectedItem?.id === item.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <IconButton 
                            onClick={() => handleQuantityChange(false)}
                            size="small"
                            sx={{ bgcolor: 'grey.100' }}
                          >
                            <Minus size={16} />
                          </IconButton>
                          <Typography>{quantity}</Typography>
                          <IconButton 
                            onClick={() => handleQuantityChange(true)}
                            size="small"
                            sx={{ bgcolor: 'grey.100' }}
                          >
                            <Plus size={16} />
                          </IconButton>
                          <Button
                            variant="contained"
                            onClick={() => handleAddToCart(item)}
                            disabled={addingToCart}
                            sx={{ 
                              bgcolor: '#FC8019', 
                              '&:hover': { bgcolor: '#E57316' }
                            }}
                          >
                            {addingToCart ? 'Adding...' : 'Add to Cart'}
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          startIcon={<ShoppingCart size={16} />}
                          onClick={() => setSelectedItem(item)}
                          disabled={!item.available}
                          sx={{ 
                            borderColor: '#FC8019',
                            color: '#FC8019',
                            '&:hover': { 
                              borderColor: '#E57316',
                              bgcolor: 'rgba(252, 128, 25, 0.04)'
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChefCard;