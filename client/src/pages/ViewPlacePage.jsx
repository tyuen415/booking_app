import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect} from "react";
import ICONS_MAP from "../icon_constants.jsx";
import BookingWidget from "./BookingWidget.jsx";


export default function ViewPlacePage() {
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    
    
    useEffect(() => {
        if (!id) {
            return;
        } else {
            axios.get(`/places/${id}`).then(response => {
                setPlace(response.data)
            });
        }
    }, [id])

    if (!place) return '';

    if(showAllPhotos === true) {
        return (
            <div className="absolute bg-white w-full -mx-8 -mt-5 py-8 px-8">
                <button className="pointer-cursor back-button" onClick={e => setShowAllPhotos(false)}> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="min-h-screen max-w-screen-md mx-auto w-full">
                    <div className="px-8">
                        {place.photos.length > 0 && place.photos.map(photo => (
                            <div key={photo} className="relative aspect-w-3 aspect-h-2 mb-2">
                                <img className="object-cover" src={"http://localhost:4000/uploads/" + photo} alt=""/>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
            
        )
    }

    return (
    //     'xs': '320px',
    //   'sm': '640px',
    //   'md': '768px',
    //   'lg': '1024px',
    //   'xl': '1280px',
    //md:h-[453px] md:w-[768px] lg:h-[610px] lg:w-[1024px]
    <div className="-mx-8 mt-8">
        <div className="flex flex-col max-w-screen-lg mx-auto mt-4 px-6 py-8 gap-2 w-full h-full">
            <h1 className="xs:text-xl sm:text-3xl">{place.title}</h1>
            <a className=" flex block font-semibold underline cursor-pointer" target="_blank" href={'http://maps.google.com/?q=' + place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>

            {place.address}
            </a>
            <div className="flex flex-col relative flex-1 mb-4">
                <div className="grid grid-cols-[6fr_4fr] flex-1 gap-2">
                    <div className="relative aspect-w-3 aspect-h-2">
                        <img src={"http://localhost:4000/uploads/" + place.photos[0]} className="w-full h-full object-cover rounded-2xl"/>
                    </div>
                    <div className="grid gap-2">
                        <div className="relative aspect-w-3 aspect-h-2">
                            <img src={"http://localhost:4000/uploads/" + place.photos[1]} className="w-full h-full object-cover rounded-2xl"/>
                        </div>
                        <div className="relative aspect-w-3 aspect-h-2">
                            <img src={"http://localhost:4000/uploads/" + place.photos[2]} className="w-full h-full object-cover rounded-2xl"/>
                        </div>
                        
                    </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white px-4 shadow shadow-md shadow-gray-500 py-2 rounded-2xl" onClick={e => setShowAllPhotos(true)}>
                    <div className="flex gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                        </svg>
                        Show more photos 
                    </div> 
                </button>
            </div>
            <div className="grid grid-cols-[6fr_5fr] gap-6 ">
                <div>
                    <hr></hr>
                    <div className="my-4 flex flex-cols gap-2 items-center">
                        <img className="w-[40px] h-[40px] rounded-full object-cover rounded-2xl" src={"http://localhost:4000/uploads/" + "photo1719349883538.jpg"}/>
                        <div>
                            Hosted by {place.owner.name}
                        </div>
                    </div>
                    <hr></hr>
                    <div className="my-4">
                            <h2 className="font-semibold text-2xl mb-2"> Description </h2>
                            {place.description}
                    </div>
                    <hr></hr>
                    
                    {place.perks.length > 0 && 
                        <div className="my-4">
                            <h2 className="font-semibold text-2xl"> Amenities </h2>
                            <div className="grid grid-cols-2 gap-3 mt-1 mb-4">
                                {place.perks.map((pl) => {
                                    return (
                                    <div>
                                        <div key={pl} className="flex gap-2">
                                            {ICONS_MAP[pl]} {pl}
                                        </div>
                                    </div>
                                    )
                                    
                                })
                                
                                }
                            </div>
                            <hr></hr>
                        </div>
                    }
                    <div>
                        <h2 className="font-semibold text-2xl"> Extra Information </h2>
                        <div>
                            {place.extraInfo}
                        </div>
                    </div>
                </div>
                <BookingWidget place={place}/>
            </div>
        </div>
    </div>  
    )
}