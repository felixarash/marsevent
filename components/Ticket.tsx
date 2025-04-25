import React, { forwardRef } from 'react';
import QRCode from 'qrcode.react';

interface TicketProps {
  ticketData: {
    name: string;
    eventName: string;
    date: string;
    location: string;
    ticketId: string;
    // Add other ticket data properties as needed
  };
}

const Ticket = forwardRef<HTMLDivElement, TicketProps>(({ ticketData }, ref) => {
  const { name, eventName, date, location, ticketId } = ticketData;
  
  return (
    <div 
      ref={ref} 
      className="ticket-container bg-white rounded-lg overflow-visible shadow-lg p-4 sm:p-6 my-4 w-full"
    >
      <div className="ticket-header border-b pb-3 mb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-center break-words">{eventName}</h1>
        <p className="text-center text-gray-600 text-sm sm:text-base">{date}</p>
      </div>
      
      <div className="ticket-body grid grid-cols-1 gap-3 sm:gap-4">
        <div className="ticket-info">
          <p className="mb-1 sm:mb-2 text-sm sm:text-base"><span className="font-semibold">Name:</span> {name}</p>
          <p className="mb-1 sm:mb-2 text-sm sm:text-base"><span className="font-semibold">Location:</span> {location}</p>
          <p className="mb-1 sm:mb-2 text-sm sm:text-base"><span className="font-semibold">Ticket ID:</span> {ticketId}</p>
          {/* Add other ticket details here */}
        </div>
        
        <div className="qr-container flex justify-center items-center">
          <QRCode 
            value={ticketId} 
            size={80} 
            renderAs="svg"
            className="w-20 h-20 sm:w-24 sm:h-24" 
          />
        </div>
      </div>
      
      <div className="ticket-footer mt-3 pt-3 border-t text-center text-xs sm:text-sm text-gray-500">
        <p>This ticket is non-transferable.</p>
        <p>Please present this ticket at the entrance.</p>
      </div>
    </div>
  );
});

Ticket.displayName = 'Ticket';

export default Ticket;
