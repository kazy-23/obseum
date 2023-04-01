import { doc, getDocs, limit, query, collection, orderBy, updateDoc, arrayUnion, addDoc, serverTimestamp, where} from 'firebase/firestore'
import {auth, db} from '../firebase'
import React, {useState} from 'react'
import Post from './Post';
import { useAuthState } from 'react-firebase-hooks/auth';

function Feed({userID}) {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [user] = useAuthState(auth);
  
  const getFeed = async()=>{
    let q = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(100));

    if(userID.length>0){
      q = query(collection(db, 'posts'), where('id', '==', userID), orderBy('date', 'desc'), limit(100));
    }

    const querySnapshot = await getDocs(q);
    const msgs = [];
    querySnapshot.forEach(async (doc)=>{
      let data = doc.data();
      data['uid'] = doc.id;
        msgs.push(data);
    })
    setPosts(msgs);
    setLoading(false);
    console.log('update');
  }

  loading && getFeed();

  function dateCovert(day, month){
    let m = '';
    switch(month){
      case 0:
        m='January';
        break;
      case 1:
        m='February';
        break;
      case 2:
        m='March';
        break;
      case 3:
        m='April';
        break;
      case 4:
        m='May';
        break;
      case 5:
        m='June';
        break;
      case 6:
        m='July';
        break;
      case 7:
        m='August';
        break;
      case 8:
        m='September';
        break;
      case 9:
        m='October';
        break;
      case 10:
        m='November';
        break;
      case 11:
        m='December';
        break;
      default:
        m='';
    }

    return day + ' ' + m;
  }

  function likesConvert(likes){
    let string = likes.toString()
    if(likes>999){
      if(likes>999999){
        return string.substring(0, string.length-6) + 'M';
      }
      return string.substring(0, string.length-3) + 'K';
    }
    return string;
  }

  const like = async(id, e)=>{
    await updateDoc(doc(db, 'posts', id), {
      likes: arrayUnion(user.uid),
    });
    getFeed();
  }

  const openComment = async(uid)=>{
    if(open === uid){
      setOpen('');
      setComments([]);
    }
    else{
      setOpen(uid);
      const q = query(collection(db, "posts", uid, 'comments'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      let comms = [];
      querySnapshot.forEach((doc) => {
        comms.push(doc.data());
      });
      await updateDoc(doc(db, 'posts', uid), {
        comments: comms.length,
      })
      setComments(comms);
    }
    setText('');
  }

  const share = async(uid)=>{
    await addDoc(collection(db, 'posts', uid, 'comments'), {
      date: serverTimestamp(),
      id: user.uid,
      text: text,
      username: user.displayName,
      img: user.photoURL,
    });
    setOpen(uid);
    const q = query(collection(db, "posts", uid, 'comments'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    let comms = [];
    querySnapshot.forEach((doc) => {
      comms.push(doc.data());
    });
    setComments(comms);
    await updateDoc(doc(db, 'posts', uid), {
      comments: comms.length,
    });
    getFeed();
    setText('');
  }
  
  return (
    <>
      {userID==='' && <Post setLoading={setLoading}/>}
      {loading && <div className='color-1'>Loading...</div>}
      {
        posts?.map((post)=>(
          <div key={post['uid']} className='bg-color-3 rounded-lg my-5'>
            <div className="flex flex-shrink-0 p-4 pb-0">
              <a href={'/user/' + post.id}className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div>
                    <img className="inline-block h-10 w-10 rounded-full" src={post.img ? post.img : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'} alt="" />
                  </div>
                  <div className="ml-3">
                    <p className="text-base leading-6 font-medium color-1">
                      {post.username}
                      <span className="p-1 text-sm leading-5 font-medium color-2">
                          {post.date && dateCovert(post.date.toDate().getDate(), post.date.toDate().getMonth())}
                        </span>
                        </p>
                  </div>
                </div>
              </a>
            </div>
            <div className="pl-16">
              <p className="text-base width-auto font-medium flex-shrink text-white">
                {post.text}
              </p>
              <div className="flex">
                  <div className="w-full">
                      <div className="flex justify-end items-center">
                          <div className="text-end  color-1">
                            <div className="mt-1 group flex items-center color-1 px-3 py-2 text-base leading-6 font-medium rounded-full">
                              {likesConvert(post.likes.length)}
                            </div>
                          </div>
                          <div className="text-center">
                              <button onClick={post.likes.indexOf(user.uid)>=0 ? null : (e)=>{like(post['uid'], e)}} className="w-12 mt-1 group flex items-center color-1 px-3 py-2 text-base leading-6 font-medium rounded-full hoverbtn">
                               <svg className="text-center h-7 w-6" fill={post.likes.indexOf(user.uid)>=0 ? '#cbe4de' : 'none'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                              </button>
                          </div>
                          <div className="text-end  color-1">
                            <div className="mt-1 group flex items-center color-1 px-3 py-2 text-base leading-6 font-medium rounded-full">
                              {post.comments ? post.comments : '0'}
                            </div>
                          </div>
                          <div className="text-center">
                              <button onClick={()=>openComment(post['uid'])} className="w-12 mt-1 group flex items-center color-1 px-3 py-2 text-base leading-6 font-medium rounded-full hoverbtn">
                                  <svg className="text-center h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                              </button>
                          </div>             
                      </div>
                  </div>
              </div>

              {open === (post['uid']) && <>
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
                      <textarea value={text} onChange={(e)=>setText(e.target.value)} className="bg-transparent border-none border-transparent focus:border-none w-5/6 h-100" placeholder='Write your comment...' display='none'/>
                  </p>


                  <div className="flex">
                      <div className="w-full">
                          <div className="flex justify-end items-center">
                              <div className="text-center">
                              <button onClick={()=>share(post['uid'])} className='bg-color-2 text-white px-5 py-1 m-2 rounded-full'>Share</button>
                              </div>           
                          </div>
                      </div>
                  </div>
                </div>

                <div className={comments.length>0 ? 'pb-10' : 'pb-0'}>
                  {comments.map((comment)=>(
                    <div key={comments.indexOf(comment)}>
                      <div className="flex flex-shrink-0 p-4 pb-0">
                        <a href="/"className="flex-shrink-0 group block">
                          <div className="flex items-center">
                            <div>
                              <img className="inline-block h-10 w-10 rounded-full" src={comment.img ? comment.img : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'} alt="" />
                            </div>
                            <div className="ml-3">
                              <p className="text-base leading-6 font-medium color-1">
                                {comment.username}
                                <span className="p-1 text-sm leading-5 font-medium color-2">
                                    {comment.date && dateCovert(comment.date.toDate().getDate(), comment.date.toDate().getMonth())}
                                  </span>
                                  </p>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="pl-16">
                        <p className="text-base width-auto font-medium flex-shrink text-white">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>}
            </div>
          </div>
        ))
      }
    </>
  )
}

export default Feed