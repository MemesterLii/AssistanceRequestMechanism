import React, {useState, useEffect} from 'react';
import { database } from '../firebase';
import {query, onSnapshot, setDoc, doc} from 'firebase/firestore';
import GuestForm from './GuestForm';
import EditUserForm from './EditUserForm';
import SelfGuestView from './SelfGuestView';
import UserGuestView from './UserGuestView';
import {v4 as uuidv4} from 'uuid';
uuidv4();

const GuestPage = ({roomID, setRoomID}) => {
  const docRef = doc(database, 'Rooms', roomID);
  const localID = localStorage.getItem('LocalID');
  const [hostID, setHostID] = useState('');
  const [users, setUsers] = useState([]);
  const [inQueue, setInQueue] = useState();
  const [updated, setUpdated] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState();

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
  }, []);

  //Update Firebase when useState variables updated and users change
  useEffect(() => {
    if (updated) {
      //setDoc with updated users array
      setDoc(docRef, {
        HostID: hostID,
        Users: users
      }).then(() => {
        if (leaveRequest){
          setRoomID('');
        }
        // Reset the updated state
        setLeaveRequest(false);
        setUpdated(false);
      });
    }
  }, [updated, leaveRequest, users]);

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
  });

  //Given a name, set the users array to all previous user objects + a new object using user's properties.
  const addUser = async (name) => {
    const newUser = {DisplayName: name, ID: localID, isEditing: false};
    let tempArray = users;
    tempArray.push(newUser);
    setUsers(tempArray);
    setUpdated(true);
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
      setUpdated(true);
    }
  }
  
  //Toggle the isEditing property of the user
  const toggleEditing = async () => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map((user) =>
        (user.ID === localID) ? { ...user, isEditing: !user.isEditing } : user
      );

      return updatedUsers;
    });

    setUpdated(true);
  }

  //Given a new name and an id, replace the name of the matching id user object in the users array with the new name
  //Then, set all other user objects the same
  const editUser = async (name) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map((user) =>
        (user.ID === localID) ? { ...user, DisplayName: name, isEditing: !user.isEditing } : user
      );
      return updatedUsers;
    });

    setUpdated(true);
  }

  const leaveRoom = async (e) => {
    e.preventDefault();
    localStorage.clear();
    await deleteSelf();
    setLeaveRequest(true);
    setUpdated(true);
  }

  return (
    <div id='GuestPage'>
      <h1 className="room-id">Room: {roomID}
        <form onSubmit={leaveRoom}>
          <button type="submit" id="leave-room-btn">Leave Room</button>
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