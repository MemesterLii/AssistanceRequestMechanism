import React, {useState, useEffect} from 'react'
import UserForm from './UserForm'
import RoomForm from './RoomForm'
import EditUserForm from './EditUserForm'
import {v4 as uuidv4} from 'uuid';
import User from './User';
import { database } from '../firebase';
import {query, collection, onSnapshot, addDoc, getDoc, setDoc, updateDoc, deleteDoc, doc, orderBy} from 'firebase/firestore'
uuidv4();

const LandingPage = ({setRoomID, setIsHost}) => {
  const [inputtingRoomCode, setInputtingRoomCode] = useState(false);
  const [rooms, setRooms] = useState([]);

  //Updates rooms array with data from Firebase
  //NOTE: useEffect() is like Unity's Update function. It runs every time the virtual DOM renders.
  useEffect(() => {
    const fetchData = () => {
      const data = query(collection(database, 'Rooms'))

      const updateRooms = onSnapshot(data, (querySnapshot) => {
        let tempArray = []
        querySnapshot.forEach((item) => {
          tempArray.push(item.id)
        })
        setRooms(tempArray)
      })
  
      return () => updateRooms()
    }
    fetchData();
  }, [])

  const updateLocalStorage = (name, id, roomID) => {
    if (name !== null){
      localStorage.setItem(`LocalName`, name);
    }
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

  const roomExists = (newRoomID) => {
    let exists = false;
    rooms.forEach(roomID => {
      if(newRoomID == roomID){
        exists = true;
      }
    });
    return exists;
  }

  const addRoom = async () => {
    let newRoomID = generateRoomID();
    while (roomExists(newRoomID)){
      newRoomID = generateRoomID();
    }

    const newHostID = uuidv4();
    updateLocalStorage(null, newHostID, newRoomID);

    await setDoc(doc(database, "Rooms", newRoomID), {
      HostID: newHostID,
      Users: []
    })

    return newRoomID;
  }

  const isHostOfRoom = async () => {
    const localID = localStorage.getItem(`LocalID`);
    const localRoomID = localStorage.getItem(`LocalRoomID`);
    const room = await getDoc(doc(database, "Rooms", localRoomID));

    console.log(room);
    
    if (localID == room.HostID){
      return true;
    }
    return false;
  }

  const hostSubmit = e => {
    e.preventDefault();
    const roomID = addRoom();
    setRoomID(roomID);
    setIsHost(isHostOfRoom());
    console.log("setted host")
    //reload to skip past rendering error, idk why
    //location.reload();
  }
  
  const joinSubmit = e => {
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

      {inputtingRoomCode ? <RoomForm /> :
      <form onSubmit={joinSubmit}>
        <button type="submit" className="host-join-btn">Join a Room</button>
      </form>}

    </div>
  )
}

export default LandingPage