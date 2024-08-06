import React, {useState, useEffect} from 'react';
import { database } from '../firebase';
import {query, onSnapshot, setDoc, doc} from 'firebase/firestore';
import GuestForm from './GuestForm';
import EditUserForm from './EditUserForm';
import SelfGuestView from './SelfGuestView';
import UserGuestView from './UserGuestView';
import {v4 as uuidv4} from 'uuid';
uuidv4();

const GuestPage = ({roomID}) => {
  const docRef = doc(database, 'Rooms', roomID);
  const localID = localStorage.getItem('LocalID');
  const [hostID, setHostID] = useState('');
  const [users, setUsers] = useState([]);
  const [inQueue, setInQueue] = useState();

  //Read users in room data from Firebase.
  //NOTE: useEffect is necessary to prevent setUsers in onSnapshot from continuously running and causing a memory leak.
  useEffect(() => {
    const data = query(docRef);
    const updateUsers = onSnapshot(data, (querySnapshot) => {
      if (querySnapshot != undefined){
        setUsers(querySnapshot.data().Users);
      }
    })
    return () => updateUsers()
  }, [])

  //Read room data from firebase
  onSnapshot(docRef, (querySnapshot) => {
    if (querySnapshot != undefined){
      setHostID(querySnapshot.data().HostID);
      if (users.findIndex(user => user.ID == localID) == -1){
        setInQueue(false);
      }
      else{
        setInQueue(true);
      }
    }
  })

  //Given a name, set the users array to all previous user objects + a new object using user's properties.
  const addUser = async (name) => {
    const newUser = {DisplayName: name, ID: localID, isEditing: false};
    let tempArray = users;
    tempArray.push(newUser);
    setUsers(tempArray);
    //Updates Firebase data.
    await setDoc(docRef, {
        HostID: hostID,
        Users: users
    })
  }

  //Filter out any user with an id matching the user's local id (themselves).
  const deleteSelf = async () => {
    let userIndex = -1;
    users.forEach(user => {
      if(user.ID == localID){
        userIndex = users.indexOf(user);
      }
    });
    
    if(userIndex !== -1){
      let tempArray = users;
      tempArray.splice(userIndex, 1);
      setUsers(tempArray);
      await setDoc(docRef, {
        HostID: hostID,
        Users: users
      })
    }
  }
  
  //Toggle the isEditing property of the user
  const toggleEditing = () => {
    setUsers(users.map(user => user.ID == localID ? {... user, isEditing: !user.isEditing} : user));
  }

  //Given a new name and an id, replace the name of the matching id user object in the users array with the new name
  //Then, set all other user objects the same
  const editUser = async (name, user) => {
    const updatedUser = {DisplayName: name, ID: localID, isEditing: false};
    let tempArray = users.map(user => user.ID == localID ? updatedUser : user);
    setUsers(tempArray);

    //Updates Firebase data.
    await setDoc(docRef, {
      HostID: hostID,
      Users: users
    })
  }

  const leaveRoom = async (e) => {
    e.preventDefault();
    deleteSelf();
    localStorage.clear();
    location.reload();
  }

  return (
    <div className='GuestPage'>
      <h1>A.R.M.</h1>
      <h4>Assistance Request Mechanism</h4>
      <img src="/src/assets/altFavicon2.ico" alt="A.R.M. Logo"></img>
      
      <h1 id="roomID">Room: {roomID}
        <form onSubmit={leaveRoom}>
          <button type="submit" className="leave-room-btn">Leave Room</button>
        </form>
      </h1>

      {(!inQueue) ? <GuestForm addUser={addUser} /> : null}
      
      <h4>There {users.length === 1 ? 
      " is " + users.length + " person " :
      " are " + users.length + " people "}
      in the queue:</h4>

      {//Map the users array normally unless a user.isEditing is true.
      //If so, replace that entry in the queue with an edit box.

      //Note: the index parameter is unnecessary for the website's proper functioning, but it fixes an error in the console log.
      users.map(
        (user, index) => 
        ((user.ID == localID) ?
        ((user.isEditing) ?
        (<EditUserForm user={user} editUser={editUser} key={index}/>) :
        (<SelfGuestView user={user} position={users.indexOf(user) + 1} deleteSelf={deleteSelf} toggleEditing={toggleEditing} key={index}/>)) : 
        (<UserGuestView user={user} position={users.indexOf(user) + 1} key={index}/>))
      )}
    </div>
  )
}

export default GuestPage