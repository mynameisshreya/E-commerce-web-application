import React, { useContext } from 'react'
import './Placeorder.css'
import { ShopContext } from '../../context/ShopContext'
const Placeorder = () => {
    const {getTotalCartAmount}=useContext(ShopContext)
  return (
  <form action="" className='place-order'>
    <div className="place-order-left">
    <p className='title'>Delivery Information</p>
        <div className="multi-fields">
            <input type="text" placeholder='First name' className='fields'/>
            <input type="text" placeholder='Last name' className='fields'/>
        </div>
    
            <input type="text" placeholder='Email address' className='field'/>
            <input type="text" placeholder='Street' className='field'/>
    
        <div className='multi-fields'>
            <input type="text" placeholder='City' className='fields' />
            <input type="text" placeholder='State' className='fields'/>
        </div>
        <div className='multi-fields'>
            <input type="text" placeholder='Zip code' className='fields'/>
            <input type="text" placeholder='Country' className='fields'/>
        </div>
        <input type="text" placeholder='Phone' className='field' />
    </div>
    <div className="place-order-right">
        <div className="cartitems-total">
        <h1>cart Totals</h1>
        <div>
            <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
                <p>Discount</p>
                <p>${100}</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()-100}</h3>
            </div>
        </div>
        <button >PROCEED TO PAYMENT</button>
    </div>
    </div>
  </form>
  )
}

export default Placeorder