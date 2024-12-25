import React from "react";
import './Offers.css';
import exclusive_image from '../Assets/offers img.png'
const Offers=()=>{
    return(
        <div className="offers">
         
<div className="offers-left">
<h1>Eclusive</h1>
<h1>Offers for you</h1>
<p>ONLY ON BEST SELLERS PRODUCTS</p>
<button>Check Now</button>
</div>
<div className="offers-right">
<img src={exclusive_image} alt="" height={500}/>
</div>
            </div>
    
    )
}
export default Offers