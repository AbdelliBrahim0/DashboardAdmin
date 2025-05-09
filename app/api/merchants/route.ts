import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

const MERCHANTS_PATH = 'merchants';

interface MerchantData {
  businessName: string;
  businessDomain: string;
  businessLocation: string;
  businessDescription: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerUsername: string;
  ownerEmail: string;
  ownerCIN: string;
  ownerPassword: string;
  termsAccepted: boolean;
  balance: number;
  role: string;
  authId?: string; // ID from Firebase Auth
}

function validateMerchantData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.businessName?.trim()) errors.push('Business name is required');
  if (!data.ownerEmail?.trim()) errors.push('Owner email is required');
  if (!data.ownerFirstName?.trim()) errors.push('Owner first name is required');
  if (!data.ownerLastName?.trim()) errors.push('Owner last name is required');
  if (typeof data.balance !== 'number') errors.push('Balance must be a number');
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Fonction pour fusionner les données des merchants en double
async function getMerchantByEmail(email: string) {
  const snapshot = await db.ref(MERCHANTS_PATH)
    .orderByChild('ownerEmail')
    .equalTo(email)
    .once('value');
  
  const merchants = snapshot.val();
  if (!merchants) return null;

  // Si plusieurs merchants ont le même email, on les fusionne
  const merchantIds = Object.keys(merchants);
  if (merchantIds.length > 1) {
    console.warn(`Multiple merchants found with email ${email}`, merchantIds);
    // Prendre le premier ID comme ID principal
    const primaryId = merchantIds[0];
    const mergedData = merchantIds.reduce((acc, id) => ({
      ...acc,
      ...merchants[id],
      id: primaryId
    }), {});

    // Supprimer les autres entrées
    for (let i = 1; i < merchantIds.length; i++) {
      await db.ref(`${MERCHANTS_PATH}/${merchantIds[i]}`).remove();
    }

    // Mettre à jour avec les données fusionnées
    await db.ref(`${MERCHANTS_PATH}/${primaryId}`).update(mergedData);
    return { id: primaryId, ...mergedData };
  }

  const id = merchantIds[0];
  return { id, ...merchants[id] };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    
    if (email) {
      const merchant = await getMerchantByEmail(email);
      if (!merchant) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }
      return NextResponse.json(merchant);
    }
    
    if (id) {
      const snapshot = await db.ref(`${MERCHANTS_PATH}/${id}`).once('value');
      const merchant = snapshot.val();
      
      if (!merchant) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }
      
      return NextResponse.json({ id, ...merchant });
    } else {
      const snapshot = await db.ref(MERCHANTS_PATH).once('value');
      const merchants = snapshot.val() || {};
      const merchantsArray = Object.entries(merchants).map(([id, data]) => ({ 
        id, 
        ...(data as any),
        // Assurer qu'on a un ID unique
        uniqueId: (data as any).authId || id
      }));
      return NextResponse.json(merchantsArray);
    }
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validation = validateMerchantData(data);
    
    if (!validation.isValid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }
    
    const ref = db.ref(MERCHANTS_PATH).push();
    await ref.set(data);
    return NextResponse.json({ id: ref.key, ...data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    
    // Vérifier si le merchant existe
    const merchantRef = db.ref(`${MERCHANTS_PATH}/${id}`);
    const snapshot = await merchantRef.once('value');
    const existingMerchant = snapshot.val();
    
    if (!existingMerchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }
    
    const data = await req.json();
    console.log('Received update data:', data);
    
    const validation = validateMerchantData(data);
    
    if (!validation.isValid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }
    
    // Préparer les données à mettre à jour en conservant les champs existants non modifiés
    const updatedData = {
      ...existingMerchant,
      ...data,
      // Conserver l'ID et autres champs importants
      id: id,
      authId: existingMerchant.authId || id
    };
    
    console.log('Final update data:', updatedData);
    
    // Supprimer les champs qui ne doivent pas être dans la base de données
    delete updatedData.id;
    delete updatedData.uniqueId;
    
    try {
      await merchantRef.update(updatedData);
      return NextResponse.json({ id, ...updatedData });
    } catch (updateError) {
      console.error('Error updating merchant in database:', updateError);
      return NextResponse.json({ error: 'Failed to update merchant in database' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    
    // Vérifier si le merchant existe avant de le supprimer
    const merchantRef = db.ref(`${MERCHANTS_PATH}/${id}`);
    const snapshot = await merchantRef.once('value');
    
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }
    
    await merchantRef.remove();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
