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
   const [allTimeVisits, setAllTimeVisits] = useState(0);

  //Keeps user in their room across website reloads.
  //NOTE: useEffect() is like Unity's Update function. It runs every time the virtual DOM renders.
  useEffect(() => {
    const localID = localStorage.getItem(`LocalID`);
    const localRoomID = localStorage.getItem(`LocalRoomID`);
    if(localRoomID != null && localID != null){
      const docRef = doc(database, 'Rooms', localRoomID);
      //NOTE: onSnapshot() runs everytime the Firebase database senses a change.
      onSnapshot(docRef, (querySnapshot) => {
        //NOTE: use querySnapshot.data() not just querySnapshot to boot out guest upon host deleting room.
        if (querySnapshot.data() != undefined){
          setRoomID(localRoomID);
          if (localID.trim() == querySnapshot.data().HostID.trim()){
            setIsHost(true)
          }
          else{
            setIsHost(false);
          }
        }
        else{
          setRoomID(undefined);
          setIsHost(undefined);
          localStorage.clear();
        }
      })
    }
    else{
      setRoomID(undefined);
      setIsHost(undefined);
      localStorage.clear();
    }
  }, [roomID, isHost]);

  const statRef = doc(database, 'Statistics', 'AllTimeVisits');
  onSnapshot(statRef, (querySnapshot) => {
    if (querySnapshot.data() != undefined){
      setAllTimeVisits(querySnapshot.data().Count);
    }
  })

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
        returnComponent = <LandingPage setRoomID={setRoomID}
        setIsHost={setIsHost} allTimeVisits={allTimeVisits}
        setAllTimeVisits={setAllTimeVisits}/>;
    }
    return returnComponent;
  }
  
   return (
     <div className="App">
      <h1>A.R.M.</h1>
      <h4>Assistance Request Mechanism</h4>
      <img src="/src/assets/altFavicon2(GitHub).ico" alt="A.R.M. Logo"></img>

      {getReturnComponent()}
      <h4 id="website-info">All Time Visit Counter: {allTimeVisits} <br /> 2024 Site developed by Andre Lee using React.js and Firebase.</h4>
     </div>
   )
 }

export default App
