import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  const session = await getServerSession(req);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db('your-db-name');

  try {
    // Aggregate to join cart items with menu items to get full details
    const cartItems = await db.collection('carts').aggregate([
      {
        $match: { userId: session.user.email }
      },
      {
        $lookup: {
          from: 'menus',
          localField: 'chefId',
          foreignField: 'chefEmail',
          as: 'menuData'
        }
      },
      {
        $unwind: '$menuData'
      },
      {
        $addFields: {
          menuItem: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$menuData.items',
                  as: 'item',
                  cond: { $eq: ['$$item.name', '$itemName'] }
                }
              },
              0
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'chefs',
          localField: 'chefId',
          foreignField: 'email',
          as: 'chefData'
        }
      },
      {
        $unwind: '$chefData'
      },
      {
        $project: {
          _id: 1,
          itemName: 1,
          quantity: 1,
          chefId: 1,
          createdAt: 1,
          updatedAt: 1,
          price: '$menuItem.price',
          description: '$menuItem.description',
          image: '$menuItem.image',
          isVegetarian: '$menuItem.isVegetarian',
          cookingTime: '$menuItem.cookingTime',
          maxQuantity: { $ifNull: ['$menuItem.maxQuantity', 10] },
          chefName: '$chefData.name'
        }
      }
    ]).toArray();

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(req);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const cartCollection = client.db('your-db-name').collection('carts');

  try {
    const { itemName, chefId, quantity } = await req.json();

    if (!itemName || !chefId || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cartItem = {
      itemName,
      chefId,
      userId: session.user.email,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if item already exists in cart
    const existingItem = await cartCollection.findOne({
      userId: session.user.email,
      itemName,
      chefId
    });

    if (existingItem) {
      // Update quantity if item exists
      await cartCollection.updateOne(
        { _id: existingItem._id },
        { 
          $set: { 
            quantity: existingItem.quantity + quantity,
            updatedAt: new Date()
          } 
        }
      );
    } else {
      // Insert new item if it doesn't exist
      await cartCollection.insertOne(cartItem);
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(req);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const cartCollection = client.db('your-db-name').collection('carts');

  try {
    const { items } = await req.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
    }

    // Delete existing cart items
    await cartCollection.deleteMany({ userId: session.user.email });

    if (items.length > 0) {
      const cartItems = items.map(item => ({
        itemName: item.itemName,
        chefId: item.chefId,
        userId: session.user.email,
        quantity: item.quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await cartCollection.insertMany(cartItems);
    }

    return NextResponse.json({ message: 'Cart updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(req);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const cartCollection = client.db('your-db-name').collection('carts');

  try {
    await cartCollection.deleteMany({ userId: session.user.email });
    return NextResponse.json({ message: 'Cart deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting cart:', error);
    return NextResponse.json({ error: 'Failed to delete cart' }, { status: 500 });
  }
}