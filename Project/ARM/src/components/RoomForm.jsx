import React, {useState, useEffect} from 'react'
import { database } from '../firebase';
import {setDoc, doc} from 'firebase/firestore'
import {v4 as uuidv4} from 'uuid';
uuidv4();


const RoomForm = ({rooms, setRoomID, allTimeVisits}) => {
  const [newRoomID, setNewRoomID] = useState([]);
  const [isInvalidRoom, setisInvalidRoom] = useState();

  //Updates rooms array with data from Firebase
  const roomExists = (id) => {
    let exists = false;
    rooms.forEach(roomID => {
      if(id == roomID){
        exists = true;
      }
    });
    return exists;
  }

  const updateLocalStorage = (id, roomID) => {
    localStorage.setItem(`LocalID`, id);
    localStorage.setItem(`LocalRoomID`, roomID);
  }

  //Prevent the default function. If newUser is not an empty value ("", " ", "  ", etc.), call the
  //addUser function with newUser.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roomExists(newRoomID)){
      const newUserID = uuidv4();
      await setDoc(doc(database, "Statistics", "AllTimeVisits"), {
        Count: allTimeVisits + 1
      })  
      updateLocalStorage(newUserID, newRoomID);
      setRoomID(newRoomID);
    }
    else {
      setisInvalidRoom(true);
    }
  }

  return (
    <form className="RoomForm" onSubmit={handleSubmit}>

      <input type="number" className="room-input" value={newRoomID}
      placeholder="Enter Room ID" onChange={(e) => (e.target.value.length > 4) ?
      e.target.value = e.target.value.slice(0, 4) :
      setNewRoomID(e.target.value.toString())}/>

      <button type="submit" className="room-form-btn">Join</button>

      {(isInvalidRoom) ? <h4 id="invalid-alert">Please enter a valid Room ID</h4> : null}
    </form>
  )
}

export default RoomForm
