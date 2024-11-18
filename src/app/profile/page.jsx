'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  User,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name,
          email: data.email,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update profile')
      
      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        type: 'success'
      })
    } catch (err) {
      setNotification({
        open: true,
        message: err.message,
        type: 'error'
      })
    }
  }

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        open: true,
        message: 'Passwords do not match',
        type: 'error'
      })
      return
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) throw new Error('Failed to update password')
      
      setShowPasswordDialog(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setNotification({
        open: true,
        message: 'Password updated successfully',
        type: 'success'
      })
    } catch (err) {
      setNotification({
        open: true,
        message: err.message,
        type: 'error'
      })
    }
  }

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <Typography variant="h5" color="error">Failed to load profile: {error}</Typography>
      </Box>
    )
  }

  return (
    <div className='mt-32 mb-48'>
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>Your Profile</Typography>
      
      <Card elevation={2}>
        <CardHeader 
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Profile Information</Typography>
              {!isEditing && (
                <Button 
                  variant="outlined" 
                  onClick={() => setIsEditing(true)}
                  color='#FC8019'
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <User className="w-4 h-4 mr-2" />,
              }}
            />
            
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <Mail className="w-4 h-4 mr-2" />,
              }}
            />

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock className="w-4 h-4" />
                <Typography>Password</Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => setShowPasswordDialog(true)}
                color='#FC8019'
              >
                Change Password
              </Button>
            </Box>

            {isEditing && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color='#FC8019'
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: profile.name,
                      email: profile.email,
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpdateProfile}
                  color='#FC8019'
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='#FC8019' onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button color='#FC8019' onClick={handleUpdatePassword} variant="contained">Update Password</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
    </div>
  )
}