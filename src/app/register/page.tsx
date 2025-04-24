"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    planet: 'Earth',
    country: '',
    age: '',
    specialRequests: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      if (formErrors.photo) {
        setFormErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    
    if (!formData.country.trim()) errors.country = "Country/Colony is required";
    if (!formData.age.trim()) errors.age = "Age is required";
    else if (parseInt(formData.age) < 18) errors.age = "Must be at least 18 years old";
    
    if (!photo) errors.photo = "Photo is required for identification";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Generate unique ticket ID
      const ticketId = `MARS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      // In a real app you'd send this to a server
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call
      
      // Store in localStorage for the ticket page to access
      localStorage.setItem('ticketData', JSON.stringify({
        ...formData,
        ticketId,
        photoUrl: photoPreview
      }));
      
      router.push('/ticket');
    } catch (error) {
      console.error("Error generating ticket:", error);
      alert("There was an error generating your ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-300 relative overflow-x-hidden">
      {/* Space background with stars */}
      <div className="fixed inset-0 z-0">
        <div className="stars"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,150,255,0.1) 0%, transparent 50%)'
        }}></div>
        <div className="fixed inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          backgroundPosition: 'center center',
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 inline-block">
              Mars Event Registration
            </h1>
            <div className="mt-4 relative">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full mx-auto"></div>
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 bg-black px-4">
                <span className="text-cyan-400 text-sm tracking-widest">INTERPLANETARY TRAVEL BUREAU</span>
              </div>
            </div>
            <p className="mt-6 text-cyan-400 max-w-2xl mx-auto">
              Complete your registration for the Mars Colony Launch Party. This exclusive invitation grants you access to the most anticipated event in human history.
            </p>
          </div>
          
          {/* Registration form card */}
          <div className="bg-gray-900/60 backdrop-blur-md border border-cyan-800/50 rounded-xl shadow-2xl shadow-cyan-900/20 p-6 md:p-8 mb-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>
            <div className="absolute top-0 right-0 h-16 w-16 -mt-8 -mr-8 bg-cyan-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 -mb-16 -ml-16 bg-blue-500/10 rounded-full blur-xl"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-cyan-300 flex items-center">
                      <span className="inline-block mr-2 w-6 h-6 rounded-full bg-cyan-800/50 flex items-center justify-center text-sm border border-cyan-500/50">1</span>
                      Personal Information
                    </h2>
                    <div className="h-px bg-gradient-to-r from-cyan-800/50 to-transparent mt-2"></div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-cyan-300 text-sm font-medium mb-1">Full Name <span className="text-cyan-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full bg-slate-800/80 border ${formErrors.name ? 'border-red-500' : 'border-cyan-800/50'} rounded-md px-4 py-2.5 text-cyan-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-cyan-700/50`}
                          placeholder="Enter your full name"
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-cyan-300 text-sm font-medium mb-1">Email <span className="text-cyan-500">*</span></label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full bg-slate-800/80 border ${formErrors.email ? 'border-red-500' : 'border-cyan-800/50'} rounded-md px-4 py-2.5 text-cyan-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-cyan-700/50`}
                          placeholder="your.email@example.com"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Age Field */}
                    <div>
                      <label htmlFor="age" className="block text-cyan-300 text-sm font-medium mb-1">Age <span className="text-cyan-500">*</span></label>
                      <div className="relative">
                        <input
                          type="number"
                          id="age"
                          name="age"
                          min="18"
                          value={formData.age}
                          onChange={handleChange}
                          className={`w-full bg-slate-800/80 border ${formErrors.age ? 'border-red-500' : 'border-cyan-800/50'} rounded-md px-4 py-2.5 text-cyan-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-cyan-700/50`}
                          placeholder="Must be 18 or older"
                        />
                        {formErrors.age && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Origin Information */}
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-cyan-300 flex items-center">
                      <span className="inline-block mr-2 w-6 h-6 rounded-full bg-cyan-800/50 flex items-center justify-center text-sm border border-cyan-500/50">2</span>
                      Origin Details
                    </h2>
                    <div className="h-px bg-gradient-to-r from-cyan-800/50 to-transparent mt-2"></div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Planet Field */}
                    <div>
                      <label htmlFor="planet" className="block text-cyan-300 text-sm font-medium mb-1">Home Planet <span className="text-cyan-500">*</span></label>
                      <select
                        id="planet"
                        name="planet"
                        value={formData.planet}
                        onChange={handleChange}
                        className="w-full bg-slate-800/80 border border-cyan-800/50 rounded-md px-4 py-2.5 text-cyan-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2322d3ee' viewBox='0 0 24 24' stroke='%2322d3ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.5rem center',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="Earth">Earth</option>
                        <option value="Mars">Mars</option>
                        <option value="Moon Colony">Moon Colony</option>
                        <option value="Venus Orbital">Venus Orbital Station</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    {/* Country Field */}
                    <div>
                      <label htmlFor="country" className="block text-cyan-300 text-sm font-medium mb-1">Country/Colony <span className="text-cyan-500">*</span></label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full bg-slate-800/80 border ${formErrors.country ? 'border-red-500' : 'border-cyan-800/50'} rounded-md px-4 py-2.5 text-cyan-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-cyan-700/50`}
                        placeholder="Enter your country or colony name"
                      />
                      {formErrors.country && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                      )}
                    </div>
                    
                    {/* Special Requests */}
                    <div>
                      <label htmlFor="specialRequests" className="block text-cyan-300 text-sm font-medium mb-1">Special Requests</label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        rows={3}
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="w-full bg-slate-800/80 border border-cyan-800/50 rounded-md px-4 py-2.5 text-cyan-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-cyan-700/50"
                        placeholder="Any special accommodations or dietary requirements?"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Photo Upload Section */}
              <div className="mt-8 mb-8">
                <h2 className="text-xl font-semibold text-cyan-300 flex items-center">
                  <span className="inline-block mr-2 w-6 h-6 rounded-full bg-cyan-800/50 flex items-center justify-center text-sm border border-cyan-500/50">3</span>
                  Identification Photo
                </h2>
                <div className="h-px bg-gradient-to-r from-cyan-800/50 to-transparent mt-2 mb-6"></div>
                
                <div className={`border-2 ${formErrors.photo ? 'border-red-500' : 'border-cyan-800/30'} border-dashed rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 bg-slate-900/40`}>
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <div className="relative w-40 h-40">
                        <Image 
                          src={photoPreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg border-2 border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhoto(null);
                            setPhotoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-lg bg-slate-800/80 border-2 border-cyan-800/50 flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-cyan-500 text-sm mt-2">No photo selected</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-cyan-400 font-medium mb-2">Upload Your Photo</h3>
                    <p className="text-cyan-500/80 text-sm mb-4">This photo will be used for your official Mars Event identification badge. Please use a clear, front-facing image.</p>
                    
                    <div>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="photo"
                        className="inline-flex items-center px-4 py-2 bg-cyan-800/50 hover:bg-cyan-700/50 text-cyan-200 transition-colors cursor-pointer rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                        {photoPreview ? 'Change Photo' : 'Select Photo'}
                      </label>
                    </div>
                    
                    {formErrors.photo && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.photo}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="mb-8 bg-slate-900/40 p-4 rounded-lg border border-cyan-800/30">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="sci-fi-checkbox"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-cyan-400">
                      I acknowledge the risks associated with space travel and agree to the <a href="#" className="text-cyan-300 underline decoration-dotted hover:text-cyan-200 hover:decoration-solid transition-all">Terms of Service</a> and <a href="#" className="text-cyan-300 underline decoration-dotted hover:text-cyan-200 hover:decoration-solid transition-all">Mars Colony Protocols</a>
                    </label>
                  </div>
                </div>
              </div>
              

              <div className="flex justify-between mt-3">
                {/* Submit Button */}
                <div className="flex justify-center mt-10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative px-8 py-4 bg-gradient-to-r from-cyan-900/90 to-blue-900/90 hover:from-cyan-800 hover:to-blue-800 rounded-lg flex items-center justify-center min-w-[200px] transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-800/50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-cyan-200 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-cyan-100">Processing<span className="animate-pulse">...</span></span>
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center">
                          <span className="mr-1 text-cyan-100 font-medium tracking-wide">Submit Registration</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-cyan-300 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </>
                    )}
                    
                    {/* Sci-fi button corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400"></div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
