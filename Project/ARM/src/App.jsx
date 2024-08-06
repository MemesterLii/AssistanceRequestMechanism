import './App.css';
import React, {useState, useEffect} from 'react';
import { database } from './firebase';
import {doc, onSnapshot} from 'firebase/firestore';
import LandingPage from './components/LandingPage';
import HostPage from './components/HostPage';
import GuestPage from './components/GuestPage';

function App() {
  const [roomID, setRoomID] = useState('');
  const [isHost, setIsHost] = useState();

  //Keeps user in their room across website reloads.
  //NOTE: useEffect() is like Unity's Update function. It runs every time the virtual DOM renders.
  useEffect(() => {
    const localID = localStorage.getItem(`LocalID`);
    const localRoomID = localStorage.getItem(`LocalRoomID`);
    if(localRoomID != null && localID != null){
      const docRef = doc(database, 'Rooms', localRoomID);
      //NOTE: onSnapshot() runs everytime the Firebase database senses a change.
      onSnapshot(docRef, (querySnapshot) => {
        if (querySnapshot != undefined){
          setRoomID(localRoomID);
          if (localID == querySnapshot.data().HostID){
            setIsHost(true)
          }
          else{
            setIsHost(false);
          }
        }
        else{
          setRoomID(undefined);
          setIsHost(undefined);
        }
      })
    }
  }, [roomID, isHost]);

  const getReturnComponent = () => {
    let returnComponent;
    if (roomID){
      if(isHost){
        returnComponent = <HostPage roomID={roomID}/>;
      }
      else{
        returnComponent = <GuestPage roomID={roomID}/>;
      }
    }
    else{
      returnComponent = <LandingPage setRoomID={setRoomID} setIsHost={setIsHost}/>;
    }
    return returnComponent;
  }
  
  return (
    <div className="App">
      {getReturnComponent()}
      <h4 id="website-info">All Time Visit Counter: PLACEHOLDER</h4>
    </div>
  )
}

export default App
