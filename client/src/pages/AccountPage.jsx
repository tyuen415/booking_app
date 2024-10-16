import {useState, useContext} from 'react';
import {UserContext} from '../UserContext/'
import { Navigate, useParams, useLocation } from 'react-router-dom';
import PlacesPage from './PlacesPage.jsx'
import ProfilePage from './ProfilePage.jsx';
import AccountNavigation from './AccountNavigation.jsx';

export default function AccountPage() {
    const {user, ready} = useContext(UserContext)
    const location = useLocation();

    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = 'profile'
    }

    if (!ready) {
        return <div> Loading </div>
    }
    if (ready && !user) {
        return <Navigate to={'/login'} state={{location: location}}/>
    }
    
    return (
        <div>
            <AccountNavigation/>
            {subpage === 'places' && (
                <PlacesPage/>
            )}
            {subpage === 'profile'  && (
                <ProfilePage/>
            )}
        </div>
    )

    
}