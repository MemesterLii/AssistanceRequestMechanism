import './App.css';
import React, {useState, useEffect} from 'react';
import {database} from './firebase';
import {doc, onSnapshot} from 'firebase/firestore';
import LandingPage from './components/LandingPage';
import HostPage from './components/HostPage';
import GuestPage from './components/GuestPage';

// App.jsx is the first component (layer of the onion).
function App() {
  // useState() variables (state variables) are special variables that, upon
  // having their value changed through their setter function, trigger React's
  // re-rendering of this component and child components (lower layers) upon
  // changing. These re-renders change the website without reloads or redirects.
  const [roomID, setRoomID] = useState('');
  const [isHost, setIsHost] = useState();
  const [allTimeVisits, setAllTimeVisits] = useState(0);

  //Keeps user in their room across website reloads.
  //NOTE: useEffect() is like Unity's Update function.
  // It runs every time the virtual DOM renders.
  // If state variables are passed into the array parameter,
  // then it only runs when those states update.
  useEffect(() => {
    const localID = localStorage.getItem(`LocalID`);
    const localRoomID = localStorage.getItem(`LocalRoomID`);
    if(localRoomID != null && localID != null){
      const docRef = doc(database, 'Rooms', localRoomID);
      //NOTE: onSnapshot() runs every time the Firebase database senses a change.
      onSnapshot(docRef, (querySnapshot) => {
        //NOTE: use querySnapshot.data() not just querySnapshot to boot out guest upon host deleting room.
        if (querySnapshot.data() != undefined){
          setRoomID(localRoomID);
          if (localID.trim() == querySnapshot.data().HostID.trim()){
            setIsHost(true);
          }
          else{
            setIsHost(false);
          }
        }
        else{
          // If room does not exist, then clear state and local data.
          setRoomID(undefined);
          setIsHost(undefined);
          localStorage.clear();
        }
      })
    }
    else{
      // If local storage is incomplete, then clear state and local data.
      setRoomID(undefined);
      setIsHost(undefined);
      localStorage.clear();
    }
  }, []);

  // Updates the All Time Visits counter.
  const statRef = doc(database, 'Statistics', 'AllTimeVisits');
  onSnapshot(statRef, (querySnapshot) => {
    if (querySnapshot.data() != undefined){
      setAllTimeVisits(querySnapshot.data().Count);
    }
  });

  const getReturnComponent = () => {
    let returnComponent;
    if (roomID){
      if(isHost){
        // NOTE: React components can also take arguments.
        returnComponent = <HostPage roomID={roomID} setRoomID={setRoomID}/>;
      }
      else{
        returnComponent = <GuestPage roomID={roomID} setRoomID={setRoomID}/>;
      };
    }
    else{
        returnComponent = <LandingPage setRoomID={setRoomID} setIsHost={setIsHost} allTimeVisits={allTimeVisits}/>;
    };
    return returnComponent;
  };
  
  // NOTE: The HTML elements in the return statement of a React component are
  // what is rendered.
  return (
    <div id="App">
      <h1>A.R.M.</h1>
      <h4>Assistance Request Mechanism</h4>
      <img src="/src/assets/logo.png" alt="A.R.M. Logo"></img>

      {getReturnComponent()}
      <h4 id="website-info">All Time Visit Counter: {allTimeVisits} <br/> 2024 Site developed by Andre Lee using React.js and Firebase.</h4>
    </div>
  );
};

export default App;
