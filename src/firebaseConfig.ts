import firebase from 'firebase';
import 'firebase/database';


const firebaseConfig = {
  apiKey: 'AIzaSyC_11_x-_MJc2jTJDPl4kMEVE9j1AD5nH4',
  authDomain: 'to-do-f68eb.firebaseapp.com',
  databaseURL: 'https://to-do-f68eb-default-rtdb.firebaseio.com',
  projectId: 'to-do-f68eb',
  storageBucket: 'to-do-f68eb.appspot.com',
  messagingSenderId: '842402979630',
  appId: '1:842402979630:web:a4d0bc8e26857ba7c764bf',
  measurementId: 'G-1BVENDYJCX',
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const database = firebase.database();
export default firebase;
