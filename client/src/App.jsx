import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import Layout from "./Layout.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import AccountPage from "./pages/AccountPage.jsx"
import axios from 'axios';
import {UserContextProvider} from './UserContext.jsx';
import PlacesPage from './pages/PlacesPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PlacesFormPage from './pages/PlacesFormPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import ViewPlacePage from './pages/ViewPlacePage.jsx';
import BookingPage from './pages/BookingPage.jsx';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;
function App() {

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />}/>
            <Route path='/login' element={<LoginPage />}/> 
            <Route path='/register' element={<RegisterPage />}/>
            <Route path='/account/' element={<AccountPage />}/>
            <Route path='/account/places' element={<PlacesPage />}/>
            <Route path='/account/places/new' element={<PlacesFormPage />}/>
            {/* //<Route path='/account/profile' element={<ProfilePage />}/> */}
            <Route path='/account/bookings' element={<MyBookingsPage />}/>
            <Route path='/account/bookings/:id' element={<BookingPage />}/>
            <Route path='/account/places/:id' element={<PlacesFormPage />}/>
            <Route path="place/:id" element={<ViewPlacePage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
