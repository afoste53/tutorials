import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import { useRef, useState } from "react";

const Chatroom = ({ firestore, auth, firebase }) => {
  const scrollRef = useRef();

  const messageRef = firestore.collection("messages");

  // set up query
  const query = messageRef.orderBy("createdAt").limit(25);

  // use hook to listen to the data and react (heh heh) in real time
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    // use .add() to write to database
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    });

    setFormValue("");

    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} auth={auth} />
          ))}

        <div ref={scrollRef}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send!</button>
      </form>
    </>
  );
};

export default Chatroom;
