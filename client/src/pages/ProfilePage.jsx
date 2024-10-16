import { useState, useContext, useEffect} from "react";
import { UserContext } from "../UserContext";
import AccountNavigation from './AccountNavigation.jsx';

export default function ProfilePage() {
    const {user} = useContext(UserContext);
    const [email, setEmail] = useState('')
    const [myName, setMyName] = useState('')

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setMyName(user.name);
        }
    }, [user]);

    return (
        <>
        <div className="flex justify-center items-center">
            
            <form className="flex flex-col text-center border border-gray-600 px-5 pb-2 rounded-lg">
                <div>
                    <label className="mb-2"> Email </label>
                    <input
                        className="max-w-lg w-full px-3 py-2 border rounded-md"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="mb-2"> Name </label>
                    <input
                        className="max-w-lg w-full px-3 py-2 border rounded-md"
                        type="text"
                        value={myName}
                        onChange={e => setMyName(e.target.value)}
                    />
                </div>
                
                <button className="primary max-w-lg w-full px-4 py-2 mt-4 border rounded-md" id="submit_button">
                    Update
                </button>
            </form>
        </div>
        </>
    );
}