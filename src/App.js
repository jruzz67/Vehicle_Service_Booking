import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Home/Home';
import ServiceBooking from './components/Home/ServiceBooking';
import Cart from './components/Cart/Cart';
import Profile from './components/Profile/Profile';
import Orders from './components/Home/Orders'; // Import Orders component
import ProtectedRoute from './components/Common/ProtectedRoute';
import './styles.css';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/booking"
                        element={
                            <ProtectedRoute>
                                <ServiceBooking />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders /> {/* New route for Orders */}
                            </ProtectedRoute>
                        }
                    />
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;
