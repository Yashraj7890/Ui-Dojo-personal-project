import {signInWithPopup,GoogleAuthProvider} from "firebase/auth";
import {auth} from "./firebase/firebase.config";
const googleProvider =new GoogleAuthProvider();

export const signInWithGoogle=async()=>{
    const result = await signInWithPopup(auth, googleProvider);
    window.location.reload();
  

}
export const signOut=async()=>{
    await auth.signOut().then(()=>{
        window.location.reload();
    })
}

