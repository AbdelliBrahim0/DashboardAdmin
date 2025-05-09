import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

const TRANSACTIONS_PATH = 'transactions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const snapshot = await db.ref(`${TRANSACTIONS_PATH}/${id}`).once('value');
    const transaction = snapshot.val();
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    return NextResponse.json({ id, ...transaction });
  } else {
    const snapshot = await db.ref(TRANSACTIONS_PATH).once('value');
    const transactions = snapshot.val() || {};
    const transactionsArray = Object.entries(transactions).map(([id, data]) => ({ id, ...data }));
    return NextResponse.json(transactionsArray);
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const ref = db.ref(TRANSACTIONS_PATH).push();
  await ref.set(data);
  return NextResponse.json({ id: ref.key, ...data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const data = await req.json();
  await db.ref(`${TRANSACTIONS_PATH}/${id}`).update(data);
  return NextResponse.json({ id, ...data });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.ref(`${TRANSACTIONS_PATH}/${id}`).remove();
  return NextResponse.json({ success: true });
}
