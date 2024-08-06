import React, {useState} from 'react';

const GuestForm = ({addUser}) => {
  const [newUserName, setNewUserName] = useState('');

  //Prevent the default function. If newUserName is not an empty value ("", " ", "  ", etc.), call the
  //addUser function with newUserName.
  const handleSubmit = e => {
    e.preventDefault();
    if (newUserName != false) {
      addUser(newUserName);
      setNewUserName('');
    }
  }

  return (
    <form className="GuestForm" onSubmit={handleSubmit}>
      <input type="text" className="user-input" value={newUserName} placeholder="Enter Name" onChange={(e) => setNewUserName(e.target.value)}/>
      <button type="submit" className="submit-btn">Request Help</button>
    </form>
  )
}

export default GuestForm
