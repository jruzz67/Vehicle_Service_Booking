// src/components/Cart/Cart.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.id) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/bookings`, {
                    params: {
                        userId: user.id,
                        status: 'Pending'
                    }
                });
                console.log('Fetched Bookings:', response.data); // Debugging
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleCheckout = async (bookingId) => {
        // Simulate payment
        const confirmPayment = window.confirm('Proceed to payment?');
        if (confirmPayment) {
            try {
                await axios.patch(`http://localhost:5000/bookings/${bookingId}`, { status: 'Completed' });
                alert('Payment successful!');
                // Update the bookings state
                setBookings((prevBookings) => prevBookings.filter(booking => booking.id !== bookingId));
                navigate('/');
            } catch (err) {
                console.error('Payment error:', err);
                alert('Payment failed.');
            }
        }
    };

    if (loading) {
        return <p>Loading cart...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2 className="heading">Your Cart</h2>
            {bookings.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                bookings.map(booking => (
                    <div key={booking.id} className="service">
                        <p><strong>Vehicle Type:</strong> {booking.vehicleType}</p>
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Total Bill:</strong> ${booking.total}</p>
                        <button onClick={() => handleCheckout(booking.id)}>Checkout</button>
                    </div>
                ))
            )}
            {bookings.length === 0 && (
                <button onClick={() => navigate('/')}>Go to Services</button>
            )}
        </div>
    );
};

export default Cart;
