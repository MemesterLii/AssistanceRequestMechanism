import React, {useState} from 'react';

const EditUserForm = ({user, editUser}) => {
  const [newUserName, setNewUserName] = useState(user.DisplayName);

  //Prevent the default function. If newUser is not an empty value ("", " ", "  ", etc.), call the
  //editUser function with newUser and the id of the user name to replace.
  const handleSubmit = e => {
    e.preventDefault();
    if (newUserName != false){
      editUser(newUserName, user);
    }
  }
  
  return (
    <form className="UserForm" onSubmit={handleSubmit}>
      <input type="text" className="user-input" value={newUserName} placeholder="Update Name" onChange={(e) => setNewUserName(e.target.value)}/>
      <button type="submit" className="submit-btn">Update</button>
    </form>
  )
}

export default EditUserForm
