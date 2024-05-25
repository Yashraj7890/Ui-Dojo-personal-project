import {combineReducers} from "redux";
import userAuthReducer from "./userAuthReducer";
import projectReducer from "./projectReducer";

const Reducer= combineReducers({
    user:userAuthReducer,
    projects:projectReducer

})


export default Reducer;