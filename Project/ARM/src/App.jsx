import './App.css'
import UserWrapper from './components/UserWrapper'
import LandingPage from './components/LandingPage'
import HostPage from './components/HostPage'
import GuestPage from './components/GuestPage'
import React, {useState, useEffect} from 'react'
import { database } from './firebase';
import {query, collection, onSnapshot, addDoc, getDoc, setDoc, updateDoc, deleteDoc, doc, orderBy} from 'firebase/firestore'

function App() {
  const [roomID, setRoomID] = useState()
  const [isHost, setIsHost] = useState()

  //NOTE: useEffect() is like Unity's Update function. It runs every time the virtual DOM renders.
  useEffect(() => {
    const fetchData = async () => {
      const localID = localStorage.getItem(`LocalID`);
      const localRoomID = localStorage.getItem(`LocalRoomID`);
      const room = await getDoc(doc(database, "Rooms", localRoomID));

      //Keeps the user in their room even after reloading.
      if (room.exists && localID != null) {
        setRoomID(localRoomID);
        console.log(roomID);
        (localID == room.HostID) ? setIsHost(true) : setIsHost(false)
      }
    }
    fetchData();
  }, [])

  return (
    <div className="App">
      {(!roomID) ? <LandingPage setRoomID={setRoomID} setIsHost={setIsHost}/> :
      (isHost) ? <HostPage roomID={roomID}/> : <GuestPage roomID={roomID}/>}

      <h4>All Time Visit Counter: [PLACEHOLDER]</h4>
    </div>
  )
}

export default App
