import React, {useState} from 'react'

const EditUserForm = ({editUser, oldUser}) => {
  const [newUser, setNewUser] = useState(oldUser.name)

  //Prevent the default function. If newUser is not an empty value ("", " ", "  ", etc.), call the
  //editUser function with newUser and the id of the user name to replace.
  const handleSubmit = e => {
    e.preventDefault();

    if (newUser != false){
      editUser(newUser, oldUser.id)

      setNewUser("")
    }
  }
  
  return (
    <form className="UserForm" onSubmit={handleSubmit}>
      <input type="text" className="user-input" value={newUser} placeholder="Update Name" onChange={(e) => setNewUser(e.target.value)}/>
      <button type="submit" className="user-btn">Update</button>
    </form>
  )
}

export default EditUserForm
