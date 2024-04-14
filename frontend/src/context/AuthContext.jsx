import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    // JSON.parse is used to take string value & convert it into object => 
    // JSON.parse(localStorage.getItem("chat-user")) || null => if this is emply it returns null value
    const [ authUser, setAuthUser ] = useState(JSON.parse(localStorage.getItem("chat-user")) || null)

    return <AuthContext.Provider value={{ authUser, setAuthUser }}> 
        {children} 

    </AuthContext.Provider>
}