import React, {useState} from 'react';

// CREDITS: the fundamental structure and function of this page remains unchanged
// from the React To-Do List YouTube tutorial here:
// https://www.youtube.com/watch?v=LoYbN6qoQHA

const GuestForm = ({addUser}) => {
  const [newUserName, setNewUserName] = useState('');
  const maxNameLength = 30;

  // If newUserName is not an empty value ("", " ", "  ", etc.), call the
  // addUser() function with newUserName.
  const handleSubmit = e => {
    e.preventDefault();
    if (newUserName != false) {
      addUser(newUserName);
      setNewUserName('');
    };
  };

  return (
    <form className="GuestForm" onSubmit={handleSubmit}>
      <input type="text" className="guest-input" value={newUserName} placeholder="Enter Name"
      onChange={(e) => (e.target.value.length > maxNameLength) ?
        e.target.value = e.target.value.slice(0, maxNameLength) :
        setNewUserName(e.target.value.toString())}/>
      <button type="submit" className="submit-btn">Request Help</button>
    </form>
  );
};

export default GuestForm;
