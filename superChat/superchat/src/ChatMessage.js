const ChatMessage = ({ auth, message: { text, uid } }) => {
  const messageClass = uid == auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  );
};

export default ChatMessage;
