import {signInWithRedirect,GoogleAuthProvider} from "firebase/auth";
import {auth} from "./firebase/firebase.config";
const googleProvider =new GoogleAuthProvider();

export const signInWithGoogle=async()=>{
    await signInWithRedirect(auth,googleProvider).then(userCred=>{
      
        window.location.reload();
    })

}
export const signOut=async()=>{
    await auth.signOut().then(()=>{
        window.location.reload();
    })
}

