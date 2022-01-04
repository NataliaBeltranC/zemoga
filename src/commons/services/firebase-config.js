import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import candidates from '../../information/data.json';
import { TABLES_STORE } from '../constans/tables-store';

// Set the configuration for your app
// TODO: Replace with your project's config object
const firebaseConfig = {
  apiKey: "AIzaSyDcoETkJ9ls0H8VgWfKhwwCn8LJh4RFzXk",
  authDomain: "zemoga-fd263.firebaseapp.com",
  projectId: "zemoga-fd263",
  storageBucket: "zemoga-fd263.appspot.com",
  messagingSenderId: "704559651951",
  appId: "1:704559651951:web:6c237b7b55e4d779d3c19a"
};
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
getDatabase(app);

const database = getDatabase();
const postRef = ref(database, TABLES_STORE.POSTS);

onValue(postRef, (snapshot) => {
  !snapshot.exists() && set(postRef, candidates.data);
}, {
  onlyOnce: true
});
