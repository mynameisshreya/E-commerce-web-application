import React, { useContext, useEffect, useState } from "react";
import './CartItems.css';
import {ShopContext} from '../../context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import {jwtDecode} from "jwt-decode"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";

const  CartItems=()=>{
    const {getTotalCartAmount,all_product,cartItems,removeFromCart}=useContext(ShopContext)
 const navigate=useNavigate();
    const [consumer,setConsumer]=useState()
    useEffect(()=>{
        const token=localStorage.getItem('auth-token')
        console.log(token)
        if(token){
            const decoded=jwtDecode(token);
            setConsumer(decoded.user.email);
            console.log(decoded.user.email)
        }
    })
    const sendEmail =async ()=>{
        try{
            const res = await axios.post(`http://localhost:4000/order`,{
                email:consumer
            })
        }
        catch(e){
            console.log(e)
        }
    }
    
    return(
        <div className="cartitems">
<div className="cartitems-format-main">
    <p>Product</p>
    <p>Title</p>
    <p>Price</p>
    <p>Quantity</p>
    <p>Total</p>
    <p>Remove</p>
</div>
<hr/>
{all_product.map((e)=>{
    if(cartItems[e.id]>0)
        {
        return <div>
    <div className="cartitems-formate cartitems-format-main">
        <img src={e.image} alt="" className="carticon-product-icon" />
        <p>{e.name}</p>
        <p>${e.new_price}</p>
        <button className="cartitems-quantity">{cartItems[e.id]}</button>
        <p>
${e.new_price*cartItems[e.id]}
        </p>
        <img className="cartitems-remove-icon" src={remove_icon} onClick={()=>{removeFromCart(e.id)}}alt="" />
    </div>
    <hr/>
</div>
        
        
    }
    return null;
})}
<div className="cartitems-down">
    <div className="cartitems-total">
        <h1>cart Totals</h1>
        <div>
            <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
                <p>Shipping fee</p>
                <p>Free</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
            </div>
        </div>
        <button onClick={sendEmail}>PROCEED TO CHECKOUT</button>
    </div>
    <div className="cartitems-promocode">
        <p>If yor have promo code,Enter it here</p>
        <div className="cart-item-promobox">
            <input type="text" placeholder="promo code" required={true}/>
            <button><Link to='/order' onClick={navigate} style={{"textDecoration":"none","color":"white"}}>Submit</Link></button>
        </div>
    </div>
</div>
        </div>
    )
}
export default CartItems