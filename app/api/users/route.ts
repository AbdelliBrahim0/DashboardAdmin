import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

const USERS_PATH = 'users';

// GET: Liste tous les utilisateurs ou un utilisateur par id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const snapshot = await db.ref(`${USERS_PATH}/${id}`).once('value');
    const user = snapshot.val();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ id, ...user });
  } else {
    const snapshot = await db.ref(USERS_PATH).once('value');
    const users = snapshot.val() || {};
    const usersArray = Object.entries(users).map(([id, data]) => ({ id, ...data }));
    return NextResponse.json(usersArray);
  }
}

// POST: Crée un nouvel utilisateur
export async function POST(req: NextRequest) {
  const data = await req.json();
  const ref = db.ref(USERS_PATH).push();
  await ref.set(data);
  return NextResponse.json({ id: ref.key, ...data }, { status: 201 });
}

// PUT: Met à jour un utilisateur existant
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const data = await req.json();
  await db.ref(`${USERS_PATH}/${id}`).update(data);
  return NextResponse.json({ id, ...data });
}

// DELETE: Supprime un utilisateur
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.ref(`${USERS_PATH}/${id}`).remove();
  return NextResponse.json({ success: true });
}
