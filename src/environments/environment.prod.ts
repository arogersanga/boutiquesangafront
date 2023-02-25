// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  url: '',
  urlREST: 'https://boutiqueapisanga.herokuapp.com/',
  urlFiles: 'https://console.firebase.google.com/project/ecommerce-website-95c9f/storage/ecommerce-website-95c9f.appspot.com/files/~2Fimages'
};

export const firebaseConfig = {
  apiKey: "AIzaSyCHn1MXoocHE8rFKNfAFisHO5gqlufJbuQ",
  authDomain: "ecommerce-website-95c9f.firebaseapp.com",
  projectId: "ecommerce-website-95c9f",
  storageBucket: "ecommerce-website-95c9f.appspot.com",
  messagingSenderId: "571259958389",
  appId: "1:571259958389:web:eaae501ca7b79acb92343c",
  measurementId: "G-JVPNXZMSQM"
};

export const filesEnvironment = {
  production: true,
  url: '',
  urlREST: 'http://94.23.247.20:8001/boutiqueapisanga/',
  urlFiles: 'http://192.168.1.102:443/assets/images/products/'
};