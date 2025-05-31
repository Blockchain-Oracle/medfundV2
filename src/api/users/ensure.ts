import { db } from '@/lib/db';
import { users, type NewUser } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

interface EnsureUserRequest {
  id: string;
  email: string;
  name: string;
}

export async function handler(req: Request) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json() as EnsureUserRequest;
    
    // Validate required fields
    if (!body.id || !body.email) {
      return new Response(JSON.stringify({ error: 'ID and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, body.id))
      .limit(1);
    
    // If user exists, return success
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'User already exists',
        user: existingUser[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create user if they don't exist
    const newUser: NewUser = {
      id: body.id, // Use the provided ID (e.g., from Privy)
      email: body.email,
      fullName: body.name || 'Anonymous User',
      // Default values for other fields will be applied automatically
    };
    
    const [user] = await db.insert(users)
      .values(newUser)
      .returning();
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'User created',
      user
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 