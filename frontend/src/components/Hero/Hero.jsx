import React from "react";
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png';
import arrow_icon from '../Assets/arrow.png'; 
import hero_image from '../Assets/shopinglogo.png';
import { useNavigate } from "react-router-dom";
const Hero=()=>{
    const navigate=useNavigate();
    return(
        <div className="hero">
<div className="hero-left">
    <h2>NEW ARRIVALS ONLY</h2>
    <div>
        <div className="hero-hand-icon">
            <p>new</p>
            <img src={hand_icon} alt=""/>
        </div>
        <p>collections</p>
        <p>for everyone</p>
    </div>

    <button className="hero-latest-btn" onClick={()=>navigate('/latestcollection')}>
       Latest Collection
        <img src={arrow_icon} alt=""/>
    </button>
</div>

<div className="hero-right">
<img src={hero_image} alt="" height={500}  />
</div> 
        </div>
        
    )
}
export default Hero