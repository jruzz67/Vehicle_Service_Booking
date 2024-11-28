// src/components/Profile/Profile.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [form, setForm] = useState({
        name: user.name,
        phone: user.phone,
        email: user.email,
    });
    const [message, setMessage] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleEmailEdit = () => {
        setIsEditingEmail(true);
    };

    const handleEmailCancel = () => {
        setIsEditingEmail(false);
        setForm({ ...form, email: user.email });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // Check if email is being updated and ensure it's unique
            if (form.email !== user.email) {
                const emailCheck = await axios.get(`http://localhost:5000/users?email=${form.email}`);
                if (emailCheck.data.length > 0) {
                    toast.error('Email already exists');
                    return;
                }
            }

            const res = await axios.put(`http://localhost:5000/users/${user.id}`, form);
            setMessage('Profile updated successfully.');
            setUser(res.data); // Update user in context
            localStorage.setItem('user', JSON.stringify(res.data));
            toast.success('Profile updated successfully.');
            setIsEditingEmail(false);
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
            toast.error('Failed to update profile.');
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <h2 className="heading">Profile</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        value={form.phone} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter your phone number"
                    />
                </div>
                <div>
                    <label>Email:</label>
                    {isEditingEmail ? (
                        <>
                            <input 
                                type="email" 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter your email"
                            />
                            <button type="button" onClick={handleEmailCancel}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <input 
                                type="email" 
                                name="email" 
                                value={form.email} 
                                readOnly 
                                style={{ backgroundColor: '#f0f0f0' }} // Visual cue for read-only
                            />
                            <button type="button" onClick={handleEmailEdit}>Edit Email</button>
                        </>
                    )}
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
                Logout
            </button>
        </div>
    );
};

export default Profile;
