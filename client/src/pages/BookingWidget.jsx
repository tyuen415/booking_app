import { useState, useEffect, useContext } from "react";
import {differenceInCalendarDays} from "date-fns"
import {UserContext} from '../UserContext/'
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import axios from 'axios';


export default function BookingWidget({place}) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guestCount, setGuestCount] = useState(1);
    const {user, ready} = useContext(UserContext);
    const [phoneNumber, setPhoneNumber] = useState('')
    const location = useLocation();
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState('');

    const isHoverDisabled = guestCount === 1 || guestCount === place.maxGuests;
    const plusStrokeColor = isHoverDisabled ? (guestCount === place.maxGuests ? "#DCDCDC" : "#696969") : 'black';
    const minusStrokeColor = isHoverDisabled ? (guestCount === 1 ? "#DCDCDC" : "#696969") : 'black';



    function decrement() {
        if (guestCount > 1) {
            setGuestCount(count => count - 1)
        }
    }

    function increment() {
        if (guestCount < place.maxGuests) {
            setGuestCount(count => count + 1)
        }
    }

    async function bookPlace() {
        if (ready && user && checkIn && checkOut && phoneNumber) {
            const data = {checkIn, checkOut, guestCount, name: user.name, phoneNumber, place: place._id, price: place.price * differenceInCalendarDays(new Date(checkOut), new Date(checkIn))}
            const response = await axios.post('/bookings', data)
            const bookingId = response.data._id
            setRedirect(`/account/bookings/${bookingId}`);

        } else if (ready && !user) {
            navigate("/login", {state: {location: location}})
            
        } else {
            
        }
    }

    if (!ready) {
        return <div> Loading </div>
    }

    if (redirect) {
        return <Navigate to={redirect}/>
    }

    return (
            <div className="my-4">
            <div className="bg-white shadow p-4 rounded-2xl">
                <div className="text-2xl text-center">
                    Price: ${place.price} / per night
                </div>
                <div className="my-2">
                    <div className="grid grid-cols-2">
                        <div className="rounded-tl-xl p-1 border border-black">
                            
                            <label className="font-bold"> CHECK-IN </label>
                            <br/>
                            <input className="w-full" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} type="date"/>
                        </div>
                        <div className="rounded-tr-xl p-1 border border-black">
                            <label className="font-bold"> CHECKOUT </label>
                            <br/>
                            <input className="w-full" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} type="date"/>
                        </div>
                    </div>
                    <div className="rounded-b-xl p-1 border border-black">
                        <div>
                            <label className="font-bold"> GUESTS </label>
                            <div className="flex justify-between items-center">
                                <p> {guestCount} {guestCount > 1 ? "guests" : "guest"} </p>
                                <div>
                                    <button onClick={decrement} className={`p-1 mr-1 border border-slate-300 rounded-full ${guestCount === 1 ? "no-hover cursor-not-allowed" : "gray-hover"}`}>  
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={minusStrokeColor} className={`size-6 ${guestCount === 1 ? "no-hover" : "gray-hover"}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                        </svg>
                                    </button>
                                    <button onClick={increment} className={`p-1 mr-1 border border-slate-300 rounded-full gray-hover ${guestCount === place.maxGuests ? "no-hover cursor-not-allowed" : "gray-hover"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={plusStrokeColor} className={`size-6 ${guestCount === place.maxGuests ? "no-hover" : "gray-hover"}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </div>
                                
                            </div>
                                
                        </div>
                        
                    </div>
                    <div className="mt-2 border p-2 rounded-2xl border-black">
                        <PhoneInput className="number" country={"us"} value={phoneNumber} onChange={ev => setPhoneNumber(ev)}/>
                    </div>
                    
                    
                </div>
                <button onClick={bookPlace} className="primary"> 
                    Book this place 
                </button>
            </div>
        </div>
    )
}