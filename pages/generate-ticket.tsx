import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Ticket from '../components/Ticket';
import Head from 'next/head';

export default function GenerateTicket() {
  const [ticketData, setTicketData] = useState({
    name: 'John Doe',
    eventName: 'Annual Conference 2024',
    date: 'June 15, 2024',
    location: 'Convention Center, New York',
    ticketId: 'TKT-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  });
  
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isSmallScreen: false
  });
  const ticketRef = useRef<HTMLDivElement>(null);

  // Enhanced screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isSmallScreen: width <= 375
      });
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    
    // Add class for better PDF capture
    if (ticketRef.current) {
      ticketRef.current.classList.add('pdf-ready');
    }

    try {
      // First ensure ticket container is fully visible
      if (ticketRef.current.scrollIntoView) {
        ticketRef.current.scrollIntoView({behavior: 'auto', block: 'nearest'});
      }
      
      // Add a short delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Determine optimal scale based on device width
      let optimalScale = 2;
      if (screenSize.isSmallScreen) {
        optimalScale = 3;
      } else if (screenSize.width <= 480) {
        optimalScale = 2.5;
      }
      
      // Enhanced options for better capture across all devices
      interface Html2CanvasOptions {
        scale: number;
        useCORS: boolean;
        allowTaint: boolean;
        logging: boolean;
        scrollX: number;
        scrollY: number;
        width: number;
        height: number;
        windowWidth: number;
        windowHeight: number;
        onclone: (clonedDoc: Document) => void;
      }

      const options: Html2CanvasOptions = {
        scale: optimalScale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        width: ticketRef.current.offsetWidth,
        height: ticketRef.current.offsetHeight,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        onclone: (clonedDoc: Document) => {
          // Make sure the cloned element has proper dimensions and styles
          const clonedEl = clonedDoc.querySelector('.pdf-ready') as HTMLElement | null;
          if (clonedEl && ticketRef.current) {
        clonedEl.style.width = ticketRef.current.offsetWidth + 'px';
        clonedEl.style.height = ticketRef.current.offsetHeight + 'px';
          }
        }
      };
      
      const canvas = await html2canvas(ticketRef.current, options);
      
      // Calculate PDF dimensions with proper aspect ratio
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Determine optimal PDF size based on screen
      let pdfWidth = 210; // A4 width in mm (portrait)
      let verticalMargin = 10; // Default top margin in mm
      
      // Adjust for different screen sizes
      if (screenSize.isSmallScreen) {
        pdfWidth = 190; // Slightly narrower for very small screens
        verticalMargin = 15; // More margin for small screens
      } else if (screenSize.isMobile) {
        pdfWidth = 200;
        verticalMargin = 12;
      }
      
      const aspectRatio = canvas.height / canvas.width;
      const pdfHeight = pdfWidth * aspectRatio;
      
      // Create PDF with appropriate dimensions
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate centering on page
      const xOffset = (210 - pdfWidth) / 2;
      
      // Add image to PDF with proper scaling and centered
      pdf.addImage(
        imgData, 
        'PNG', 
        xOffset, 
        verticalMargin, 
        pdfWidth, 
        Math.min(pdfHeight, 277 - (2 * verticalMargin)) // Leave margins
      );
      
      // Download the PDF
      pdf.save(`ticket_${ticketData.ticketId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      // Remove temporary class
      if (ticketRef.current) {
        ticketRef.current.classList.remove('pdf-ready');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Generate Ticket</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Your Ticket</h1>
        
        <div className="w-full max-w-md mx-auto">
          <div className="ticket-container overflow-hidden">
            <Ticket ref={ticketRef} ticketData={ticketData} />
          </div>
          
          <div className="flex justify-center mt-4 sm:mt-8">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 sm:px-6 rounded-md transition-colors text-sm sm:text-base"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
