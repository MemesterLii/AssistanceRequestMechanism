import React, {useState} from 'react';

const EditUserForm = ({user, editUser}) => {
  const [newUserName, setNewUserName] = useState(user.DisplayName);
  const maxNameLength = 30;

  //Prevent the default function. If newUser is not an empty value ("", " ", "  ", etc.), call the
  //editUser function with newUser and the id of the user name to replace.
  const handleSubmit = e => {
    e.preventDefault();
    if (newUserName != false){
      editUser(newUserName);
    }
  }
  
  return (
    <form className="UserForm" onSubmit={handleSubmit}>
      <input type="text" className="user-input" value={newUserName} placeholder="Update Name"
      onChange={(e) => (e.target.value.length > maxNameLength) ?
      e.target.value = e.target.value.slice(0, maxNameLength) :
      setNewUserName(e.target.value.toString())}/>
      <button type="submit" className="submit-btn">Update</button>
    </form>
  )
}

export default EditUserForm
