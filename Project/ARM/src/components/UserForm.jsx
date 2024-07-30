import React, {useState} from 'react'

const UserForm = ({addUser}) => {
  const [newUser, setNewUser] = useState("")

  //Prevent the default function. If newUser is not an empty value ("", " ", "  ", etc.), call the
  //addUser function with newUser.
  const handleSubmit = e => {
    e.preventDefault();

    if (newUser != false) {
      addUser(newUser)

      setNewUser("")
    }
  }

  return (
    <form className="UserForm" onSubmit={handleSubmit}>
      <input type="text" className="user-input" value={newUser} placeholder="Enter Name" onChange={(e) => setNewUser(e.target.value)}/>
      <button type="submit" className="submit-btn">Request Help</button>
    </form>
  )
}

export default UserForm
