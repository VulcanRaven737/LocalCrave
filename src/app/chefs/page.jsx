'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dashboard as DashboardIcon,
  RestaurantMenu,
  ShoppingCart,
  AttachMoney,
  Add,
  Delete,
  ExpandMore
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Badge,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

const ChefDashboard = () => {
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState('dashboard');
  const [profile, setProfile] = useState({ name: '', specialties: [], cuisines: [] });
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, recent: [] });
  const [newMenuItem, setNewMenuItem] = useState({
    name: '', price: '', description: '', imageLink: '', category: '', cookingTime: '', isVegetarian: false, rating: 4.7, availableQuantity: 15, city: ''
  });
  const [isMenuDialog, setIsMenuDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const accentColor = '#FC8019'; // Preserved accent color

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const responses = await Promise.all([
        fetch('/api/chefs?type=profile'),
        fetch('/api/chefs?type=menu'),
        fetch('/api/chefs?type=orders'),
        fetch('/api/chefs?type=earnings')
      ]);
      
      const [profileData, menuData, ordersData, earningsData] = await Promise.all(
        responses.map(res => res.json())
      );

      setProfile(profileData);
      setMenuItems(menuData?.items || []);
      setOrders(ordersData?.orders || []);
      setEarnings(earningsData || { total: 0, recent: [] });
    } catch (err) {
      setError('Failed to load dashboard data');
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAddMenuItem = async () => {
    try {
      const response = await fetch('/api/chefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'menu',
          action: 'add',
          data: newMenuItem
        })
      });

      if (response.ok) {
        setMenuItems([...menuItems, newMenuItem]);
        setNewMenuItem({ name: '', price: '', description: '', imageLink: '', category: '', cookingTime: '', isVegetarian: false, rating: 4.7, availableQuantity: 15, city: '' });
        setIsMenuDialog(false);
        setSuccess('Menu item added successfully');
      }
    } catch (err) {
      setError('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    try {
      const response = await fetch('/api/chefs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'menu',
          action: 'delete',
          itemId
        })
      });

      if (response.ok) {
        setMenuItems(menuItems.filter(item => item.id !== itemId));
        setSuccess('Menu item deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete menu item');
    }
  };

  const renderDashboardSummary = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: accentColor, color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Today's Orders</Typography>
            <Typography variant="h4">{orders.filter(o => o.status === 'pending').length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: accentColor, color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Menu Items</Typography>
            <Typography variant="h4">{menuItems.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: accentColor, color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Today's Earnings</Typography>
            <Typography variant="h4">
              ₹{earnings.recent.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <div className="bg-gray-100 pt-32">
      <Box sx={{ 
        maxWidth: 1200, 
        margin: '2rem auto',
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Paper 
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: '1px solid',
              borderColor: 'divider',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back {profile.name}!
            </Typography>
          </Box>

          {/* Dashboard Content */}
          <Box sx={{ p: 3 }}>
            {(error || success) && (
              <Box sx={{ mb: 3 }}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
              </Box>
            )}

            <Accordion 
              expanded={expanded === 'dashboard'} 
              onChange={handleAccordionChange('dashboard')}
            >
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ bgcolor: expanded === 'dashboard' ? `${accentColor}15` : 'transparent' }}
              >
                <DashboardIcon sx={{ mr: 2, color: accentColor }} />
                <Typography variant="h6">Dashboard Overview</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderDashboardSummary()}
              </AccordionDetails>
            </Accordion>

            {/* Active Orders Section */}
            <Accordion 
              expanded={expanded === 'orders'} 
              onChange={handleAccordionChange('orders')}
            >
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ bgcolor: expanded === 'orders' ? `${accentColor}15` : 'transparent' }}
              >
                <ShoppingCart sx={{ mr: 2, color: accentColor }} />
                <Typography variant="h6">Active Orders</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {orders.filter(order => order.status === 'pending').map((order, index) => (
                    <ListItem key={index} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                      <ListItemText primary={`Order #${order.id}`} secondary={`Total: ₹${order.total}`} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Earnings Overview Section */}
            <Accordion 
              expanded={expanded === 'earnings'} 
              onChange={handleAccordionChange('earnings')}
            >
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ bgcolor: expanded === 'earnings' ? `${accentColor}15` : 'transparent' }}
              >
                <AttachMoney sx={{ mr: 2, color: accentColor }} />
                <Typography variant="h6">Earnings Overview</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Earnings</Typography>
                    <Typography variant="h4">₹{earnings.total.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>

            {/* Menu Management Section */}
            <Accordion 
              expanded={expanded === 'menu'} 
              onChange={handleAccordionChange('menu')}
            >
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ bgcolor: expanded === 'menu' ? `${accentColor}15` : 'transparent' }}
              >
                <RestaurantMenu sx={{ mr: 2, color: accentColor }} />
                <Typography variant="h6">Manage Menu</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {menuItems.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={item.name} 
                        secondary={`₹${item.price} | ${item.category}`} 
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleDeleteMenuItem(item.id)}>
                          <Delete sx={{ color: accentColor }} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }} 
                  startIcon={<Add />} 
                  onClick={() => setIsMenuDialog(true)}
                >
                  Add New Item
                </Button>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>
      </Box>

      {/* Add Menu Item Dialog */}
      <Dialog open={isMenuDialog} onClose={() => setIsMenuDialog(false)}>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Name" 
            variant="outlined" 
            value={newMenuItem.name} 
            onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})} 
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth 
            label="Price (₹)" 
            variant="outlined" 
            value={newMenuItem.price} 
            onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})} 
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth 
            label="Description" 
            variant="outlined" 
            value={newMenuItem.description} 
            onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})} 
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth 
            label="Image Link" 
            variant="outlined" 
            value={newMenuItem.imageLink} 
            onChange={(e) => setNewMenuItem({...newMenuItem, imageLink: e.target.value})} 
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newMenuItem.category}
              label="Category"
              onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
            >
              <MenuItem value="main-course">Main Course</MenuItem>
              <MenuItem value="starters">Starters</MenuItem>
              <MenuItem value="desserts">Desserts</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Is Vegetarian</InputLabel>
            <Select
              value={newMenuItem.isVegetarian ? "Yes" : "No"}
              label="Is Vegetarian"
              onChange={(e) => setNewMenuItem({...newMenuItem, isVegetarian: e.target.value === "Yes"})}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>

          <TextField 
            fullWidth 
            label="Cooking Time" 
            variant="outlined" 
            value={newMenuItem.cookingTime} 
            onChange={(e) => setNewMenuItem({...newMenuItem, cookingTime: e.target.value})} 
            sx={{ mb: 2 }}
          />

          <TextField 
            fullWidth 
            label="Available Quantity" 
            variant="outlined" 
            value={newMenuItem.availableQuantity} 
            onChange={(e) => setNewMenuItem({...newMenuItem, availableQuantity: e.target.value})} 
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={newMenuItem.city}
              label="City"
              onChange={(e) => setNewMenuItem({...newMenuItem, city: e.target.value})}
            >
              <MenuItem value="Chennai">Chennai</MenuItem>
              <MenuItem value="Bangalore">Bangalore</MenuItem>
              <MenuItem value="Hyderabad">Hyderabad</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMenuDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleAddMenuItem} color="primary">Add Item</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChefDashboard;
