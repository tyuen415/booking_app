import {Link, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react';
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [redirect, setRedirect] = useState(false);
    async function registerUser(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Password and Confirm Password must match');
            return;
          }
          try {
            await axios.post('/register', {
                name,
                email,
                password,
                confirmPassword
            });
            alert('Registration successful. Now you can log in');
            setRedirect(true);
          } catch (error) {
            alert('Registration Failed. Please Try Again Later')
          }
        
        

    }

    useEffect(() => {
        setPasswordsMatch(password === confirmPassword);
      }, [password, confirmPassword]);

    function handlePasswordChange(e) {
        const {name, value} = e.target;
        if (name === 'password') {
            setPassword(value);
          } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
          }

    }


    if (redirect) {
        return <Navigate to={'/login'}/>
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-lg mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Name" 
                        value={name} 
                        onChange={e => {
                        setName(e.target.value)}}>    
                    </input>
                    <input type="email" placeholder="your@email.com" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}>
                    </input>
                    <input type="password" name="password" placeholder="password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={{ border: passwordsMatch ? '1px solid #ccc' : '1px solid red' }}> 
                    </input>
                    <input type="password" name="confirmPassword" placeholder="confirm password"
                        value={confirmPassword}
                        onChange={handlePasswordChange}
                        style={{ border: passwordsMatch ? '1px solid #ccc' : '1px solid red' }}> 
                    </input>
                    {!passwordsMatch && <div className="pb-2" style={{ color: 'red' }}>Passwords do not match</div>} {/* Display error message if passwords don't match */}
                    <button className='primary' id="submit_button"> Register </button>
                    <div className="py-2 text-center text-gray-500">
                        Already have an Account?  
                        <Link className="underline text-black ml-1" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}