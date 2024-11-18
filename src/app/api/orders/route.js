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
    // Aggregate to join orders with chef information
    const orders = await db.collection('orders').aggregate([
      {
        $match: { userId: session.user.email }
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
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          _id: 1,
          items: 1,
          total: 1,
          status: 1,
          createdAt: 1,
          deliveryAddress: 1,
          chefName: '$chefData.name',
          chefId: 1
        }
      }
    ]).toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}