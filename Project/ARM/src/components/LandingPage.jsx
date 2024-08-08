import React, {useState} from 'react';
import { database } from '../firebase';
import {query, collection, onSnapshot, setDoc, doc} from 'firebase/firestore';
import RoomForm from './RoomForm';
import {v4 as uuidv4} from 'uuid';
uuidv4();

const LandingPage = ({setRoomID, setIsHost, allTimeVisits, setAllTimeVisits}) => {
  const [inputtingRoomCode, setInputtingRoomCode] = useState();
  const statRef = doc(database, 'Statistics', 'AllTimeVisits');
  let rooms = [];

  //Updates rooms array with data from Firebase upon a change in the database
  const docRef = collection(database, 'Rooms');
  onSnapshot(docRef, (querySnapshot) => {
    if (querySnapshot != undefined){
      rooms.length = 0;
      querySnapshot.forEach((item) => {
        rooms.push(item.id);
      })
    }
  })

  const updateLocalStorage = (id, roomID) => {
    localStorage.setItem(`LocalID`, id);
    localStorage.setItem(`LocalRoomID`, roomID);
  }

  const generateRoomID = () => {
    let newRoomID = Math.floor(Math.random() * 10000)

    newRoomID = (newRoomID < 10) ? "000" + newRoomID :
    (newRoomID < 100) ? "00" + newRoomID :
    (newRoomID < 1000) ? "0" + newRoomID :
    newRoomID.toString();
    
    return newRoomID;
  }

  const addRoom = async () => {
    let newRoomID = generateRoomID();
    while (rooms.includes(newRoomID)){
      newRoomID = generateRoomID();
    }

    //Save data locally
    const newHostID = uuidv4();
    updateLocalStorage(newHostID, newRoomID);

    //Save data to Firebase
    await setDoc(doc(database, "Rooms", newRoomID), {
      HostID: newHostID,
      Users: []
    })

    return newRoomID;
  }

  const isHostOfRoom = () => {
    const localID = localStorage.getItem(`LocalID`);
    const localRoomID = localStorage.getItem(`LocalRoomID`);

    onSnapshot(doc(database, 'Rooms', localRoomID), (querySnapshot) => {
      if (localID == querySnapshot.data().HostID){
        return true;
      }
      return false;
    })
  }

  const hostSubmit = async (e) => {
    e.preventDefault();
    const roomID = addRoom();
    await setDoc(statRef, {
      Count: allTimeVisits + 1
    })
    setRoomID(roomID);
    setIsHost(isHostOfRoom());

    //Force reload to load the host page (FIX LATER)
    location.reload();
  }
  
  const joinSubmit = async (e) => {
    e.preventDefault();
    setInputtingRoomCode(true);
  }

  return (
    <div className='LandingPage'>
      <form onSubmit={hostSubmit}>
        <button type="submit" className="host-join-btn">Host a Room</button>
      </form>

      {inputtingRoomCode ? <RoomForm rooms={rooms} setRoomID={setRoomID}
      allTimeVisits={allTimeVisits}/> :
      <form onSubmit={joinSubmit}>
        <button type="submit" className="host-join-btn">Join a Room</button>
      </form>}
    </div>
  )
}

export default LandingPage