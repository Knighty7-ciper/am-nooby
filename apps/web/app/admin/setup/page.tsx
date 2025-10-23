import { getCurrentUser } from '@/lib/session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Check, AlertCircle } from 'lucide-react'

export default async function AdminSetupPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="container max-w-4xl py-16">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to sign in to access admin setup.</p>
            <Button asChild className="mt-4">
              <a href="/handler/sign-in">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAdmin = user.role === 'ADMIN'
  const isAdminEmail = ['bknglabs.dev@gmail.com', 'admin-free@noobblog.com'].includes(user.email)

  return (
    <div className="container max-w-4xl py-16">
      <Card className="p-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Setup Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">User Information</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Current Role:</strong> <span className="capitalize">{user.role}</span></p>
              <p><strong>Subscription:</strong> <span className="capitalize">{user.subscriptionPlan}</span></p>
            </div>

            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Admin Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isAdmin ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                  <span>Admin Role: {isAdmin ? 'Granted' : 'Not Granted'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isAdminEmail ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                  <span>Admin Email: {isAdminEmail ? 'Verified' : 'Not Admin Email'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {isAdmin ? (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="w-5 h-5" />
                    <p className="font-semibold">🎉 Success! You have admin access!</p>
                  </div>
                  <p className="text-green-700 mt-2">
                    You can now access the admin dashboard at <a href="/admino77" className="underline">/admino77</a>
                  </p>
                  <Button asChild className="mt-4">
                    <a href="/admino77">Go to Admin Dashboard</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Admin Setup Required</h3>
                  <p className="text-blue-700 mb-4">
                    {isAdminEmail 
                      ? 'Your email is authorized for admin access, but the role hasn\'t been granted yet.'
                      : 'This email is not authorized for admin access.'
                    }
                  </p>
                  
                  {isAdminEmail && (
                    <Button 
                      onClick={async () => {
                        const response = await fetch('/api/admin/setup', { method: 'GET' })
                        const data = await response.json()
                        if (data.success) {
                          window.location.reload()
                        } else {
                          alert(data.error || 'Setup failed')
                        }
                      }}
                    >
                      Grant Admin Access
                    </Button>
                  )}
                  
                  <Button asChild variant="outline" className="ml-2">
                    <a href="/handler/sign-out">Sign Out</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}