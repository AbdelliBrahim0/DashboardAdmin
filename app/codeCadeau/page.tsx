'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GiftCode {
  id: string;
  code: string;
  montant: number;
  createdAt: number;
  isUsed: boolean;
}

export default function CodeCadeau() {
  const [code, setCode] = useState('');
  const [montant, setMontant] = useState('');
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCode, setEditingCode] = useState<GiftCode | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchGiftCodes();
  }, []);

  const fetchGiftCodes = async () => {
    try {
      const response = await fetch('/api/codeCadeau');
      if (response.ok) {
        const data = await response.json();
        setGiftCodes(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des codes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes cadeaux",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const randomCode = Math.random().toString().substring(2, 14);
    setCode(randomCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/codeCadeau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, montant }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Code cadeau ajouté avec succès!",
          variant: "default",
        });
        setCode('');
        setMontant('');
        fetchGiftCodes();
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de l'ajout du code cadeau",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du code cadeau",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<GiftCode>) => {
    try {
      const response = await fetch(`/api/codeCadeau?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Code cadeau modifié avec succès!",
          variant: "default",
        });
        fetchGiftCodes();
        setEditingCode(null);
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la modification du code cadeau",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du code cadeau",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce code cadeau ?')) {
      try {
        const response = await fetch(`/api/codeCadeau?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast({
            title: "Succès",
            description: "Code cadeau supprimé avec succès!",
            variant: "default",
          });
          fetchGiftCodes();
        } else {
          const data = await response.json();
          toast({
            title: "Erreur",
            description: data.error || "Erreur lors de la suppression du code cadeau",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du code cadeau",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Codes Cadeaux</h1>
        </div>
        
        <div className="bg-dark-1 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Ajouter un nouveau code cadeau</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="code" className="block text-sm font-medium text-gray-200 mb-2">
                  Code Cadeau
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-2 border border-dark-2 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    placeholder="Entrez le code cadeau"
                    required
                  />
                  <Button
                    type="button"
                    onClick={generateCode}
                    className="bg-dark-2 hover:bg-dark-2/80"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="montant" className="block text-sm font-medium text-gray-200 mb-2">
                  Montant (DT)
                </label>
                <input
                  type="number"
                  id="montant"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-2 border border-dark-2 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                  placeholder="Entrez le montant"
                  min="0"
                  step="0.001"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange hover:bg-orange/90 text-black font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 focus:ring-offset-dark-1"
            >
              Ajouter le code
            </button>
          </form>
        </div>

        <div className="bg-dark-1 rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Liste des codes cadeaux</h2>
            {loading ? (
              <p className="text-gray-400">Chargement des codes cadeaux...</p>
            ) : (
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Montant (DT)</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {giftCodes.map((giftCode) => (
                      <TableRow key={giftCode.id}>
                        <TableCell className="font-medium">{giftCode.code}</TableCell>
                        <TableCell>{giftCode.montant?.toFixed(3)} DT</TableCell>
                        <TableCell>
                          {format(giftCode.createdAt, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              giftCode.isUsed
                                ? 'bg-red-500/20 text-red-500'
                                : 'bg-green-500/20 text-green-500'
                            }`}
                          >
                            {giftCode.isUsed ? 'Utilisé' : 'Disponible'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingCode(giftCode)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier le code cadeau</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Code
                                    </label>
                                    <input
                                      type="text"
                                      value={editingCode?.code || ''}
                                      onChange={(e) => setEditingCode(prev => prev ? {...prev, code: e.target.value} : null)}
                                      className="w-full px-3 py-2 bg-dark-2 border border-dark-2 rounded-md text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Montant (DT)
                                    </label>
                                    <input
                                      type="number"
                                      value={editingCode?.montant || ''}
                                      onChange={(e) => setEditingCode(prev => prev ? {...prev, montant: Number(e.target.value)} : null)}
                                      className="w-full px-3 py-2 bg-dark-2 border border-dark-2 rounded-md text-white"
                                      min="0"
                                      step="0.001"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                      <Button variant="ghost">Annuler</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button
                                        onClick={() => editingCode && handleUpdate(editingCode.id, {
                                          code: editingCode.code,
                                          montant: editingCode.montant
                                        })}
                                      >
                                        Enregistrer
                                      </Button>
                                    </DialogClose>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(giftCode.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {giftCodes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-400">
                          Aucun code cadeau trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 