// src/components/Orders/MyOrders.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/bookings`, {
                    params: {
                        userId: user.id,
                        status: 'Completed' // Fetch only completed orders
                    }
                });
                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
        if (confirmCancel) {
            try {
                await axios.delete(`http://localhost:5000/bookings/${orderId}`);
                setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
                alert('The amount will be refunded shortly.');
            } catch (err) {
                console.error('Error canceling order:', err);
                alert('Failed to cancel order.');
            }
        }
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2 className="heading">Your Orders</h2>
            {orders.length === 0 ? (
                <p>No completed orders found.</p>
            ) : (
                <div className="orders-container">
                    {orders.map(order => (
                        <div key={order.id} className="order" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '200px', borderRadius: '5px', display: 'inline-block' }}>
                            <p><strong>Vehicle Type:</strong> {order.vehicleType}</p>
                            <p><strong>Total Bill:</strong> ${order.total}</p>
                            <p><strong>Date:</strong> {order.date}</p>
                            <button onClick={() => handleCancelOrder(order.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}>Cancel Booking</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
