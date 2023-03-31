import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, {useState} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'

function Post({setLoading}) {
  const [user] = useAuthState(auth);
  const [msg, setMsg] = useState('');
  const publish = async()=>{
    let text = msg;
    setMsg('');
    await addDoc(collection(db, 'posts'), {
        date: serverTimestamp(),
        id: user.uid,
        likes: [],
        text: text,
        username: user.displayName,
        img: user.photoURL,
    })
    setLoading(true);
  }
  
    return (
    <div className='bg-color-3 rounded-lg my-5'>
        <div className="flex flex-shrink-0 p-4 pb-0">
        <a href="/"className="flex-shrink-0 group block">
            <div className="flex items-center">
            <div>
                <img className="inline-block h-10 w-10 rounded-full" src={user.photoURL} alt="" />
            </div>
            <div className="ml-3">
                <p className="text-base leading-6 font-medium color-1">
                {user.displayName} 
                <span className="p-1 text-sm leading-5 font-medium color-2">
                    Now
                    </span>
                    </p>
            </div>
            </div>
        </a>
        </div>
        <div className="pl-16">
        <p className="text-base width-auto font-medium flex-shrink text-white">
            <textarea className="bg-transparent border-none border-transparent focus:border-none w-5/6 h-100" placeholder='Write your post...' display='none' value={msg} onChange={(e)=>setMsg(e.target.value)}/>
        </p>


        <div className="flex">
            <div className="w-full">
                <div className="flex justify-end items-center">
                    <div className="text-center">
                    <button onClick={publish} className='bg-color-2 text-white px-5 py-1 m-2 rounded-full'>Post</button>
                    </div>           
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Post