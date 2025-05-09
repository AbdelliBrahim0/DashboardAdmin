"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Wallet, ShieldCheck } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

interface Stats {
  totalUsers: number;
  totalMerchants: number;
  totalTransactions: number;
  pendingVerifications: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalMerchants: 0,
    totalTransactions: 0,
    pendingVerifications: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentUsers = async () => {
      try {
        const response = await fetch('/api/recent-users');
        if (!response.ok) throw new Error('Failed to fetch recent users');
        const data = await response.json();
        setRecentUsers(data);
      } catch (error) {
        console.error('Error fetching recent users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchStats();
    fetchRecentUsers();
  }, []);

  // Fonction pour formater la date relative
  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return 'Just now';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-dark-1 border-dark-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-1 border-dark-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
              <Store className="h-4 w-4 text-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalMerchants}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-1 border-dark-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Wallet className="h-4 w-4 text-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalTransactions}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-1 border-dark-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <ShieldCheck className="h-4 w-4 text-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.pendingVerifications}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-dark-1 border-dark-2">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {loadingUsers ? (
                  // Afficher un état de chargement
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-dark-2 p-3 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-dark-3" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-dark-3 rounded" />
                          <div className="h-3 w-32 bg-dark-3 rounded" />
                        </div>
                      </div>
                      <div className="h-3 w-16 bg-dark-3 rounded" />
                    </div>
                  ))
                ) : (
                  recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg bg-dark-2 p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-dark-3 flex items-center justify-center">
                          <Users className="h-4 w-4 text-orange" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getRelativeTime(user.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-1 border-dark-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-dark-2 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-dark-3 flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Transaction #{1000 + i}</p>
                        <p className="text-xs text-muted-foreground">${(Math.random() * 1000).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {i} hour{i !== 1 ? "s" : ""} ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
