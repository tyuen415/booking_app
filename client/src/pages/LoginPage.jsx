import {Link, Navigate, useLocation} from 'react-router-dom';
import {useState, useContext} from 'react';
import axios from 'axios';
import {UserContext} from "../UserContext.jsx"

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);
    const {setUser} = useContext(UserContext);
    const location = useLocation();
    const from = location.state?.location?.pathname || '/';

    async function LoginUser(e) {
        e.preventDefault();
        try {
            const {data} = await axios.post("/login", {
                email,
                password
            });
            setUser(data);
            alert('Login Successful');
            setRedirect(true);
        } catch (error) {
            console.log("ERROR123: " + error);
            alert('Login Failed');
            setError(true)
        }
    }

    if (redirect === true) {
        return <Navigate to={from} replace/>
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
           <div>
                <div className="mb-64">
                    
                    <h1 className="text-4xl text-center mb-4">Login</h1>
                    <form className="max-w-lg mx-auto" onSubmit={LoginUser}>
                        <input className={`border-2 ${error ? 'border-red-600' : 'border-inherit'}`} type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <input className={`border-2 ${error ? 'border-red-600' : 'border-inherit'}`} type="password" placeholder="password"  value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        {error && <div className="text-red-600 text-center mb-2 rounded" >Email and Password combination doesn't exist</div>}
                        <button className='primary'> Login </button>
                        <div className="py-2 text-center text-gray-500">
                            Don't have an account yet?
                            <Link className="underline text-black" to={'/register'}> Register Now!</Link>
                        </div>
                    </form>
                </div>
           </div>
        </div>
    );
}