import React, {useState} from 'react';
import {database} from '../firebase';
import {doc, getDoc, setDoc, collection, onSnapshot} from 'firebase/firestore';
import RoomForm from './RoomForm';
import {v4 as uuidv4} from 'uuid';
uuidv4();

// CREDITS: I learned how to utilize React hooks through this YouTube video:
// https://www.youtube.com/watch?v=LoYbN6qoQHA
// Getting and setting data in Google's Firebase databases were learned through
// this video:
// https://www.youtube.com/watch?v=drF8HbnW87w

const LandingPage = ({setRoomID, setIsHost, allTimeVisits}) => {
  const [inputtingRoomCode, setInputtingRoomCode] = useState();
  const statRef = doc(database, 'Statistics', 'AllTimeVisits');
  let rooms = [];
  let landingPageRoomID;

  // Updates rooms array with data from Firebase upon a change in the database.
  const docRef = collection(database, 'Rooms');
  onSnapshot(docRef, (querySnapshot) => {
    if (querySnapshot != undefined){
      rooms.length = 0;
      querySnapshot.forEach((item) => {
        rooms.push(item.id);
      });
    };
  });

  const updateLocalStorage = (id, roomID) => {
    localStorage.setItem(`LocalID`, id);
    localStorage.setItem(`LocalRoomID`, roomID);
  };

  const generateRoomID = () => {
    let newRoomID = Math.floor(Math.random() * 10000);

    // Four digit formatting.
    newRoomID = (newRoomID < 10) ? "000" + newRoomID :
    (newRoomID < 100) ? "00" + newRoomID :
    (newRoomID < 1000) ? "0" + newRoomID :
    newRoomID.toString();
    
    return newRoomID;
  };

  const addRoom = async () => {
    let newRoomID = await generateRoomID();
    // Ensures no duplicate rooms.
    while (rooms.includes(newRoomID)){
      newRoomID = await generateRoomID();
    };

    // Save data to state and localStorage.
    // NOTE: uuidv4() generates a long string of random characters.
    const newHostID = uuidv4();
    updateLocalStorage(newHostID, newRoomID);

    // Save data to Firebase.
    await setDoc(doc(database, "Rooms", newRoomID), {
      HostID: newHostID,
      Users: []
    });

    return newRoomID;
  };

  const isHostOfRoom = async () => {
    const localID = localStorage.getItem(`LocalID`);
    const localRoomID = localStorage.getItem(`LocalRoomID`);

    let room = await getDoc(doc(database, 'Rooms', localRoomID));
    if (localID == room.HostID){
      return true;
    };
    return false;
  };

  const hostSubmit = async (e) => {
    // e.preventDefault() is necessary to keep submit functions functional.
    e.preventDefault();
    landingPageRoomID = await addRoom();
    if(allTimeVisits > 0){
      await setDoc(statRef, {
        Count: allTimeVisits + 1
      });  
    };

    // These state setter functions that were passed in as an argument of this
    // Landing Page component from App will set the states within App.
    setIsHost(isHostOfRoom());
    setRoomID(landingPageRoomID);
  };
  
  const joinSubmit = async (e) => {
    e.preventDefault();
    // This will render an input box for a room code from the user.
    setInputtingRoomCode(true);
  };

  return (
    <div id='LandingPage'>
      <form onSubmit={hostSubmit}>
        <button type="submit" className="host-join-btn">Host a Room</button>
      </form>

      {inputtingRoomCode ? <RoomForm rooms={rooms} setRoomID={setRoomID}
      allTimeVisits={allTimeVisits}/> :
      <form onSubmit={joinSubmit}>
        <button type="submit" className="host-join-btn">Join a Room</button>
      </form>}
    </div>
  );
};

export default LandingPage;
