/*
* Firebase basics tutorial
* https://fireship.io/lessons/firebase-quickstart/
* */


// Part 1
// Grab a reference to button elements
const signInBtn = document.getElementById('signInButton');
const signOutBtn = document.getElementById('signOutBtn');

// Set up initial firebase authorization obj
const auth = firebase.auth();
// create a provider (there could be more than one, think google, facebook, email/password, github, etc
const provider = new firebase.auth.GoogleAuthProvider();

// Create click handlers for signing in and out
signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

// create references to elements for the signed in section, signed out section, and userDetails div
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const userDetails = document.getElementById('userDetails');

// Handle state change from not logged in to logged in and vice versa
auth.onAuthStateChanged(user => {
   if (user){
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3><p>User Id: ${user.uid}</p>`;
   } else   {
       whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
   }
});

// Part 2
// Create variables for button and list
const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

// Create a variable for firestore SDK
const db = firebase.firestore();

// reference to document or collection that you want to access
// reference to a database location where you want to CRUD
let thingsRef;

// In order to read data in real time, the frontend UI will always react to changes in the db
// need to unsubscribe after to prevent memory leaks and other things
// Create variable to tell app when to stop listening to real time stream
let unsubscribe;

auth.onAuthStateChanged(user => {
   if(user){
       // set reference to location we want to write to
        thingsRef = db.collection('things');

        createThing.onclick = () =>  {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
            // faker is a library for generating random data for testing
            // use servertimestamp rather than something like Date.now()
            // so that the date is consistent across machines
        }

        // Query for getting real time data from db
       // Get all things that belong to the logged in user
       // returns a function to unsubscribe from real time data stream at a later time
       unsubscribe = thingsRef.where('uid', '==', user.uid)
           .onSnapshot(querySnapshot => {

               // map results to an array of li's that will get shoved into doc
               const items = querySnapshot.docs.map(doc => {
                  return `<li>${doc.data().name}</li>`
               });

               thingsList.innerHTML = items.join('');
           });

       // onSnapshot creates real time stream, if we only wanted to read data once,
       // we could use 'get' instead
       // --> you provide a callback that will be run everytime the underlining data changes
       // --> gives you access to querySnapshot object which is an array of documents returned
   } else {
       // unsubscribe on sign out
       unsubscribe && unsubscribe();
   }
});

/*
* Some queries require indexes in order to work
* if one is needed, an error will be thrown to the console
* follow the link it provides to create one
*
* ex. when using 'where' method with == and range operator like < or orderBy
* thingsRef
*    .where('uid', '==', user.uid)
*    .orderBy('createdAt') // Requires an index
* */

/*
* Security rules need to be added to rules sheet
* to make sure r/w/d accesses are restricted
*
* ex. allow users to only create a doc associated with their userid
*  or allow them to only access the docs they have created
*
* service cloud.firestore {
  match /databases/{database}/documents {

    // Lock down the database
    match /{document=**} {
      allow read, write: if false;

    // Allow authorized requests to the things collection
    match /things/{docId} {
      allow write: if request.auth.uid == request.resource.data.uid;
      allow read: if request.auth.uid == resource.data.uid;
    }

  }
}
*
*
* */