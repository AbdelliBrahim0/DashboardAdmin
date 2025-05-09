import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export default function VerificationPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Verification</h1>

        <Card className="bg-dark-1 border-dark-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-orange" />
              Verification Center
            </CardTitle>
            <CardDescription>This page is reserved for future verification functionality.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-dark-2 p-6 mb-4">
                <ShieldCheck className="h-12 w-12 text-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verification Module Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                The verification module is currently under development. This area will be used to manage user and
                merchant verification processes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
