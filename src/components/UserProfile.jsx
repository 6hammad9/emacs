import { useEffect, useState } from 'react'

function UserProfile({ username }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h2>{user.username}'s Profile</h2>
      <p>Email: {user.email}</p>
    </div>
  )
}

export default UserProfile
