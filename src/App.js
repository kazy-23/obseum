import './App.css';
import Feed from './components/Feed';
import Navbar from './components/Navbar';
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function App() {
  const [user] = useAuthState(auth);
  
  return (
    <Navbar>
      {user ? <Feed /> : <div className="color-1 text-xl text-center m-5">Log in to view the feed.</div>}
    </Navbar>
  );
}

export default App;
