import React, {useState} from 'react';
import {database} from '../firebase';
import {doc, setDoc} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';
uuidv4();


const RoomForm = ({rooms, setRoomID, allTimeVisits}) => {
  const [newRoomID, setNewRoomID] = useState([]);
  const [isInvalidRoom, setisInvalidRoom] = useState();

  const updateLocalStorage = (id, roomID) => {
    localStorage.setItem(`LocalID`, id);
    localStorage.setItem(`LocalRoomID`, roomID);
  };

  //Prevent the default function. If newUser is not an empty value ("", " ", "  ", etc.), call the
  //addUser function with newUser.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rooms.includes(newRoomID)){
      const newUserID = uuidv4();
      if(allTimeVisits > 0){
        await setDoc(doc(database, "Statistics", "AllTimeVisits"), {
          Count: allTimeVisits + 1
        });
      };
      updateLocalStorage(newUserID, newRoomID);
      setRoomID(newRoomID);
    }
    else {
      setisInvalidRoom(true);
    };
  };

  return (
    <form id="RoomForm" onSubmit={handleSubmit}>

      <input type="number" id="room-form-input" value={newRoomID}
      placeholder="Enter Room ID" onChange={(e) => (e.target.value.length > 4) ?
      e.target.value = e.target.value.slice(0, 4) :
      setNewRoomID(e.target.value.toString())}/>

      <button type="submit" id="room-form-btn">Join</button>

      {(isInvalidRoom) ? <h4 id="invalid-alert">Please enter a valid Room ID</h4> : null}
    </form>
  );
};

export default RoomForm;
