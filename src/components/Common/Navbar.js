import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                {user ? (
                    <>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/booking">Book Service</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/orders">My Orders</Link></li> {/* Link to Orders */}
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
