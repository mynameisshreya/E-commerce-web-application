import React, { useContext, useRef, useState } from "react";
import './Navbar.css';

import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png'
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png"
import bag_icon from "../Assets/bag_icon.png"
import logout from "../Assets/logout_icon.png"
import profile from "../Assets/profile_icon.png"

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);
    const navigate = useNavigate()
    const menuRef = useRef();
    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }
    const Order = () => {
        navigate("/Cart")
    }
    const Logout = () => {
        localStorage.removeItem('auth-token');
        window.location.replace("/")
    }
    return (
        <div className="navbar">
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>SHOPPER</p>
            </div>
            <img className="nav-dropdown" onClick={dropdown_toggle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => { setMenu("shop") }}><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("mens") }}><Link to='/men' style={{ textDecoration: 'none' }}>Men</Link>{menu === "mens" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("womens") }}><Link to='/women' style={{ textDecoration: 'none' }}>Women</Link>{menu === "womens" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("kids") }}><Link to='/kids' style={{ textDecoration: 'none' }}>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>
            </ul>

            <div className="nav-login-cart">

                {localStorage.getItem('auth-token')
                    ? <div className="nav-profile" ><img src={profile} alt="" />
                        <ul className="nav-profile-dropdown">

                            <li>
                                <img src={bag_icon} alt="" />
                                <p onClick={Order}>Orders</p>
                            </li>
                            <hr />
                            <li>
                                <img src={logout} alt="" /><p onClick={Logout}>Logout</p>
                            </li>
                        </ul>
                    </div>

                    : <Link to='/login' className="btn"><button>Login</button></Link>}
                <Link to='/cart' className="btn"><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}
export default Navbar