"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import Image from 'next/image';

interface TicketData {
  name: string;
  email: string;
  planet: string;
  country: string;
  age: string;
  specialRequests: string;
  ticketId: string;
  photoUrl: string | null;
}

export default function TicketPage() {
  const router = useRouter();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // Track window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Retrieve ticket data from localStorage
    const storedData = localStorage.getItem('ticketData');
    
    if (!storedData) {
      router.push('/register');
      return;
    }
    
    try {
      setTicketData(JSON.parse(storedData));
    } catch (e) {
      console.error("Error parsing ticket data:", e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    
    try {
      setLoading(true);
      
      // Add PDF preparation class
      ticketRef.current.classList.add('pdf-ready');
      
      // Higher quality settings
      const scale = window.devicePixelRatio * (windowWidth <= 768 ? 3 : 4);
      
      const canvas = await html2canvas(ticketRef.current, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#000000',
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: true,
        windowWidth: ticketRef.current.scrollWidth * 1.25,
        windowHeight: ticketRef.current.scrollHeight * 1.25
      });

      // Use high-quality ID card dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
        compress: false,
        hotfixes: ['px_scaling']
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Optimize image quality
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0, 0,
        pageWidth, pageHeight,
        undefined,
        'FAST',
        0
      );

      pdf.save(`Felix_Space_Event_Ticket_${ticketData?.ticketId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Remove PDF preparation class
      if (ticketRef.current) {
        ticketRef.current.classList.remove('pdf-ready');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-cyan-400 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-r-2 border-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl">Preparing your Mars journey ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-md">
          <p className="text-lg sm:text-xl mb-4">No ticket data found. Please complete registration.</p>
          <Link 
            href="/register"
            className="px-4 sm:px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md shadow-lg inline-block"
          >
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 sm:py-12 px-3 sm:px-4">
      <div className="fixed inset-0 z-0">
        <div className="stars"></div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300">Your Mars Event Ticket</h1>
          <p className="text-cyan-400 mt-2 text-sm sm:text-base">Your interplanetary journey is confirmed!</p>
        </div>
        
        {/* ID Card style ticket */}
        <div ref={ticketRef} className="ticket-card bg-gradient-to-r from-slate-900 to-cyan-900 rounded-lg sm:rounded-xl overflow-hidden border border-cyan-500 sm:border-2 shadow-lg sm:shadow-xl shadow-cyan-500/30 relative mb-6 sm:mb-8">
          {/* Holographic effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 mix-blend-overlay pointer-events-none"></div>
          
          {/* Grid lines overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)',
                 backgroundSize: '20px 20px',
               }}></div>
               
          {/* Left side - Event details */}
          <div className="grid grid-cols-7 h-full">
            <div className="col-span-4 p-3 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg md:text-2xl font-bold text-white">MARS COLONY</h2>
                    <p className="text-xs md:text-sm text-cyan-300">LAUNCH PARTY</p>
                  </div>
                  <div className="bg-cyan-900/50 border border-cyan-500 rounded px-2 sm:px-3 py-0.5 sm:py-1 text-xs md:text-sm text-cyan-300">
                    VIP ACCESS
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div>
                    <p className="text-xs text-cyan-400">PASSENGER NAME</p>
                    <p className="text-white font-semibold text-xs sm:text-sm">{ticketData.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs text-cyan-400">ORIGIN</p>
                      <p className="text-white text-xs sm:text-sm">{ticketData.planet}, {ticketData.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400">DESTINATION</p>
                      <p className="text-white text-xs sm:text-sm">Mars, Olympus Mons Base</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs text-cyan-400">DATE</p>
                      <p className="text-white text-xs sm:text-sm">June 15, 2045</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400">DEPARTURE TIME</p>
                      <p className="text-white text-xs sm:text-sm">08:00 MST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <div className="h-0.5 sm:h-1 flex-grow bg-cyan-500/30">
                    <div className="h-full w-1/2 bg-cyan-400"></div>
                  </div>
                  <div className="mx-1 sm:mx-2 text-xs text-cyan-300">TICKET ID</div>
                  <div className="h-0.5 sm:h-1 flex-grow bg-cyan-500/30">
                    <div className="h-full w-1/2 bg-cyan-400"></div>
                  </div>
                </div>
                <p className="text-center text-cyan-300 font-mono text-xs sm:text-sm mt-1">{ticketData.ticketId}</p>
              </div>
            </div>
            
            {/* Right side - Photo and QR Code */}
            <div className="col-span-3 bg-slate-900/70 backdrop-blur-sm border-l border-cyan-500/50 flex flex-col items-center justify-between p-2 sm:p-5">
              {/* Passenger Photo */}
              <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-cyan-400 sm:border-2 mb-2 sm:mb-4">
                {ticketData.photoUrl ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={ticketData.photoUrl}
                      alt="Passenger"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cyan-900/20">
                    <span className="text-3xl sm:text-5xl text-cyan-500/70">👤</span>
                  </div>
                )}
              </div>
              
              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white p-1 sm:p-2 rounded-md mb-1 sm:mb-2">
                  <QRCode 
                    value={`MARS-EVENT-${ticketData.ticketId}`} 
                    size={windowWidth <= 640 ? 50 : windowWidth <= 768 ? 65 : 80}
                    level="H"
                    renderAs="svg"
                  />
                </div>
                <p className="text-xs text-cyan-300">Scan for check-in</p>
              </div>
              
              <div className="text-center mt-2 sm:mt-3">
                <p className="text-xs text-cyan-400 font-light">Space Transport Authority</p>
                <p className="text-xs text-cyan-300 font-semibold">INTERPLANETARY TRAVEL PERMIT</p>
                <div className="mt-2 sm:mt-4 border-t border-cyan-500/30 pt-1 sm:pt-2">
                  <p className="text-xs text-cyan-400 italic">Authorized by</p>
                  <p className="text-xs sm:text-sm text-cyan-300 font-semibold">Fozan Ahmed</p>
                  <p className="text-xs text-cyan-400">CEO, Felix Space Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons - Make more responsive */}
        <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <button
            onClick={downloadPDF}
            disabled={loading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-md shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Ticket PDF
          </button>
          
          <Link href="/"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium rounded-md shadow-lg border border-cyan-500/30 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </Link>
        </div>
        
        <div className="text-cyan-500/70 text-center text-xs sm:text-sm">
          <p>Please keep your ticket safe. It will be required for boarding the Mars transport shuttle.</p>
        </div>
      </div>
    </div>
  );
}
