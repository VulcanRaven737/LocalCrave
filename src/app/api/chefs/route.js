import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';

// Utility function to create a collection if it doesn't exist
async function createCollectionIfNotExists(collectionName) {
  const client = await clientPromise;
  const db = client.db('your-db-name');
  
  const collections = await db.listCollections().toArray();
  const collectionExists = collections.some(collection => collection.name === collectionName);

  if (!collectionExists) {
    await db.createCollection(collectionName);
    console.log(`Collection "${collectionName}" created.`);
  }
}

// Function to create chef profile if not exists
async function createChefProfile(session) {
  const client = await clientPromise;
  const chefCollection = client.db('your-db-name').collection('chefs');
  
  const existingChef = await chefCollection.findOne({ email: session.user.email });

  if (!existingChef) {
    const defaultProfile = {
      email: session.user.email,
      name: session.user.name || 'New Chef',
      image: session.user.image || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await chefCollection.insertOne(defaultProfile);
    console.log(`Chef profile for ${session.user.email} created.`);
  }
}

// Function to get chef's private menu data
async function getChefMenu(session) {
  await createCollectionIfNotExists('menus');
  const client = await clientPromise;
  const menuCollection = client.db('your-db-name').collection('menus');
  
  const menu = await menuCollection
    .find({ chefEmail: session.user.email })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();
    
  return menu[0]?.items || [];
}
// Enhanced getChefProfile function
async function getChefProfile(session) {
  await createCollectionIfNotExists('chefs');
  await createChefProfile(session);

  const client = await clientPromise;
  const chefCollection = client.db('your-db-name').collection('chefs');
  return await chefCollection.findOne({ email: session.user.email });
}

// Enhanced getChefOrders function
async function getChefOrders(session) {
  await createCollectionIfNotExists('orders');
  const client = await clientPromise;
  const orderCollection = client.db('your-db-name').collection('orders');
  
  return await orderCollection
    .find({ chefEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();
}

// Enhanced getChefEarnings function
async function getChefEarnings(session) {
  await createCollectionIfNotExists('orders');
  const client = await clientPromise;
  const orderCollection = client.db('your-db-name').collection('orders');
  
  const orders = await orderCollection.find({ 
    chefEmail: session.user.email,
    status: 'completed'
  }).sort({ date: -1 }).toArray();
  
  const total = orders.reduce((sum, order) => sum + order.amount, 0);
  const recent = orders
    .slice(0, 10)
    .map(order => ({
      amount: order.amount,
      date: order.date,
      feedback: order.feedback
    }));

  return { total, recent };
}

// Enhanced addMenuItem function with atomic updates and isVegetarian option
async function addMenuItem(session, menuItem) {
  await createCollectionIfNotExists('menus');
  const client = await clientPromise;
  const menuCollection = client.db('your-db-name').collection('menus');
  
  const existingMenu = await menuCollection.findOne({ chefEmail: session.user.email });
  
  let result;
  if (!existingMenu) {
    result = await menuCollection.insertOne({
      chefEmail: session.user.email,
      items: [menuItem],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } else {
    // Use $addToSet to prevent duplicate items
    result = await menuCollection.findOneAndUpdate(
      { chefEmail: session.user.email },
      { 
        $addToSet: { items: menuItem },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
  }

  // Return the complete updated menu
  return await getChefMenu(session);
}

// Enhanced updateMenuItem function
async function updateMenuItem(session, itemId, updatedData) {
  const client = await clientPromise;
  const menuCollection = client.db('your-db-name').collection('menus');
  
  await menuCollection.updateOne(
    { 
      chefEmail: session.user.email,
      'items.id': itemId 
    },
    { 
      $set: { 
        'items.$.name': updatedData.name,
        'items.$.description': updatedData.description,
        'items.$.price': updatedData.price,
        'items.$.category': updatedData.category,
        'items.$.image': updatedData.image,
        'items.$.isVegetarian': updatedData.isVegetarian,
        'items.$.available': updatedData.available,
        'items.$.updatedAt': new Date()
      }
    }
  );

  return await getChefMenu(session);
}

// Enhanced deleteMenuItem function
async function deleteMenuItem(session, itemId) {
  const client = await clientPromise;
  const menuCollection = client.db('your-db-name').collection('menus');
  
  await menuCollection.updateOne(
    { chefEmail: session.user.email },
    { 
      $pull: { items: { id: itemId } },
      $set: { updatedAt: new Date() }
    }
  );

  return await getChefMenu(session);
}

// GET handler
export async function GET(request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'profile':
        const profile = await getChefProfile(session);
        return NextResponse.json(profile, { status: 200 });
      case 'menu':
        const menu = await getChefMenu(session);
        return NextResponse.json(menu, { status: 200 });
      case 'orders':
        const orders = await getChefOrders(session);
        return NextResponse.json({ orders }, { status: 200 });
      case 'earnings':
        const earnings = await getChefEarnings(session);
        return NextResponse.json(earnings, { status: 200 });
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing GET request:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Enhanced POST handler
export async function POST(request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.type === 'menu' && body.action === 'add') {
      // Enhanced menuItem with isVegetarian option
      const menuItem = {
        id: body.data.id || crypto.randomUUID(),
        name: body.data.name,
        description: body.data.description,
        price: parseFloat(body.data.price),
        category: body.data.category,
        image: body.data.image || null,
        isVegetarian: body.data.isVegetarian || false,
        available: body.data.available ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedMenu = await addMenuItem(session, menuItem);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Menu item added successfully',
        menu: updatedMenu,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    if (body.type === 'profile') {
      const result = await updateChefProfile(session, body.data);
      return NextResponse.json({ 
        success: true,
        profile: result,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Enhanced PATCH handler
export async function PATCH(request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.type === 'menu') {
      if (body.action === 'update' && body.itemId) {
        const updatedMenu = await updateMenuItem(session, body.itemId, body.data);
        return NextResponse.json({ 
          success: true,
          message: 'Menu item updated successfully',
          menu: updatedMenu,
          timestamp: new Date().toISOString()
        }, { status: 200 });
      }

      const client = await clientPromise;
      const menuCollection = client.db('your-db-name').collection('menus');
      
      await menuCollection.findOneAndUpdate(
        { chefEmail: session.user.email },
        { 
          $set: { 
            items: body.menu,
            updatedAt: new Date()
          }
        },
        { 
          upsert: true,
          returnDocument: 'after'
        }
      );

      const updatedMenu = await getChefMenu(session);
      return NextResponse.json({ 
        success: true,
        message: 'Menu updated successfully',
        menu: updatedMenu,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    if (body.type === 'orders' && body.action === 'updateStatus') {
      const result = await updateOrderStatus(session, body.orderId, body.status);
      return NextResponse.json({
        success: true,
        result,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error processing PATCH request:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Enhanced DELETE handler
export async function DELETE(request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.type === 'menu' && body.action === 'delete') {
      const updatedMenu = await deleteMenuItem(session, body.itemId);
      return NextResponse.json({ 
        success: true,
        message: 'Menu item deleted successfully',
        menu: updatedMenu,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    if (body.type === 'orders') {
      const client = await clientPromise;
      const orderCollection = client.db('your-db-name').collection('orders');
      await orderCollection.deleteMany({ chefEmail: session.user.email });
      return NextResponse.json({ 
        success: true,
        message: 'Orders deleted successfully',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}