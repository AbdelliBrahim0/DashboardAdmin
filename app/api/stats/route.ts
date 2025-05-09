import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    // Obtenir le nombre total de merchants
    const merchantsSnapshot = await db.ref('merchants').once('value');
    const merchants = merchantsSnapshot.val() || {};
    const totalMerchants = Object.keys(merchants).length;

    // Obtenir le nombre total d'utilisateurs
    const usersSnapshot = await db.ref('users').once('value');
    const users = usersSnapshot.val() || {};
    const totalUsers = Object.keys(users).length;

    // Obtenir le nombre total de transactions
    const transactionsSnapshot = await db.ref('transactions').once('value');
    const transactions = transactionsSnapshot.val() || {};
    const totalTransactions = Object.keys(transactions).length;

    // Obtenir le nombre de vérifications en attente
    const verificationSnapshot = await db.ref('verification').once('value');
    const verifications = verificationSnapshot.val() || {};
    const pendingVerifications = Object.values(verifications).filter((v: any) => v.status === 'pending').length;

    return NextResponse.json({
      totalUsers,
      totalMerchants,
      totalTransactions,
      pendingVerifications,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 