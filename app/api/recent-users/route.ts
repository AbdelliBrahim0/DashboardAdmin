import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const usersSnapshot = await db.ref('users').orderByChild('createdAt').limitToLast(5).once('value');
    const users = usersSnapshot.val() || {};
    
    // Convertir l'objet en tableau et ajouter l'id
    const recentUsers = Object.entries(users).map(([id, userData]: [string, any]) => ({
      id,
      email: userData.email || 'N/A',
      name: userData.username || userData.firstName || 'N/A',
      createdAt: userData.createdAt || Date.now(),
      ...userData
    }))
    .sort((a, b) => b.createdAt - a.createdAt); // Trier par date décroissante

    return NextResponse.json(recentUsers);
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 