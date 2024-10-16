import {useState, useEffect, useContext} from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Perks from './PerksLabels.jsx';
import AccountNavigation from './AccountNavigation.jsx';
import PhotosUploader from './PhotosUploader.jsx';
import axios from 'axios';
import {UserContext} from '../UserContext/';

export default function PlacesFormPage () {
    const {user} = useContext(UserContext);
    const [lister, setLister] = useState('')
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [redirect, setRedirect] = useState(false)
    const [price, setPrice] = useState(100)
    const [toFewPhotos, setTooFewPhotos] = useState(false)

    useEffect(() => {
        if(!id) {
            return;
        }
        
        axios.get('/places/' + id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setAddedPhotos(data.photos);
            setLister(data.owner);
            if (data.price) {
                setPrice(data.price);
            }
            
        })
    }, [id]);

    async function addNewPlace(event) {
        event.preventDefault();
        const placeData = {title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests, price
        };

        try {
            if (addedPhotos.length < 3) {
                setTooFewPhotos(true)
                return; // Stop the function execution if the condition is not met
            }
            if (!id) {
                await axios.post("/places", placeData);
            } else {
                
                await axios.post('/update_place', {id, ...placeData})
                
            }
            setRedirect(true)
        } catch (error) {
            if (error.response.status === 403) {
                alert("Can't Change Post that isn't yours")
            }
            else if (error.response.status === 400) {
                console.log("validation Error here right now")
                alert("Need at Least 3 photos here")
            }
        }
        
    }

    function handlePerkChanges(event) {
        const { name, checked } = event.target;
        setPerks((prevSelectedPerks) => {
          if (checked) {
            // Add the perk if checked
            return [...prevSelectedPerks, name];
          } else {
            // Remove the perk if unchecked
            return prevSelectedPerks.filter(perk => perk !== name);
          }
        });
      };
    
    if (redirect) {
        return <Navigate to={'/account/places'}/>
    }

    function inputHeader(text) {
        return (
            <h2 className="text-xl mt-4">{text}</h2>
        )
    }
    
    return (
        <div>
            <AccountNavigation/>
            <div className="flex justify-center min-h-screen">
                    <form className="w-full max-w-5xl mx-auto" encType="multipart/form-data" onSubmit={addNewPlace}>
                        {inputHeader('Title')}
                        <input type="text" placeholder="title" value={title} onChange={e => setTitle(e.target.value)}/>
                        {inputHeader('Address')}
                        <input type="text" placeholder="address" value={address} onChange={e => setAddress(e.target.value)}/>
                        <PhotosUploader toFewPhotos={toFewPhotos} addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                        {inputHeader('Description')}
                        <textarea className="h-48" value={description} onChange={e => setDescription(e.target.value)}/>
                        {inputHeader('Perks')}
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            <Perks selected={perks} onChange={handlePerkChanges}/>
                        </div>
                        {inputHeader('Extra Info')}
                        <p className='text-gray-500 text-sm'> house rules, etc</p>
                        <textarea className="h-48" value={extraInfo} onChange={e => setExtraInfo(e.target.value)}></textarea>
                        {inputHeader('Check In and Out times')}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input type="text" placeholder="14:00" value={checkIn} onChange={e => setCheckIn(e.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input type="text" value={checkOut} onChange={e => setCheckOut(e.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max Guests</h3>
                                <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Price per night</h3>
                                <input type="number" value={price} onChange={e => setPrice(e.target.value)}/>
                            </div>
                        </div>
                        {((user && lister && user._id === lister._id) || (!id)) &&
                        <button className="primary my-4"> Save </button>}
                    </form>
                </div>
        </div>
        
    )
}