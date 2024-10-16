import {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default function IndexPage() {
    const [places, setPlaces] = useState([])
    useEffect(() => {
        axios.get('/all-places').then(response => {
            setPlaces(response.data)
        })
    }, [])

    return (
        <div className="mt-8 grid xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-x-6 gap-y-8">
            {places.length > 0 && places.map(place => (
                <Link to={'/place/' + place._id} className="">
                    <div className="relative">
                        <div className="bg-gray-300 mb-2 rounded-2xl overflow-hidden aspect-w-1 aspect-h-1">
                            <img key={place.photos[0]} className="object-cover" src={"http://localhost:4000/uploads/" + place.photos?.[0]} alt=""/>
                        </div>
                        
                        <h3 className="font-bold">{place.address}</h3>
                        <h2 className="text-sm truncate text-gray-500">{place.title}</h2>
                        <div className="mt-1">
                            <span className="font-bold">${place.price} per night</span>
                        </div>
                    </div>
                    
                </Link>
            ))}
        </div>
    );
}