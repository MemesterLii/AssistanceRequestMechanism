import React, {useState, useEffect} from 'react'
import UserForm from './UserForm'
import EditUserForm from './EditUserForm'
import {v4 as uuidv4} from 'uuid';
import User from './User';
import { database } from '../firebase';
import {query, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy} from 'firebase/firestore'
uuidv4();

const GuestPage = ({roomID}) => {
  //Declare and initialize an empty users array along with its setter function
  const [users, setUsers] = useState([]);

  //Read user data from Firebase
  useEffect(() => {
    const data = query(collection(database, 'UsersCollection'), orderBy("timestamp"))

    const updateUsers = onSnapshot(data, (querySnapshot) => {
      let tempArray = []
      querySnapshot.forEach((item) => {
        tempArray.push({...item.data(), id: item.id})
      })
      setUsers(tempArray)
    })

    return () => updateUsers()
  }, [])

  //Given a user object, set the users array to all previous user objects + a new object using user's properties
  //Note: the id of the new object in the users array is randomly generated using uuidv4()
  const addUser = async (user) => {
    //Updates Firebase data
    await addDoc(collection(database, "UsersCollection"), {
      name: user,
      //I tried using firebase.firestore.Timestamp.now() at first but I think it's
      //a Java function, not a JavaScript function. I forgot Firebase is used in
      //other programming languages, too. Now, I just use JavaScript's Date.now().
      timestamp: Date.now()
    })
  }

  //Given a user id, filter out any user with an id matching the provided id
  const deleteUser = async (id) => {
    await deleteDoc(doc(database, "UsersCollection", id))
  }
  
  //Given a user id, toggle the isEditing property of the user with the matching id
  const toggleEditing = id => {
    setUsers(users.map(user => user.id === id ? {... user, isEditing: !user.isEditing} : user))
  }

  //Given a new name and an id, replace the name of the matching id user object in the users array with the new name
  //Then, set all other user objects the same
  const editUser = async (name, id) => {
    //Note: this line is required to prevent field clearing upon submitting an unchanged name
    setUsers(users.map(user => user.id === id ? {... user, name, isEditing: !user.isEditing} : user))
    //Updates Firebase data
    await updateDoc(doc(database, "UsersCollection", id), {
      name: name
    })
  }

  return (
    <div className='GuestPage'>
      <h1>A.R.M.</h1>
      <h4>Assistance Request Mechanism</h4>
      <img src="/src/assets/altFavicon2.ico" alt="A.R.M. Logo"></img>
      
      <h4>This is the Guest Page</h4>

      <UserForm addUser={addUser} />

      {
      //It may seem simple one day, but I felt extreme joy when the next 4 lines worked first try for me.
      //By the way, I don't know how to comment in the return statement as of writing this.
      }
      <h4>There {users.length === 1 ? 
      " is " + users.length + " person " :
      " are " + users.length + " people "}
      in the queue:</h4>

      {//Map the users array normally unless a user.isEditing is true.
      //If so, replace that entry in the queue with an edit box.

      //Note: the index parameter is unnecessary for the website's proper functioning, but it fixes an error in the console log.
      users.map(
        (user, index) => 
        (user.isEditing ? 
        (<EditUserForm editUser={editUser} oldUser={user}/>) : 
        (<User user={user} position={users.indexOf(user) + 1} deleteUser={deleteUser} toggleEditing={toggleEditing} key={index}/>))
      )}
    </div>
  )
}

export default GuestPage