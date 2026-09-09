'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, User, Bell, Lock, Palette, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    newsletter: true,
    darkMode: false,
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (!response.ok) {
        router.push('/handler/sign-in')
        return
      }
      const data = await response.json()
      setUser(data.user)
      setFormData({
        name: data.user.name || '',
        username: data.user.username || '',
        email: data.user.email || '',
        bio: data.user.bio || '',
        location: data.user.location || '',
        website: data.user.website || '',
        twitter: data.user.twitter || '',
        github: data.user.github || '',
        linkedin: data.user.linkedin || '',
        newsletter: data.user.newsletter ?? true,
        darkMode: data.user.darkMode ?? false,
      })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Settings saved successfully!')
        fetchUserData()
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <div className="container max-w-5xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab(id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <Card className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
                  <p className="text-muted-foreground mb-6">Update your public profile details</p>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-muted-foreground mt-2">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={e => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={formData.twitter}
                        onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={formData.github}
                        onChange={e => setFormData({ ...formData, github: e.target.value })}
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
                  <p className="text-muted-foreground mb-6">Manage your account security and privacy</p>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={formData.email} readOnly disabled />
                    <p className="text-sm text-muted-foreground mt-1">Contact support to change email</p>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">Irreversible actions</p>
                    <Button variant="destructive" disabled>Delete Account</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
                  <p className="text-muted-foreground mb-6">Choose what you want to be notified about</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium">Newsletter</div>
                      <div className="text-sm text-muted-foreground">Receive weekly newsletter</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={e => setFormData({ ...formData, newsletter: e.target.checked })}
                      className="w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Appearance</h2>
                  <p className="text-muted-foreground mb-6">Customize how NoobBlog looks for you</p>
                </div>

                <div>
                  <Label>Theme</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Button variant="outline" className="h-20">Light</Button>
                    <Button variant="outline" className="h-20">Dark</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={fetchUserData}>Reset</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
