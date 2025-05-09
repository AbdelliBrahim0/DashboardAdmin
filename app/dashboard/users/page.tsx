"use client"

import { useEffect, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/dashboard-layout"

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [detailsUser, setDetailsUser] = useState<any | null>(null)

  // Form state for new/edit user
  const [formData, setFormData] = useState<Partial<any>>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    birthDate: "",
    phoneNumber: "",
    password: "",
    gender: "",
    termsAccepted: false,
    codeTransaction: 0,
    voucherTab: [],
    balance: 0,
    betaCoin: 0,
    verified: false,
    dateSignUp: new Date().toISOString().split("T")[0],
    role: "user",
  })

  // Données mockées initiales
  const initialUsers = [
    {
      id: 1,
      firstName: "Alice",
      lastName: "Smith",
      username: "alice",
      email: "alice@example.com",
      birthDate: "1990-01-01",
      phoneNumber: "1234567890",
      password: "password",
      gender: "female",
      termsAccepted: true,
      codeTransaction: 123,
      voucherTab: [],
      balance: 100,
      betaCoin: 10,
      verified: true,
      dateSignUp: "2025-05-01",
      role: "user",
    },
    {
      id: 2,
      firstName: "Bob",
      lastName: "Johnson",
      username: "bobby",
      email: "bob@example.com",
      birthDate: "1985-06-15",
      phoneNumber: "0987654321",
      password: "password",
      gender: "male",
      termsAccepted: true,
      codeTransaction: 456,
      voucherTab: [],
      balance: 200,
      betaCoin: 20,
      verified: false,
      dateSignUp: "2025-05-02",
      role: "admin",
    },
  ]

  useEffect(() => {
    setLoading(true)
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData({ ...formData, [name]: Number.parseFloat(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      birthDate: "",
      phoneNumber: "",
      password: "",
      gender: "",
      termsAccepted: false,
      codeTransaction: 0,
      voucherTab: [],
      balance: 0,
      betaCoin: 0,
      verified: false,
      dateSignUp: new Date().toISOString().split("T")[0],
      role: "user",
    })
  }

  const handleAddUser = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      return
    }
    setLoading(true)
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setIsAddDialogOpen(false)
    resetForm()
    // Recharger la liste
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
    toast({ title: "Success", description: "User added successfully." })
  }

  const handleEditUser = (user: any) => {
    setCurrentUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber,
      password: user.password,
      gender: user.gender,
      termsAccepted: user.termsAccepted,
      codeTransaction: user.codeTransaction,
      voucherTab: user.voucherTab,
      balance: user.balance,
      betaCoin: user.betaCoin,
      verified: user.verified,
      dateSignUp: user.dateSignUp,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!currentUser?.id) return
    setLoading(true)
    await fetch(`/api/users?id=${currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setIsEditDialogOpen(false)
    resetForm()
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
    toast({ title: "Success", description: "User updated successfully." })
  }

  const handleDeleteUser = async (id: string) => {
    setLoading(true)
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
    toast({ title: "Success", description: "User deleted successfully." })
  }

  const handleShowDetails = async (id: string | number) => {
    try {
      setLoading(true);
      // Pour les données mockées, chercher d'abord dans les utilisateurs existants
      const userFromState = users.find(user => user.id.toString() === id.toString());
      if (userFromState) {
        setDetailsUser(userFromState);
        setIsDetailsDialogOpen(true);
        setLoading(false);
        return;
      }

      // Si non trouvé dans les données mockées, faire la requête API
      const res = await fetch(`/api/users?id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch user details');
      const data = await res.json();
      setDetailsUser(data);
      setIsDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 bg-dark-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange text-black hover:bg-orange/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dark-1 border-dark-2 sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Fill in the user details below to create a new user account.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        className="bg-dark-2"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        className="bg-dark-2"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        name="username"
                        className="bg-dark-2"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="bg-dark-2"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        className="bg-dark-2"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        className="bg-dark-2"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        className="bg-dark-2"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger className="bg-dark-2">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-1">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <div className="space-y-2">
                      <Label htmlFor="betaCoin">Beta Coin</Label>
                      <Input
                        id="betaCoin"
                        name="betaCoin"
                        type="number"
                        className="bg-dark-2"
                        value={formData.betaCoin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codeTransaction">Transaction Code</Label>
                      <Input
                        id="codeTransaction"
                        name="codeTransaction"
                        type="number"
                        className="bg-dark-2"
                        value={formData.codeTransaction}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                        <SelectTrigger className="bg-dark-2">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-1">
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => handleCheckboxChange("verified", checked as boolean)}
                    />
                    <label
                      htmlFor="verified"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Verified
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange text-black hover:bg-orange/90" onClick={handleAddUser}>
                    Add User
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
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>betaCoin</TableHead>
                    <TableHead>codeTransaction</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-dark-3">
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>${user.balance?.toFixed(2)}</TableCell>
                        <TableCell>{user.betaCoin}</TableCell>
                        <TableCell>{user.codeTransaction}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShowDetails(user.id)}>
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
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-dark-2">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground"
                                    onClick={() => user.id && handleDeleteUser(user.id)}
                                  >
                                    Delete
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-dark-1 border-dark-2 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  name="firstName"
                  className="bg-dark-2"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  name="lastName"
                  className="bg-dark-2"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  name="username"
                  className="bg-dark-2"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  className="bg-dark-2"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="edit-betaCoin">Beta Coin</Label>
                <Input
                  id="edit-betaCoin"
                  name="betaCoin"
                  type="number"
                  className="bg-dark-2"
                  value={formData.betaCoin}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger id="edit-role" className="bg-dark-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-1">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 self-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-verified"
                    checked={formData.verified}
                    onCheckedChange={(checked) => handleCheckboxChange("verified", checked)}
                  />
                  <Label htmlFor="edit-verified">Verified</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-orange text-black hover:bg-orange/90" onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher les détails */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="bg-dark-1 border-dark-2 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails utilisateur</DialogTitle>
          </DialogHeader>
          {detailsUser && (
            <div className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Nom complet:</span>
                      <p>{`${detailsUser.firstName} ${detailsUser.lastName}`}</p>
                    </div>
                    <div>
                      <span className="font-medium">Nom d'utilisateur:</span>
                      <p>{detailsUser.username}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p>{detailsUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Date de naissance:</span>
                      <p>{detailsUser.birthDate || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Téléphone:</span>
                      <p>{detailsUser.phoneNumber || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Genre:</span>
                      <p>{detailsUser.gender || 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations du compte */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Informations du compte</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Balance:</span>
                      <p>${detailsUser.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Beta Coin:</span>
                      <p>{detailsUser.betaCoin || '0'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Code Transaction:</span>
                      <p>{detailsUser.codeTransaction || 'Non spécifié'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Rôle:</span>
                      <p className="capitalize">{detailsUser.role || 'user'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date d'inscription:</span>
                      <p>{detailsUser.dateSignUp || 'Non spécifié'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Statut:</span>
                      <Badge variant={detailsUser.verified ? "success" : "secondary"}>
                        {detailsUser.verified ? 'Vérifié' : 'Non vérifié'}
                      </Badge>
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
                    <Badge variant={detailsUser.termsAccepted ? "success" : "secondary"} className="ml-2">
                      {detailsUser.termsAccepted ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                  {detailsUser.voucherTab && detailsUser.voucherTab.length > 0 && (
                    <div>
                      <span className="font-medium">Vouchers:</span>
                      <p className="mt-1">{JSON.stringify(detailsUser.voucherTab)}</p>
                    </div>
                  )}
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
