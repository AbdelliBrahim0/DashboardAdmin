"use client"

import { useState, useEffect } from "react"
import { Search, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"

export default function TransactionsPage() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<any | null>(null)
  const [senderName, setSenderName] = useState("")
  const [receiverName, setReceiverName] = useState("")

  // Données mockées initiales
  const initialTransactions = [
    {
      id: "tx1",
      id_emetteur: "user1",
      id_recepteur: "user2",
      amount: 100,
      date: "2025-05-07",
      time: "10:00",
    },
    {
      id: "tx2",
      id_emetteur: "user2",
      id_recepteur: "user1",
      amount: 50,
      date: "2025-05-06",
      time: "15:30",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(initialTransactions);
      setLoading(false);
    }, 500);
  }, []);

  const handleViewDetails = async (transaction: any) => {
    setCurrentTransaction(transaction);
    // Noms mockés pour l'exemple
    setSenderName(transaction.id_emetteur === "user1" ? "Alice Smith" : "Bob Johnson");
    setReceiverName(transaction.id_recepteur === "user1" ? "Alice Smith" : "Bob Johnson");
    setIsDetailsDialogOpen(true);
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id_emetteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id_recepteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm),
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8 bg-dark-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="bg-dark-1 border-dark-2">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-dark-2">
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Sender ID</TableHead>
                    <TableHead>Receiver ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-dark-3">
                        <TableCell className="font-medium">{transaction.id?.substring(0, 8)}...</TableCell>
                        <TableCell>{transaction.id_emetteur.substring(0, 8)}...</TableCell>
                        <TableCell>{transaction.id_recepteur.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge className="bg-orange text-black">${transaction.amount.toFixed(2)}</Badge>
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.time}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(transaction)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
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

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="bg-dark-1 border-dark-2 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Detailed information about this transaction.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{currentTransaction?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium text-orange">${currentTransaction?.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{currentTransaction?.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{currentTransaction?.time}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Sender</p>
              <div className="rounded-lg bg-dark-2 p-3">
                <p className="font-medium">{senderName}</p>
                <p className="text-xs text-muted-foreground">ID: {currentTransaction?.id_emetteur}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Receiver</p>
              <div className="rounded-lg bg-dark-2 p-3">
                <p className="font-medium">{receiverName}</p>
                <p className="text-xs text-muted-foreground">ID: {currentTransaction?.id_recepteur}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
