import { useState, useEffect } from 'react'
import { supabase } from './supCreateClient'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    age: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data)
    }
  }

  async function createUser(e) {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.age.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          name: formData.name.trim(), 
          age: parseInt(formData.age) 
        }
      ])
      .select()

    if (error) {
      console.error('Error creating user:', error)
      alert('Error creating user: ' + error.message)
    } else {
      console.log('User created:', data)
      setFormData({ name: '', age: '' }) // Reset form
      getUsers() // Refresh the list
    }
    
    setIsSubmitting(false)
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    if (!error) {
      setUsers(users.filter(user => user.id !== id))
    } else {
      console.error('Error deleting user:', error)
    }
  }

  async function editUser(id) {
    const newName = prompt('Enter new name:')
    const newAge = prompt('Enter new age:')
    if (newName && newAge) {
      const { error } = await supabase
        .from('users')
        .update({ name: newName, age: parseInt(newAge) })
        .eq('id', id)
      if (!error) {
        getUsers() // refresh list
      } else {
        console.error('Error updating user:', error)
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '20px',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Create User Form - Horizontal Layout */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '800px',
          marginBottom: '30px'
        }}>
          <h2 style={{
            marginBottom: '25px',
            color: '#333',
            textAlign: 'center'
          }}>Add New User</h2>
          
          <form onSubmit={createUser}>
            {/* Horizontal Input Container */}
            <div style={{
              display: 'flex',
              alignItems: 'end',
              gap: '20px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              {/* Name Input */}
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter user name"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              {/* Age Input */}
              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  Age:
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim() || !formData.age.trim()}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: isSubmitting ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    minWidth: '120px'
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* User List Table */}
        <h2 style={{
          marginBottom: '20px',
          color: '#333',
          textAlign: 'center'
        }}>User List</h2>
        
        <table 
          border="1" 
          cellPadding="10" 
          style={{ 
            marginTop: '20px', 
            borderCollapse: 'collapse',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#000', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Age</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{user.id}</td>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px' }}>{user.age}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => editUser(user.id)} 
                      style={{ 
                        marginRight: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ 
                  padding: '20px', 
                  textAlign: 'center',
                  color: '#666'
                }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
