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
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, // Increased for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#000000',
        allowTaint: true,
        windowWidth: ticketRef.current.scrollWidth,
        windowHeight: ticketRef.current.scrollHeight
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate optimal dimensions
      const margin = 10;
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);
      const aspectRatio = canvas.width / canvas.height;

      let imgWidth = maxWidth;
      let imgHeight = imgWidth / aspectRatio;

      // Adjust if height exceeds page
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * aspectRatio;
      }

      // Center the image
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      // Add the ticket image
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        x, y,
        imgWidth, imgHeight,
        undefined,
        'MEDIUM'
      );

      // Add signature section with better positioning
      const signatureY = y + imgHeight - 20;

      // Add decorative line
      pdf.setDrawColor(6, 182, 212);
      pdf.setLineWidth(0.5);
      pdf.line(x + imgWidth - 80, signatureY, x + imgWidth - 10, signatureY);

      // Add CEO signature with improved font settings
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(11);
      pdf.setTextColor(6, 182, 212);
      pdf.text("Fozan Ahmed", x + imgWidth - 70, signatureY - 4, {
        align: 'left',
        baseline: 'bottom'
      });

      // Add CEO title with better spacing
      pdf.setFontSize(8);
      pdf.text("CEO, Felix Space Events", x + imgWidth - 70, signatureY + 3, {
        align: 'left',
        baseline: 'top'
      });

      // Add ticket details with improved positioning
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      
      const ticketInfo = `Ticket #${ticketData?.ticketId || "N/A"} | Generated on ${new Date().toLocaleDateString()}`;
      pdf.text(
        ticketInfo,
        x + 10,
        pageHeight - margin,
        {
          align: 'left',
          baseline: 'bottom'
        }
      );

      // Add Felix Space Events branding
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(6, 182, 212);
      pdf.text(
        "Felix Space Events | Since 5000 BC",
        pageWidth - margin,
        pageHeight - margin,
        {
          align: 'right',
          baseline: 'bottom'
        }
      );

      pdf.save(`Felix_Space_Event_Ticket_${ticketData?.ticketId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-center">
          <div className="w-16 h-16 border-t-2 border-r-2 border-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Preparing your Mars journey ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No ticket data found. Please complete registration.</p>
          <Link 
            href="/register"
            className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md shadow-lg"
          >
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="stars"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300">Your Mars Event Ticket</h1>
          <p className="text-cyan-400 mt-2">Your interplanetary journey is confirmed!</p>
        </div>
        
        {/* Ticket Preview */}
        <div ref={ticketRef} className="ticket-container bg-gradient-to-r from-slate-900 to-cyan-900 aspect-[2/1] rounded-xl overflow-hidden border-2 border-cyan-500 shadow-xl shadow-cyan-500/30 relative mb-8">
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
            <div className="col-span-4 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-white">MARS COLONY</h2>
                    <p className="text-xs md:text-sm text-cyan-300">LAUNCH PARTY</p>
                  </div>
                  <div className="bg-cyan-900/50 border border-cyan-500 rounded px-3 py-1 text-xs md:text-sm text-cyan-300">
                    VIP ACCESS
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-cyan-400">PASSENGER NAME</p>
                    <p className="text-white font-semibold">{ticketData.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-cyan-400">ORIGIN</p>
                      <p className="text-white">{ticketData.planet}, {ticketData.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400">DESTINATION</p>
                      <p className="text-white">Mars, Olympus Mons Base</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-cyan-400">DATE</p>
                      <p className="text-white">June 15, 2045</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400">DEPARTURE TIME</p>
                      <p className="text-white">08:00 MST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <div className="h-1 flex-grow bg-cyan-500/30">
                    <div className="h-full w-1/2 bg-cyan-400"></div>
                  </div>
                  <div className="mx-2 text-xs text-cyan-300">TICKET ID</div>
                  <div className="h-1 flex-grow bg-cyan-500/30">
                    <div className="h-full w-1/2 bg-cyan-400"></div>
                  </div>
                </div>
                <p className="text-center text-cyan-300 font-mono text-sm mt-1">{ticketData.ticketId}</p>
              </div>
            </div>
            
            {/* Right side - Photo and QR Code */}
            <div className="col-span-3 bg-slate-900/70 backdrop-blur-sm border-l border-cyan-500/50 flex flex-col items-center justify-between p-5">
              {/* Passenger Photo */}
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-cyan-400 mb-4">
                {ticketData.photoUrl ? (
                  <div className="relative w-32 h-32">
                    <Image 
                      src={ticketData.photoUrl}
                      alt="Passenger"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cyan-900/20">
                    <span className="text-5xl text-cyan-500/70">👤</span>
                  </div>
                )}
              </div>
              
              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white p-2 rounded-md mb-2">
                  <QRCode 
                    value={`MARS-EVENT-${ticketData.ticketId}`} 
                    size={80}
                    level="H"
                    renderAs="svg"
                  />
                </div>
                <p className="text-xs text-cyan-300">Scan for check-in</p>
              </div>
              
              <div className="text-center mt-3">
                <p className="text-xs text-cyan-400 font-light">Space Transport Authority</p>
                <p className="text-xs text-cyan-300 font-semibold">INTERPLANETARY TRAVEL PERMIT</p>
                <div className="mt-4 border-t border-cyan-500/30 pt-2">
                  <p className="text-xs text-cyan-400 italic">Authorized by</p>
                  <p className="text-sm text-cyan-300 font-semibold">Fozan Ahmed</p>
                  <p className="text-xs text-cyan-400">CEO, Felix Space Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={downloadPDF}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-md shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Ticket PDF
          </button>
          
          <Link href="/"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium rounded-md shadow-lg border border-cyan-500/30 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </Link>
        </div>
        
        <div className="text-cyan-500/70 text-center text-sm">
          <p>Please keep your ticket safe. It will be required for boarding the Mars transport shuttle.</p>
        </div>
      </div>
    </div>
  );
}
