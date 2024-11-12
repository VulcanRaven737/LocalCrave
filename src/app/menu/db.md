I've created a component that:

Matches Your Theme Exactly:

Uses ParticleBackground
Same color scheme (#FC8019 accent)
Same typography and spacing
Same hover animations
Consistent with your existing design


MongoDB Integration Ready:

Data structure mirrors a typical MongoDB schema
Built-in city filtering (easily expandable)
Prepared fetch function for future API integration



To connect this to MongoDB, you'll just need to:

Create your MongoDB schema:

javascriptCopy// In your backend models/MenuItem.js
const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  cookingTime: String,
  isVegetarian: Boolean,
  rating: Number,
  availableQuantity: Number,
  city: String
});

Create your Express route:

javascriptCopy// In your backend routes/menu.js
router.get('/api/menu', async (req, res) => {
  try {
    const { city } = req.query;
    const query = city && city !== 'all' ? { city } : {};
    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

Update the fetchMenuItems function:

javascriptCopy// In your React component, just uncomment the API call in fetchMenuItems:
const fetchMenuItems = async (city = "all") => {
  try {
    const response = await fetch(`/api/menu?city=${city}`);
    const data = await response.json();
    setMenuItems(data);
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};


The new functionality integrates seamlessly with the existing design and MongoDB-ready structure. When you implement the MongoDB backend, you won't need to modify any of the location detection code.
To use this with your MongoDB setup, you'll just need to:

Add the coordinates to your city data in MongoDB (if you want to store them there)
Implement the API endpoint as previously described
Replace the demo data filtering with actual API calls

Would you like me to explain any part of the location detection implementation or make any adjustments to how it works?