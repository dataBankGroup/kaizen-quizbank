import {createContext} from "react";
import {User} from "../utils/Type";


const UserContext = createContext<User | undefined>(undefined);


export default UserContext;