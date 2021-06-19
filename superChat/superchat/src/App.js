import "./App.css";

// firebase sdk imports
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// hooks to make react and firebase play nice
import { useAuthState } from "react-firebase-hooks/auth";
//import { useCollectionData } from "react-firebase-hooks/firestore";

// Components
import Chatroom from "./Chatroom";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

// Config from firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBe9-6d5Tj2h0VyGbK2soD8TbdWTJBIjUM",
  authDomain: "superchat-87ca4.firebaseapp.com",
  projectId: "superchat-87ca4",
  storageBucket: "superchat-87ca4.appspot.com",
  messagingSenderId: "822414260674",
  appId: "1:822414260674:web:1cd2d7133edcc330337e5b",
};

// Initialize app on page load with config
firebase.initializeApp(firebaseConfig);

// reference to auth and firestore variables
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  // returns the user if logged in and null otherwise
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut auth={auth} />
      </header>

      <section>
        {user ? (
          <Chatroom firestore={firestore} auth={auth} firebase={firebase} />
        ) : (
          <SignIn auth={auth} firebase={firebase} />
        )}
      </section>
    </div>
  );
}

export default App;
