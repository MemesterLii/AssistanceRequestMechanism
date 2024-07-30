import React, {useState} from 'react'
import { database } from '../firebase';
import {query, collection, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, doc, orderBy} from 'firebase/firestore'

const RoomForm = () => {
  const [roomID, setRoomID] = useState("")
  const [rooms, setRooms] = useState([]);

  //Updates rooms array with data from Firebase
  useEffect(() => {
    const data = query(collection(database, 'Rooms'))

    const updateRooms = onSnapshot(data, (querySnapshot) => {
      let tempArray = []
      querySnapshot.forEach((item) => {
        tempArray.push(item.id)
      })
      setRooms(tempArray)
    })

    return () => updateRooms()
  }, [])

  //Prevent the default function. If newUser is not an empty value ("", " ", "  ", etc.), call the
  //addUser function with newUser.
  const handleSubmit = e => {
    e.preventDefault();

    
 
    setRoomID("")
  }

  return (
    <form className="RoomForm" onSubmit={handleSubmit}>

      <input type="number" className="user-input" value={roomID}
      placeholder="Enter Room ID" onChange={(e) => (e.target.value.length > 4) ?
      e.target.value = e.target.value.slice(0, 4) :
      setRoomID(e.target.value.toString())}/>

      <button type="submit" className="submit-btn">Join</button>
    </form>
  )
}

export default RoomForm
