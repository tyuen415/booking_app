import {useState} from 'react'
import axios from 'axios'

export default function PhotosUploader({toFewPhotos, addedPhotos, onChange}) {
    const [photoLink, setPhotoLink] = useState('');
    const [validPhotoLink, setValidPhotoLink] = useState(true)
    const [validPhotoUpload, setValidPhotoUpload] = useState(true)
    
    function inputHeader(text) {
        return (
            <h2 className="text-xl mt-4">{text}</h2>
        )
    }

    async function addPhotoByLink (event) {
        try{
            event.preventDefault();
            const response = await axios.post('/upload-photo-by-link', {link: photoLink})
            const filename = response.data;
            onChange(prev => {
                return [...prev, filename]
            })
            setPhotoLink("")
            setValidPhotoLink(true)
        } catch (err) {
            console.log("we have an error: " + err);
            setValidPhotoLink(false)
        }
        
    }
    
    function removePhoto (filename) {
        onChange(prev => {
            return prev.filter(photo => photo !== filename)
        })
    }

    function selectAsMainPhoto(filename) {
        let newPhotos = [...addedPhotos];
        for (let i = 0; i < addedPhotos.length; i++) {
            if (addedPhotos[i] === filename) {
                let temp = newPhotos[0];
                newPhotos[0] = filename;
                newPhotos[i] = temp;
                break;
            }
        }
        onChange(newPhotos)   
    }

    //for uploaded photos, i would add them into addedPhotos, then i would put them into added photos. Then i re-render all photos
    //in addedPhotos. Once i click on them, I remove them from addedPhotos and re-render.
    async function handleUploadedPhotos (event) {
            try {
                event.preventDefault();
                const files = Array.from(event.target.files);
                
                let formData = new FormData();
                files.forEach(file => {
                    formData.append('photos', file)
                })
                const response = await axios.post("/upload-photo-by-computer", formData, 
                    {headers: {'Content-type': 'multipart/form-data'}
                })

                setValidPhotoUpload(true)
                const {data: photos} = response
                for(let i = 0; i < photos.length; i++) {
                    onChange(prev => {
                        return [...prev, photos[i].filename]
                    })
                }
            } catch (error) {
                if (error.response.status === 400 && error.response.data['error'] === 'Error: Images Only!') {
                    setValidPhotoUpload(false)
                }
            } 
        };

    return (
        <div>
            {inputHeader('Photos')}
            <div className='flex gap-2'>
                <input type='text' className={`border-2 ${!validPhotoLink ? 'border-red-600' : 'border-inherit'}`} placeholder={'Add using a link...'} value={photoLink} onChange={e => setPhotoLink(e.target.value)}/>
                <button className='bg-gray-200 px-4 rounded-2xl' onClick={addPhotoByLink}>Add&nbsp;Photo</button>
            </div>
            {!validPhotoLink && <div className="text-red-600 text-center mb-2 rounded" >Not a valid image URL</div>}
            <div className="grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
                <label className={`cursor-pointer flex justify-center text-lg border bg-transparent rounded-2xl p-8 mt-4 text-gray-600 ${!validPhotoUpload ? 'border-red-600' : 'border-inherit'} ${toFewPhotos ? 'border-red-600' : 'border-inherit'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    <input type="file" multiple display="none" onChange={handleUploadedPhotos}/>
                    Upload Photos
                </label>
            </div>
            {!validPhotoUpload && <div className="text-red-600 mb-2 rounded" >File was not an image! </div>}
            {toFewPhotos && <div className="text-red-600 mb-2 rounded"> Must include at least 3 Photos!</div>}
            {addedPhotos.length > 0 && 
                <div className="grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 gap-2">
                    {addedPhotos.map(link => (
                        <div key={link} className="mt-4 md:h-52 lg:h-48 flex relative">
                            <img key={link} className="w-full h-full rounded-2xl object-cover aspect-square" src={"http://localhost:4000/uploads/" + link} alt=""/>
                            <button type="button" onClick={() => removePhoto(link)} className="absolute cursor-pointer bottom-px right-px text-white bg-black p-1 bg-opacity-50 rounded-2xl "> 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <button type="button" onClick={() => selectAsMainPhoto(link)} className="absolute cursor-pointer bottom-px left-px text-white bg-black p-1 bg-opacity-50 rounded-2xl "> 
                                {link === addedPhotos[0] ? <
                                    svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>}
                            </button>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}