import React from 'react';
import './Landing.css';
import Imagge from './HotelView.jpg';
const Landing=()=>{
    return(
        <header>
            <div classname="HotelImage">
            <img  src={Imagge} alt="LandingImage" />
            </div>
        </header>
    );
}

export default Landing;
