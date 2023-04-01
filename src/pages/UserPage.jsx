import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Feed from '../components/Feed';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function UserPage() {
  let uid =  useParams().uid;
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true)

  const getUserData = async()=>{
    const snap = await getDoc(doc(db, 'users', uid));
    setUser(snap.data());
    setloading(false);
    console.log(user);
  }
  loading && getUserData();
  
  return (
    <>
        <div className='bg-color-3 rounded-lg my-5'>
            <div className="flex flex-shrink-0 p-4">
                <div className="flex-shrink-0 group block">
                    <div className="flex items-center">
                        <div>
                            <img className="inline-block h-10 w-10 rounded-full" src={user?.img} alt="" />
                        </div>
                        <div className="ml-3">
                            <p className="text-base leading-6 font-medium color-1">
                                {user?.username}
                                {loading && <>Loading...</>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Feed userID={uid}/>
    </>
  )
}

export default UserPage