"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"

export default function MerchantsPage() {
  const { toast } = useToast()
  const [merchants, setMerchants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [currentMerchant, setCurrentMerchant] = useState<any | null>(null)
  const [detailsMerchant, setDetailsMerchant] = useState<any | null>(null)

  // Form state for new/edit merchant
  const [formData, setFormData] = useState<Partial<any>>({
    i: 0,
    businessName: "",
    businessDomain: "",
    businessLocation: "",
    businessDescription: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerUsername: "",
    ownerEmail: "",
    ownerCIN: "",
    ownerPassword: "",
    termsAccepted: false,
    balance: 0,
    role: "merchant",
  })

  useEffect(() => {
    setLoading(true);
    fetch('/api/merchants')
      .then(res => res.json())
      .then(data => {
        setMerchants(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "number") {
      setFormData({ ...formData, [name]: Number.parseFloat(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const resetForm = () => {
    setFormData({
      i: merchants.length > 0 ? Math.max(...merchants.map((m) => m.i)) + 1 : 1,
      businessName: "",
      businessDomain: "",
      businessLocation: "",
      businessDescription: "",
      ownerFirstName: "",
      ownerLastName: "",
      ownerUsername: "",
      ownerEmail: "",
      ownerCIN: "",
      ownerPassword: "",
      termsAccepted: false,
      balance: 0,
      role: "merchant",
    })
  }

  const handleAddMerchant = async () => {
    try {
      // Validation des champs requis
      const requiredFields = {
        businessName: "Nom de l'entreprise",
        ownerFirstName: "Prénom du propriétaire",
        ownerLastName: "Nom du propriétaire",
        ownerEmail: "Email du propriétaire",
        ownerPassword: "Mot de passe"
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Champs requis manquants",
          description: `Veuillez remplir les champs suivants : ${missingFields.join(", ")}`
        });
        return;
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.ownerEmail)) {
        toast({
          variant: "destructive",
          title: "Email invalide",
          description: "Veuillez entrer une adresse email valide"
        });
        return;
      }

      // Validation du mot de passe
      if (formData.ownerPassword.length < 6) {
        toast({
          variant: "destructive",
          title: "Mot de passe trop court",
          description: "Le mot de passe doit contenir au moins 6 caractères"
        });
        return;
      }

      const response = await fetch('/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          toast({
            title: "Erreur",
            description: data.errors.join('\n'),
            variant: "destructive"
          });
          return;
        }
        throw new Error('Failed to add merchant');
      }

      await refreshMerchants();
      setIsAddDialogOpen(false);
      resetForm();
      toast({ 
        title: "Succès", 
        description: "Le marchand a été ajouté avec succès.",
        variant: "success"
      });
    } catch (error) {
      console.error('Error adding merchant:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le marchand. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleEditMerchant = (merchant: any) => {
    console.log('Merchant to edit:', merchant);
    setCurrentMerchant(merchant);
    // Copier toutes les données existantes du merchant
    setFormData({
      ...merchant,  // Copier toutes les données existantes
      businessName: merchant.businessName || "",
      businessDomain: merchant.businessDomain || "",
      businessLocation: merchant.businessLocation || "",
      businessDescription: merchant.businessDescription || "",
      ownerFirstName: merchant.ownerFirstName || "",
      ownerLastName: merchant.ownerLastName || "",
      ownerUsername: merchant.ownerUsername || "",
      ownerEmail: merchant.ownerEmail || "",
      ownerCIN: merchant.ownerCIN || "",
      ownerPassword: merchant.ownerPassword || "",
      termsAccepted: merchant.termsAccepted || false,
      balance: merchant.balance || 0,
      role: merchant.role || "merchant",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMerchant = async () => {
    try {
      // Validation des champs requis
      const requiredFields = {
        businessName: "Nom de l'entreprise",
        ownerFirstName: "Prénom du propriétaire",
        ownerLastName: "Nom du propriétaire",
        ownerEmail: "Email du propriétaire"
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Champs requis manquants",
          description: `Veuillez remplir les champs suivants : ${missingFields.join(", ")}`
        });
        return;
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.ownerEmail)) {
        toast({
          variant: "destructive",
          title: "Email invalide",
          description: "Veuillez entrer une adresse email valide"
        });
        return;
      }

      const merchantId = currentMerchant?.id;
      if (!merchantId) {
        toast({
          title: "Erreur",
          description: "ID du marchand non trouvé",
          variant: "destructive"
        });
        return;
      }

      setLoading(true);
      
      const updatedData = {
        businessName: formData.businessName,
        businessDomain: formData.businessDomain,
        businessLocation: formData.businessLocation,
        businessDescription: formData.businessDescription,
        ownerFirstName: formData.ownerFirstName,
        ownerLastName: formData.ownerLastName,
        ownerUsername: formData.ownerUsername,
        ownerEmail: formData.ownerEmail,
        ownerCIN: formData.ownerCIN,
        ownerPassword: formData.ownerPassword,
        termsAccepted: formData.termsAccepted,
        balance: formData.balance,
        role: formData.role
      };

      const response = await fetch(`/api/merchants?id=${merchantId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          toast({
            title: "Erreur",
            description: data.errors.join('\n'),
            variant: "destructive"
          });
          return;
        }
        throw new Error('Failed to update merchant');
      }

      await refreshMerchants();
      setIsEditDialogOpen(false);
      resetForm();
      toast({ 
        title: "Succès", 
        description: "Le marchand a été mis à jour avec succès.",
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating merchant:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le marchand. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMerchant = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/merchants?id=${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete merchant');
      }

      await refreshMerchants();
      toast({ 
        title: "Success", 
        description: "Merchant deleted successfully." 
      });
    } catch (error) {
      console.error('Error deleting merchant:', error);
      toast({
        title: "Error",
        description: "Failed to delete merchant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/merchants?id=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch merchant details');
      }
      
      const data = await response.json();
      setDetailsMerchant(data);
      setIsDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching merchant details:', error);
      toast({
        title: "Error",
        description: "Failed to load merchant details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredMerchants = merchants.filter(
    (merchant) =>
      (merchant.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.ownerFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.ownerLastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const refreshMerchants = async () => {
    try {
      const response = await fetch('/api/merchants');
      if (!response.ok) throw new Error('Failed to fetch merchants');
      const data = await response.json();
      
      // S'assurer que chaque merchant a un ID unique
      const merchantsWithUniqueIds = Array.isArray(data) ? data.map(merchant => ({
        ...merchant,
        // Utiliser authId s'il existe, sinon l'id de la base de données
        uniqueId: merchant.authId || merchant.id
      })) : [];
      
      setMerchants(merchantsWithUniqueIds);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      toast({
        title: "Error",
        description: "Failed to refresh merchants list. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Merchants</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search merchants..."
                className="pl-8 bg-dark-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange text-black hover:bg-orange/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Merchant
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dark-1 border-dark-2 sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Merchant</DialogTitle>
                  <DialogDescription>
                    Fill in the merchant details below to create a new merchant account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      className="bg-dark-2"
                      value={formData.businessName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessDomain">Business Domain</Label>
                      <Input
                        id="businessDomain"
                        name="businessDomain"
                        className="bg-dark-2"
                        value={formData.businessDomain}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessLocation">Business Location</Label>
                      <Input
                        id="businessLocation"
                        name="businessLocation"
                        className="bg-dark-2"
                        value={formData.businessLocation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      name="businessDescription"
                      className="bg-dark-2"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerFirstName">Owner First Name *</Label>
                      <Input
                        id="ownerFirstName"
                        name="ownerFirstName"
                        className="bg-dark-2"
                        value={formData.ownerFirstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerLastName">Owner Last Name *</Label>
                      <Input
                        id="ownerLastName"
                        name="ownerLastName"
                        className="bg-dark-2"
                        value={formData.ownerLastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerUsername">Owner Username</Label>
                      <Input
                        id="ownerUsername"
                        name="ownerUsername"
                        className="bg-dark-2"
                        value={formData.ownerUsername}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail">Owner Email *</Label>
                      <Input
                        id="ownerEmail"
                        name="ownerEmail"
                        type="email"
                        className="bg-dark-2"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerCIN">Owner CIN</Label>
                      <Input
                        id="ownerCIN"
                        name="ownerCIN"
                        className="bg-dark-2"
                        value={formData.ownerCIN}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerPassword">Owner Password *</Label>
                      <Input
                        id="ownerPassword"
                        name="ownerPassword"
                        type="password"
                        className="bg-dark-2"
                        value={formData.ownerPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance">Balance</Label>
                      <Input
                        id="balance"
                        name="balance"
                        type="number"
                        className="bg-dark-2"
                        value={formData.balance}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex items-center space-x-2 self-end">
                      <Checkbox
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
                      />
                      <label
                        htmlFor="termsAccepted"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Terms Accepted
                      </label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange text-black hover:bg-orange/90" onClick={handleAddMerchant}>
                    Add Merchant
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="bg-dark-1 border-dark-2">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-dark-2">
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        Loading merchants...
                      </TableCell>
                    </TableRow>
                  ) : filteredMerchants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No merchants found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMerchants.map((merchant) => (
                      <TableRow key={merchant.uniqueId || merchant.id} className="border-dark-3">
                        <TableCell className="font-medium">{merchant.businessName}</TableCell>
                        <TableCell>
                          {merchant.ownerFirstName} {merchant.ownerLastName}
                        </TableCell>
                        <TableCell>{merchant.ownerEmail}</TableCell>
                        <TableCell>{merchant.businessDomain}</TableCell>
                        <TableCell>{merchant.businessLocation}</TableCell>
                        <TableCell>${merchant.balance?.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditMerchant(merchant)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShowDetails(merchant.uniqueId || merchant.id)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Voir détails</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-dark-1 border-dark-2">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer le marchand</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer ce marchand ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-dark-2">Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleDeleteMerchant(merchant.uniqueId || merchant.id)}
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Merchant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-dark-1 border-dark-2 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
            <DialogDescription>Update the merchant details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-businessName">Business Name</Label>
              <Input
                id="edit-businessName"
                name="businessName"
                className="bg-dark-2"
                value={formData.businessName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-businessDomain">Business Domain</Label>
                <Input
                  id="edit-businessDomain"
                  name="businessDomain"
                  className="bg-dark-2"
                  value={formData.businessDomain}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-businessLocation">Business Location</Label>
                <Input
                  id="edit-businessLocation"
                  name="businessLocation"
                  className="bg-dark-2"
                  value={formData.businessLocation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-businessDescription">Business Description</Label>
              <Textarea
                id="edit-businessDescription"
                name="businessDescription"
                className="bg-dark-2"
                value={formData.businessDescription}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ownerFirstName">Owner First Name</Label>
                <Input
                  id="edit-ownerFirstName"
                  name="ownerFirstName"
                  className="bg-dark-2"
                  value={formData.ownerFirstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ownerLastName">Owner Last Name</Label>
                <Input
                  id="edit-ownerLastName"
                  name="ownerLastName"
                  className="bg-dark-2"
                  value={formData.ownerLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ownerEmail">Owner Email</Label>
                <Input
                  id="edit-ownerEmail"
                  name="ownerEmail"
                  type="email"
                  className="bg-dark-2"
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-balance">Balance</Label>
                <Input
                  id="edit-balance"
                  name="balance"
                  type="number"
                  className="bg-dark-2"
                  value={formData.balance}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-orange text-black hover:bg-orange/90" onClick={handleUpdateMerchant}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher les détails */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="bg-dark-1 border-dark-2 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du marchand</DialogTitle>
          </DialogHeader>
          {detailsMerchant && (
            <div className="space-y-6">
              {/* Informations de l'entreprise */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Informations de l'entreprise</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Nom de l'entreprise:</span>
                      <p>{detailsMerchant.businessName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Domaine d'activité:</span>
                      <p>{detailsMerchant.businessDomain || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Localisation:</span>
                      <p>{detailsMerchant.businessLocation || 'Non spécifié'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Balance:</span>
                      <p>${detailsMerchant.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Statut:</span>
                      <Badge variant={detailsMerchant.verified ? "success" : "secondary"} className="ml-2">
                        {detailsMerchant.verified ? 'Vérifié' : 'Non vérifié'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-sm">{detailsMerchant.businessDescription || 'Aucune description'}</p>
                </div>
              </div>

              {/* Informations du propriétaire */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Informations du propriétaire</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Nom complet:</span>
                      <p>{`${detailsMerchant.ownerFirstName} ${detailsMerchant.ownerLastName}`}</p>
                    </div>
                    <div>
                      <span className="font-medium">Nom d'utilisateur:</span>
                      <p>{detailsMerchant.ownerUsername || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p>{detailsMerchant.ownerEmail}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">CIN:</span>
                      <p>{detailsMerchant.ownerCIN || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Rôle:</span>
                      <p className="capitalize">{detailsMerchant.role || 'merchant'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Autres informations */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Autres informations</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Conditions acceptées:</span>
                    <Badge variant={detailsMerchant.termsAccepted ? "success" : "secondary"} className="ml-2">
                      {detailsMerchant.termsAccepted ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Date d'inscription:</span>
                    <p>{detailsMerchant.dateSignUp || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

