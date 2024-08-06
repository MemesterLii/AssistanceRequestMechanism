import React, {useState, useEffect} from 'react'
import { database } from '../firebase';
import {onSnapshot, setDoc, deleteDoc, doc} from 'firebase/firestore';
import UserHostView from './UserHostView';
import {v4 as uuidv4} from 'uuid';
uuidv4();

const HostPage = ({roomID}) => {
  //Declare and initialize an empty users array along with its setter function
  const [users, setUsers] = useState([]);
  const [hostID, setHostID] = useState('');

  //Read user data from Firebase
  onSnapshot(doc(database, 'Rooms', roomID), (querySnapshot) => {
    if (querySnapshot.data() != undefined){
      setHostID(querySnapshot.data().HostID);
      setUsers(querySnapshot.data().Users);  
    }
  })
  
  //Given a user id, filter out any user with an id matching the provided id
  const deleteUser = async (userID) => {
    let userIndex = -1;
    users.forEach(user => {
      if(userID == user.ID){
        userIndex = users.indexOf(user);
      }
    });
    
    if(userIndex !== -1){
      let tempArray = users;
      tempArray.splice(userIndex, 1);
      setUsers(tempArray);
      const docRef = doc(database, "Rooms", roomID)
      await setDoc(docRef, {
        HostID: hostID,
        Users: users
      })
    }
  }

  const deleteRoom = async (e) => {
    e.preventDefault();
    await deleteDoc(doc(database, "Rooms", roomID));
    localStorage.clear();
    setUsers([]);
    setHostID('');
    //location.reload();
  }

  return (
    <div className='HostPage'>
      <h1>A.R.M.</h1>
      <h4>Assistance Request Mechanism</h4>
      <img src="/src/assets/altFavicon2.ico" alt="A.R.M. Logo"></img>
      
      <h1 id="roomID">Room: {roomID}
        <form onSubmit={deleteRoom}>
          <button type="submit" className="delete-room-btn">Delete Room</button>
        </form>
      </h1>

      {<h4>There {users.length === 1 ? 
      " is " + users.length + " person " :
      " are " + users.length + " people "}
      in the queue:</h4>}

      {//Map the users array
      //Note: the index parameter is unnecessary for the website's proper functioning, but it fixes an error in the console log.
      users.map(
        (user, index) => 
        (<UserHostView user={user} position={users.indexOf(user) + 1} deleteUser={deleteUser} key={index}/>)
      )}
    </div>
  )
}

export default HostPage