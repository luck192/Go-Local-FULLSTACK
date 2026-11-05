import './App.css'
import {Routes,Route,useNavigate } from 'react-router-dom'
import MainHome from './Components/MainHome/MainHome'

import UserLogin from "./Pages/Logins/UserLogin";
import RiderLogin from "./Pages/Logins/RiderLogin";
import ShopLogin from "./Pages/Logins/ShopLogin";

import RiderHome from './HOMES/Riderhome/RiderHome';
import ShopHome from './HOMES/ShopHome/ShopHome';
import UserHome from './HOMES/Userhome/Userhome1';


function App() {
   const navigate = useNavigate();
  return (
   <div>
    <Routes>
      <Route
        path="/"
        element={<MainHome onSelect={(role) => navigate(`/${role}/login`)} />}
      />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/rider/login" element={<RiderLogin />} />
      <Route path="/shop/login" element={<ShopLogin />} />
      <Route path="/user/home" element={<UserHome/>} />
      <Route path="/rider/home" element={<RiderHome/>} />
      <Route path="/shop/home" element={<ShopHome/>} />
     
    </Routes>
   </div>
  )
}

export default App
