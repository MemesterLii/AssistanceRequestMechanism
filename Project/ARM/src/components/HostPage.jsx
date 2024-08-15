import React, {useState, useEffect} from 'react';
import {database} from '../firebase';
import {doc, setDoc, deleteDoc, query, onSnapshot} from 'firebase/firestore';
import UserHostView from './UserHostView';
import {v4 as uuidv4} from 'uuid';
uuidv4();

const HostPage = ({roomID, setRoomID}) => {
  const [users, setUsers] = useState([]);
  const [hostID, setHostID] = useState('');
  const docRef = doc(database, 'Rooms', roomID);

  // Update users in room data with information from Firebase.
  // NOTE: useEffect is necessary to prevent setUsers in onSnapshot from
  // continuously running and causing a memory leak.
  useEffect(() => {
    const data = query(docRef);
    const updateUsers = onSnapshot(data, (querySnapshot) => {
      if (querySnapshot.data() != undefined){
        setUsers(querySnapshot.data().Users);
      };
    });
    return () => updateUsers();
  }, []);

  // Update host data with information from Firebase.
  onSnapshot(docRef, (querySnapshot) => {    
    if (querySnapshot.data() != undefined){
      setHostID(querySnapshot.data().HostID);
    };
  });
  
  // Given a user id, filter out any user with an id matching the provided id.
  const deleteUser = async (userID) => {
    let userIndex = -1;
    users.forEach(user => {
      if(userID == user.ID){
        userIndex = users.indexOf(user);
      };
    });
    
    if(userIndex !== -1){
      let tempArray = users;
      tempArray.splice(userIndex, 1);
      setUsers(tempArray);
      await setDoc(docRef, {
        HostID: hostID,
        Users: users
      });
    };
  };

  const deleteRoom = async (e) => {
    e.preventDefault();
    await deleteDoc(docRef);
    localStorage.clear();
    await setUsers([]);
    await setHostID('');
    await setRoomID('');
  };

  return (
    <div id='HostPage'>
      <h1 className="room-id">Room: {roomID}
        <form onSubmit={deleteRoom}>
          <button type="submit" id="delete-room-btn">Delete Room</button>
        </form>
      </h1>

      {<h4>There {users.length === 1 ? 
      " is " + users.length + " person " :
      " are " + users.length + " people "}
      in the queue:</h4>}

      {//Map the users array.
      //Note: the index parameter is unnecessary for the website's proper
      // functioning, but it fixes an error in the console log.
      users.map(
        (user, index) => 
        (<UserHostView user={user} position={users.indexOf(user) + 1}
        deleteUser={deleteUser} key={index}/>)
      )}
    </div>
  );
};

export default HostPage;
