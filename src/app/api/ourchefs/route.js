import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const chefEmail = searchParams.get('chefEmail')
    
    const client = await clientPromise
    const db = client.db('your-db-name')

    if (chefEmail) {
      const menuData = await db.collection('menus').findOne({ chefEmail })
      
      if (!menuData) {
        return NextResponse.json({ 
          chefEmail, 
          items: [] 
        })
      }
      
      return NextResponse.json({
        chefEmail: menuData.chefEmail,
        items: menuData.items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price.toString(),
          category: item.category,
          image: item.image,
          isVegetarian: item.isVegetarian,
          available: item.available,
          cookingTime: item.cookingTime?.toString() || "30",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }))
      })
    }
    
    const chefsCollection = db.collection('chefs')
    let query = {}
    if (city && city !== 'all') {
      query = { city }
    }
    
    const chefs = await chefsCollection.find(query).toArray()
    return NextResponse.json(chefs)
  } catch (error) {
    console.error('Database error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, chefId, itemId, quantity } = body

    if (!userId || !chefId || !itemId || !quantity) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('your-db-name')

    // First, fetch the item name from the menus collection
    const menu = await db.collection('menus').findOne(
      { "items.id": itemId },
      { projection: { "items.$": 1 } }
    )

    if (!menu || !menu.items || !menu.items[0]) {
      return new NextResponse('Item not found', { status: 404 })
    }

    const itemName = menu.items[0].name

    const cartItem = {
      userId,
      chefId,
      itemName, // Store item name instead of itemId
      quantity,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection('carts').updateOne(
      { userId, chefId, itemName }, // Update match condition to use itemName
      { $set: cartItem },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}