import React, {useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid';
import UserHostView from './UserHostView';
import { database } from '../firebase';
import {onSnapshot, setDoc, doc} from 'firebase/firestore'
uuidv4();

const HostPage = ({roomID}) => {
  //Declare and initialize an empty users array along with its setter function
  const [users, setUsers] = useState([]);
  const [hostID, setHostID] = useState('');

  //Read user data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const updateUsers = onSnapshot(doc(database, 'Rooms', roomID), (querySnapshot) => {
        setHostID(querySnapshot.data().HostID);
        setUsers(querySnapshot.data().Users);
      })
  
      return () => updateUsers()
    }
    fetchData();
  }, [])
  
  //Given a user id, filter out any user with an id matching the provided id
  const deleteUser = async (userID) => {
    let userIndex = -1;
    users.forEach(user => {
      if(userID == user.ID){
        userIndex = users.indexOf(user);
      }
    });

    if(userIndex !== -1){
      users.splice(userIndex, 1);
      const docRef = doc(database, "Rooms", roomID)
      await setDoc(docRef, {
        HostID: hostID,
        Users: users
      })
    }
  }

  return (
    <div className='HostPage'>
      <h1>A.R.M.</h1>
      <h4>Assistance Request Mechanism</h4>
      <img src="/src/assets/altFavicon2.ico" alt="A.R.M. Logo"></img>
      
      <h1 id="roomID">Room: {roomID}</h1>

      {<h4>There {users.length === 1 ? 
      " is " + users.length + " person " :
      " are " + users.length + " people "}
      in the queue:</h4>}

      {//Map the users array
      //Note: the index parameter is unnecessary for the website's proper functioning, but it fixes an error in the console log.
      users.map(
        (userData, index) => 
        (<UserHostView user={userData} position={users.indexOf(userData) + 1} deleteUser={deleteUser} key={index}/>)
      )}
    </div>
  )
}

export default HostPage