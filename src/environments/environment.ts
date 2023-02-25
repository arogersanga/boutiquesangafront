// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  url: '',
  urlREST: 'https://boutiqueapisanga.herokuapp.com/',
  urlFiles: 'assets/images/products/'
};
/*
export const firebaseConfig = {
  apiKey: "AIzaSyCP5Cl1iYy6vesv-yXLg__i6MP1ekcTIYE",
  projectId: "salainroger",
  storageBucket: "salainroger.appspot.com"
 };
*/

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
  urlFiles: 'http://94.23.247.20:8002/assets/images/products/'
};