import AccountNavigation from "./AccountNavigation.jsx";
import {useEffect, useState} from 'react';
import axios from 'axios';
import PlaceImg from "./PlaceImg.jsx";
import {Link} from 'react-router-dom'
import {format} from "date-fns"
export default function MyBookingsPage () {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('/bookings').then(response => {
            setBookings(response.data)
        })
    }, [])

    return (
        <div>
            <AccountNavigation/>
            <div>
                {bookings?.length > 0 && bookings.map(booking => (
                <Link to={'/account/bookings/' + booking.place._id}>
                    <div className="flex grow-0 cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl">
                        <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                            <PlaceImg place={booking.place}/>
                        </div>
                        <div>
                            <h2 className="text-xl">{booking.place.title} </h2>
                            <p>{"Check In: " + format(new Date(booking.checkIn), 'yyyy-MM-dd')}</p>
                            <p>{"Check Out: " + format(new Date(booking.checkOut), 'yyyy-MM-dd')}</p>
                            <p>{"Price: $" + booking.price}</p>
                        </div>
                    </div>
                </Link>
                
            ))} 
            </div>
        </div>
    )
}