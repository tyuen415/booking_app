import { useParams } from "react-router-dom"
import AccountNavigation from "./AccountNavigation";
import { useEffect } from "react";
import axios from "axios";

export default function BookingPage(){
    const {id} = useParams();
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({id}) => _id === id)
            })
        }
    }, [id])

    return (
        <div className="mt-4">
            <div>
                single booking: {id}
            </div>
        </div>
        
    )
}