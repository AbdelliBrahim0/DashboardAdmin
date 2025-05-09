import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

const GIFT_CODES_PATH = 'gift_codes';

export async function GET() {
  try {
    const snapshot = await db.ref(GIFT_CODES_PATH).once('value');
    const giftCodes = snapshot.val() || {};
    
    // Convertir l'objet en tableau et ajouter l'id
    const giftCodesArray = Object.entries(giftCodes).map(([id, data]: [string, any]) => ({
      id,
      ...data,
    }));

    return NextResponse.json(giftCodesArray);
  } catch (error) {
    console.error('Erreur lors de la récupération des codes cadeaux:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des codes cadeaux' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID du code cadeau requis' },
        { status: 400 }
      );
    }

    if (data.montant && (isNaN(Number(data.montant)) || Number(data.montant) <= 0)) {
      return NextResponse.json(
        { error: 'Le montant doit être un nombre positif' },
        { status: 400 }
      );
    }

    // Si le code est modifié, vérifier qu'il n'existe pas déjà
    if (data.code) {
      const snapshot = await db.ref(GIFT_CODES_PATH)
        .orderByChild('code')
        .equalTo(data.code)
        .once('value');
      
      const existingCodes = snapshot.val();
      if (existingCodes) {
        const existingId = Object.keys(existingCodes)[0];
        if (existingId !== id) {
          return NextResponse.json(
            { error: 'Ce code cadeau existe déjà' },
            { status: 400 }
          );
        }
      }
    }

    // Mettre à jour le code cadeau
    const updates = {
      ...(data.code && { code: data.code }),
      ...(data.montant && { montant: Number(data.montant) }),
      ...(data.isUsed !== undefined && { isUsed: data.isUsed })
    };

    await db.ref(`${GIFT_CODES_PATH}/${id}`).update(updates);

    // Récupérer le code cadeau mis à jour
    const updatedSnapshot = await db.ref(`${GIFT_CODES_PATH}/${id}`).once('value');
    const updatedGiftCode = updatedSnapshot.val();

    return NextResponse.json(
      { id, ...updatedGiftCode },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du code cadeau:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du code cadeau' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID du code cadeau requis' },
        { status: 400 }
      );
    }

    await db.ref(`${GIFT_CODES_PATH}/${id}`).remove();

    return NextResponse.json(
      { message: 'Code cadeau supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du code cadeau:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du code cadeau' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, montant } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Le code cadeau est requis' },
        { status: 400 }
      );
    }

    if (!montant || isNaN(Number(montant)) || Number(montant) <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être un nombre positif' },
        { status: 400 }
      );
    }

    // Vérifier si le code existe déjà
    const snapshot = await db.ref(GIFT_CODES_PATH)
      .orderByChild('code')
      .equalTo(code)
      .once('value');

    if (snapshot.val()) {
      return NextResponse.json(
        { error: 'Ce code cadeau existe déjà' },
        { status: 400 }
      );
    }

    // Créer un nouveau code cadeau
    const newGiftCode = {
      code,
      montant: Number(montant),
      createdAt: Date.now(),
      isUsed: false
    };

    const ref = db.ref(GIFT_CODES_PATH).push();
    await ref.set(newGiftCode);

    return NextResponse.json(
      { id: ref.key, ...newGiftCode },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'ajout du code cadeau:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du code cadeau' },
      { status: 500 }
    );
  }
} 