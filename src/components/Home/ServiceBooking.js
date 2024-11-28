// src/components/Home/ServiceBooking.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ServiceBooking = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [vehicleType, setVehicleType] = useState('');
    const [serviceTypes, setServiceTypes] = useState({
        maintenance: false,
        tyreWheel: false,
        battery: false,
        engine: false,
        exteriorInterior: false,
        glassMirror: false,
        lightsElectrical: false,
    });
    const [date, setDate] = useState('');
    const [cart, setCart] = useState([]);

    const services = [
        { id: 'maintenance', name: 'Maintenance Services', price: 100 },
        { id: 'tyreWheel', name: 'Tyre and Wheel Services', price: 80 },
        { id: 'battery', name: 'Battery Services', price: 60 },
        { id: 'engine', name: 'Engine Services', price: 150 },
        { id: 'exteriorInterior', name: 'Exterior and Interior Care', price: 90 },
        { id: 'glassMirror', name: 'Glass and Mirror Services', price: 70 },
        { id: 'lightsElectrical', name: 'Lights and Electrical System Services', price: 85 }
    ];

    const handleServiceChange = (e) => {
        const { name, checked } = e.target;
        setServiceTypes({ ...serviceTypes, [name]: checked });

        if (checked) {
            const serviceToAdd = services.find(service => service.id === name);
            setCart([...cart, serviceToAdd]);
        } else {
            const updatedCart = cart.filter(service => service.id !== name);
            setCart(updatedCart);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, service) => total + service.price, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vehicleType || cart.length === 0 || !date) {
            alert('Please fill all fields and add at least one service.');
            return;
        }

        const booking = {
            userId: user.id,
            vehicleType,
            services: cart,
            date,
            total: calculateTotal(),
            status: 'Pending'
        };

        try {
            await axios.post('http://localhost:5000/bookings', booking);
            alert('Booking successful!');
            navigate('/cart');
        } catch (error) {
            console.error(error);
            alert('An error occurred while booking.');
        }
    };

    return (
        <div>
            <h2 className="heading">Book a Service</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Vehicle Type:</label>
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
                        <option value="">Select Vehicle Type</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Truck">Truck</option>
                        <option value="SUV">SUV</option>
                    </select>
                </div>
                <div>
                    <label>Service Types:</label>
                    <div className="service-container"> {/* Added container for services */}
                        {services.map(service => (
                            <div key={service.id} className="service-row">
                                <div className="service-name">
                                    <input
                                        type="checkbox"
                                        name={service.id}
                                        checked={serviceTypes[service.id]}
                                        onChange={handleServiceChange}
                                    />
                                    {service.name} (${service.price})
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                    <h3>Total: ${calculateTotal()}</h3>
                </div>
                <button type="submit">Add to Cart</button>
            </form>
        </div>
    );
};

export default ServiceBooking;
