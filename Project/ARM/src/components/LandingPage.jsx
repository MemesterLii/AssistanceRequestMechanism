import React, {useState} from 'react';
import { database } from '../firebase';
import {query, collection, onSnapshot, setDoc, doc} from 'firebase/firestore';
import RoomForm from './RoomForm';
import {v4 as uuidv4} from 'uuid';
uuidv4();

const LandingPage = ({setRoomID, setIsHost}) => {
  const [inputtingRoomCode, setInputtingRoomCode] = useState();
  const [rooms, setRooms] = useState([]);
  const [allTimeVisits, setAllTimeVisits] = useState(0);

  //Updates rooms array with data from Firebase upon a change in the database
  const docRef = query(collection(database, 'Rooms'));
  onSnapshot(docRef, (querySnapshot) => {
    if (querySnapshot != undefined){
      let tempArray = [];
      querySnapshot.forEach((item) => {
        tempArray.push(item.id);
      })
      setRooms(tempArray);
    }
  })

  const statRef = query(collection(database, 'Statistics'));
  onSnapshot(statRef, (querySnapshot) => {
    if (querySnapshot != undefined){
      setAllTimeVisits(querySnapshot.AllTimeVisits);
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

    await setDoc(doc(database, "Statistics", "AllTimeVisits"), {
      count: allTimeVisits + 1
    })

    return newRoomID;
  }

  const isHostOfRoom = () => {
    const localID = localStorage.getItem(`LocalID`);
    const localRoomID = localStorage.getItem(`LocalRoomID`);

    onSnapshot(doc(database, 'Rooms', localRoomID), (querySnapshot) => {
      console.log(querySnapshot.data().HostID);
      if (localID == querySnapshot.data().HostID){
        return true;
      }
      return false;
    })
  }

  const hostSubmit = async (e) => {
    e.preventDefault();
    const roomID = addRoom();
    await setDoc(doc(database, "Statistics", "AllTimeVisits"), {
      count: allTimeVisits + 1
    })
    setRoomID(roomID);
    setIsHost(isHostOfRoom());
    //console.log(globalRoomID);
    //console.log(isHost);
    //reload to skip past rendering error, idk why
    //location.reload();
  }
  
  const joinSubmit = async (e) => {
    e.preventDefault();
    setInputtingRoomCode(true);
  }

  return (
    <div className='LandingPage'>
      <h1>A.R.M.</h1>
      <h4>Assistance Request Mechanism</h4>
      <img src="/src/assets/altFavicon2.ico" alt="A.R.M. Logo"></img>

      <form onSubmit={hostSubmit}>
        <button type="submit" className="host-join-btn">Host a Room</button>
      </form>

      {inputtingRoomCode ? <RoomForm setRoomID={setRoomID}/> :
      <form onSubmit={joinSubmit}>
        <button type="submit" className="host-join-btn">Join a Room</button>
      </form>}

    </div>
  )
}

export default LandingPage