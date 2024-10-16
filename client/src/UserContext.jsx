//This is so we can give access to all routes information without having to pass down props 
import {createContext, useState, useEffect} from 'react'
import axios from 'axios';
export const UserContext = createContext({})

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false)
    useEffect(() => {
        if (!user){
            const getProfile = async () => {
                const {data} = await axios.get('/profile');
                setUser(data);
                setReady(true);
            }
            getProfile();
            
        }
    }, [])

    return (
        <UserContext.Provider value ={{user, setUser, ready, setReady}}>
            {children}
        </UserContext.Provider>
    )
}