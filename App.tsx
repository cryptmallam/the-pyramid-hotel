
import React, { useState, useEffect, useRef } from 'react';
import { HOTEL_DETAILS, AMENITIES, ROOMS, FACILITIES, REVIEWS, UNAVAILABLE_DATES } from './constants';
import { RoomType } from './types';
import { 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  ChevronRight, 
  Star, 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail,
  Menu,
  X,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Welcome to The Pyramid Hotels! How can I assist you with your stay today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const initChat = () => {
    if (!chatInstance.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        You are the official digital concierge for "The Pyramid Hotels" in Kaduna, Nigeria. 
        Your goal is to provide helpful, professional, and accurate information to potential guests.
        
        Hotel Details:
        - Address: 13 Lafia Road, City Centre, Kaduna 800283, Kaduna, Nigeria.
        - Phone: 0803 465 7770.
        - Rating: 4-star (3.9 stars from 2,149 reviews).
        - Check-out time: 12:00 PM.
        - Room Prices: Starting from ₦50,000 per night.
        - Room Types: Standard (₦50k), Deluxe (₦75k), Executive Suite (₦120k).
        
        Amenities: 
        Free Wi-Fi, Free Breakfast, Free Parking, Outdoor Swimming Pool, AC Rooms, Laundry Service, Conference & Event Facilities.
        
        Nearby Locations:
        - Kaduna Golf Club (6 min walk)
        - Murtala Square Stadium (12 min walk)
        - Kaduna International Airport (31 km)
        
        Guidelines:
        - Be warm and hospitable. 
        - If someone asks to book, guide them to the "Book Now" buttons on the site or ask for their check-in dates.
        - Keep responses concise and focused on the hotel.
        - Do not invent services not listed.
      `;

      chatInstance.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemInstruction,
        },
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      initChat();
      const response = await chatInstance.current!.sendMessage({ message: userMsg });
      const modelText = response.text || "I'm sorry, I couldn't process that. Please try again or call us directly.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Our concierge service is currently offline. Please call us at 0803 465 7770 for assistance." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] max-w-[90vw] h-[500px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-deep-blue p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold text-xs">PH</div>
              <div>
                <h3 className="text-white font-bold text-sm">Concierge</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-gold text-white rounded-br-none shadow-sm' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-400 p-3 rounded-lg border border-slate-200 rounded-bl-none shadow-sm italic text-xs flex items-center">
                  <Loader2 className="w-3 h-3 animate-spin mr-2" />
                  Typing...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-gold outline-none"
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="bg-deep-blue text-white p-2 rounded-full hover:bg-gold transition-colors disabled:opacity-50">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-gold text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 relative group">
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-deep-blue text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with Concierge
          </span>
        )}
      </button>
    </div>
  );
};

interface BookingFormProps {
  room: RoomType | null;
  onClose: () => void;
}

const BookingModal: React.FC<BookingFormProps> = ({ room, onClose }) => {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1',
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'unknown' | 'available' | 'booked'>('unknown');

  if (!room) return null;

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      checkAvailability();
    } else {
      setAvailabilityStatus('unknown');
    }
  }, [formData.checkIn, formData.checkOut]);

  const checkAvailability = async () => {
    setIsChecking(true);
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const unavailableRanges = UNAVAILABLE_DATES[room.id] || [];
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    const isBooked = unavailableRanges.some(range => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      // Check if any part of the requested stay overlaps with the unavailable range
      return (checkInDate < end && checkOutDate > start);
    });

    setAvailabilityStatus(isBooked ? 'booked' : 'available');
    setIsChecking(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.checkIn) newErrors.checkIn = "Check-in date is required";
    else if (formData.checkIn < today) newErrors.checkIn = "Date cannot be in the past";

    if (!formData.checkOut) newErrors.checkOut = "Check-out date is required";
    else if (formData.checkOut <= formData.checkIn) newErrors.checkOut = "Must be after check-in";

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (availabilityStatus === 'booked') {
        alert("Sorry, this room is already booked for the selected dates.");
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-deep-blue p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-serif">Reserve {room.name}</h2>
            <p className="text-xs text-white/60 tracking-widest uppercase mt-1">Starting from ₦{room.price.toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="hover:text-gold transition-colors"><X size={24} /></button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-bold text-deep-blue mb-2">Booking Confirmed!</h3>
            <p className="text-slate-600">Thank you, {formData.name}. We've sent the details to {formData.email}. We look forward to seeing you at The Pyramid Hotels!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Check-In</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={16} />
                  <input 
                    type="date" 
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-sm focus:outline-none focus:border-gold text-sm ${errors.checkIn ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                </div>
                {errors.checkIn && <p className="text-[10px] text-red-500 font-bold flex items-center"><AlertCircle size={10} className="mr-1" /> {errors.checkIn}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Check-Out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={16} />
                  <input 
                    type="date" 
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-sm focus:outline-none focus:border-gold text-sm ${errors.checkOut ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                </div>
                {errors.checkOut && <p className="text-[10px] text-red-500 font-bold flex items-center"><AlertCircle size={10} className="mr-1" /> {errors.checkOut}</p>}
              </div>
            </div>

            {/* Availability Indicator */}
            <div className="py-2">
              {isChecking ? (
                <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-100 p-2 rounded">
                  <Loader2 className="w-3 h-3 animate-spin mr-2" />
                  Checking real-time availability...
                </div>
              ) : availabilityStatus === 'available' ? (
                <div className="flex items-center text-xs text-green-600 font-bold bg-green-50 p-2 border border-green-100 rounded">
                  <CheckCircle2 size={14} className="mr-2" />
                  Room is available for your dates!
                </div>
              ) : availabilityStatus === 'booked' ? (
                <div className="flex items-center text-xs text-red-600 font-bold bg-red-50 p-2 border border-red-100 rounded">
                  <AlertCircle size={14} className="mr-2" />
                  Sold Out: These dates are already booked.
                </div>
              ) : (
                <div className="flex items-center text-[10px] text-slate-400 font-medium">
                  <Info size={12} className="mr-1" />
                  Select dates to verify availability.
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Guests</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={16} />
                <select 
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-sm focus:outline-none focus:border-gold text-sm appearance-none bg-white"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Alhaji Musa"
                className={`w-full px-4 py-2.5 border rounded-sm focus:outline-none focus:border-gold text-sm ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              />
              {errors.name && <p className="text-[10px] text-red-500 font-bold flex items-center"><AlertCircle size={10} className="mr-1" /> {errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className={`w-full px-4 py-2.5 border rounded-sm focus:outline-none focus:border-gold text-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              />
              {errors.email && <p className="text-[10px] text-red-500 font-bold flex items-center"><AlertCircle size={10} className="mr-1" /> {errors.email}</p>}
            </div>

            <button 
              type="submit" 
              disabled={availabilityStatus === 'booked' || isChecking}
              className={`w-full py-4 rounded-sm font-bold uppercase tracking-widest transition-all mt-4 ${
                availabilityStatus === 'booked' || isChecking 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-gold hover:bg-opacity-90 text-white'
              }`}
            >
              {availabilityStatus === 'booked' ? 'Unavailable' : 'Confirm Reservation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  
  // Quick Booking Bar State
  const [quickBooking, setQuickBooking] = useState({ checkIn: '', checkOut: '', guests: '1 Adult' });
  const [quickErrors, setQuickErrors] = useState<Record<string, boolean>>({});
  const [isQuickChecking, setIsQuickChecking] = useState(false);
  const [quickStatus, setQuickStatus] = useState<{msg: string, type: 'success' | 'error' | ''}>({msg: '', type: ''});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickCheck = async () => {
    const errors: Record<string, boolean> = {};
    const today = new Date().toISOString().split('T')[0];
    
    if (!quickBooking.checkIn || quickBooking.checkIn < today) errors.checkIn = true;
    if (!quickBooking.checkOut || quickBooking.checkOut <= quickBooking.checkIn) errors.checkOut = true;
    
    setQuickErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsQuickChecking(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const checkInDate = new Date(quickBooking.checkIn);
      const checkOutDate = new Date(quickBooking.checkOut);

      // Check if at least one room type has availability
      const anyAvailable = ROOMS.some(room => {
        const ranges = UNAVAILABLE_DATES[room.id] || [];
        return !ranges.some(range => {
          const start = new Date(range.start);
          const end = new Date(range.end);
          return (checkInDate < end && checkOutDate > start);
        });
      });

      if (anyAvailable) {
        setQuickStatus({ msg: "Rooms are available! View categories below.", type: 'success' });
        setTimeout(() => {
          document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
          setQuickStatus({msg: '', type: ''});
        }, 1500);
      } else {
        setQuickStatus({ msg: "No rooms available for these dates.", type: 'error' });
      }
      setIsQuickChecking(false);
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Location', href: '#location' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="relative min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <span className={`text-2xl font-serif font-bold tracking-wider ${scrolled ? 'text-deep-blue' : 'text-white'}`}>
                THE PYRAMID <span className="text-gold">HOTELS</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold ${scrolled ? 'text-slate-700' : 'text-white'}`}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#rooms" 
                className="bg-gold hover:bg-opacity-90 text-white px-6 py-2.5 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all"
              >
                Book Now
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={scrolled ? 'text-slate-900' : 'text-white'}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 flex flex-col items-center space-y-4 animate-in slide-in-from-top">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-slate-800 text-lg font-medium hover:text-gold">{link.name}</a>
            ))}
            <a href="#rooms" onClick={() => setIsMenuOpen(false)} className="bg-gold text-white px-8 py-3 rounded-sm font-bold uppercase">Book Now</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Hotel Exterior"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-gold mb-4">
            <Star className="fill-gold" size={16} /><Star className="fill-gold" size={16} /><Star className="fill-gold" size={16} /><Star className="fill-gold" size={16} />
            <span className="text-white/80 text-sm ml-2 font-medium tracking-[0.2em] uppercase">Four-Star Luxury</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Experience Comfort & Luxury <br />
            <span className="text-gold italic font-normal">in the Heart of Kaduna</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover a world where hospitality meets elegance. Your premier destination for business and leisure stays in the City Centre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#rooms" className="bg-gold hover:bg-opacity-90 text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all">Explore Rooms</a>
            <a href="#contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all">Contact Us</a>
          </div>
        </div>

        {/* Quick Booking Bar */}
        <div className="absolute bottom-0 w-full z-20 hidden lg:block">
          <div className="max-w-6xl mx-auto bg-white shadow-2xl p-6 rounded-t-lg border-b-4 border-gold">
            <div className="flex items-end gap-6 px-6 pt-6 pb-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Check-In Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input 
                    type="date" 
                    value={quickBooking.checkIn}
                    onChange={(e) => setQuickBooking({...quickBooking, checkIn: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 border rounded-sm focus:outline-none focus:border-gold ${quickErrors.checkIn ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} 
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Check-Out Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input 
                    type="date" 
                    value={quickBooking.checkOut}
                    onChange={(e) => setQuickBooking({...quickBooking, checkOut: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 border rounded-sm focus:outline-none focus:border-gold ${quickErrors.checkOut ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} 
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Guests</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <select 
                    value={quickBooking.guests}
                    onChange={(e) => setQuickBooking({...quickBooking, guests: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-sm focus:outline-none focus:border-gold appearance-none bg-white"
                  >
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>Family (2+2)</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleQuickCheck}
                disabled={isQuickChecking}
                className="bg-deep-blue text-white px-8 py-3.5 rounded-sm font-bold uppercase tracking-widest hover:bg-opacity-95 transition-all flex items-center justify-center min-w-[200px]"
              >
                {isQuickChecking ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                {isQuickChecking ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
            {quickStatus.msg && (
              <div className={`px-6 pb-4 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${quickStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {quickStatus.msg}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" alt="Hotel Lounge" className="rounded-sm shadow-2xl relative z-10" />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gold/10 -z-0"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] border border-gold/20 -z-0"></div>
            </div>
            <div className="space-y-6">
              <span className="text-gold font-bold tracking-[0.3em] uppercase block">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-bold text-deep-blue leading-tight">Welcome to The Pyramid Hotels</h2>
              <p className="text-slate-600 text-lg leading-relaxed">Set on beautiful tree-lined grounds in a largely residential area, The Pyramid Hotels offers unparalleled comfort and convenience in the heart of Kaduna. We provide a relaxing environment tailored for business travelers, tourists, and conference guests alike.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-full text-gold"><MapPin size={20} /></div>
                  <div><h4 className="font-bold text-deep-blue">Prime Location</h4><p className="text-sm text-slate-500">6 min walk to Kaduna Golf Club & 12 min to Stadium.</p></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-full text-gold"><Star size={20} /></div>
                  <div><h4 className="font-bold text-deep-blue">4-Star Excellence</h4><p className="text-sm text-slate-500">Rated 3.9/5 stars by over 2,100 valued guests.</p></div>
                </div>
              </div>
              <button className="inline-flex items-center text-deep-blue font-bold uppercase tracking-widest group pt-4">Learn More <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold font-bold tracking-[0.3em] uppercase mb-4 block">First Class Services</span>
          <h2 className="text-4xl font-bold text-deep-blue mb-16">Hotel Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {AMENITIES.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-all group">
                <div className="text-gold mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="font-medium text-slate-800">{item.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-gold font-bold tracking-[0.3em] uppercase mb-4 block">Accommodations</span>
              <h2 className="text-4xl md:text-5xl font-bold text-deep-blue">Luxurious Rooms & Suites</h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-slate-500 font-medium">Starting from <span className="text-2xl text-gold font-bold">₦50,000</span> / night</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {ROOMS.map((room) => (
              <div key={room.id} className="bg-white group overflow-hidden shadow-lg border border-slate-100 flex flex-col">
                <div className="relative h-72 overflow-hidden">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 font-bold text-deep-blue text-sm">₦{room.price.toLocaleString()} / Night</div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-deep-blue mb-3">{room.name}</h3>
                  <p className="text-slate-600 mb-6 flex-grow">{room.description}</p>
                  <div className="space-y-3 mb-8">
                    {room.amenities.map((amn, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-500">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full mr-3"></div>{amn}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setSelectedRoom(room)}
                    className="w-full py-3 border-2 border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white font-bold uppercase tracking-widest transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-24 bg-deep-blue text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-gold font-bold tracking-[0.3em] uppercase mb-4 block">World Class Facilities</span>
            <h2 className="text-4xl md:text-5xl font-bold">Elevate Your Experience</h2>
          </div>
          <div className="space-y-24">
            {FACILITIES.map((facility, idx) => (
              <div key={facility.id} className={`flex flex-col lg:flex-row items-center gap-16 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="relative">
                    <img src={facility.image} alt={facility.name} className="rounded-sm shadow-2xl brightness-90" />
                    <div className="absolute -inset-4 border border-gold/30 -z-10 rounded-sm"></div>
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-bold text-gold">{facility.name}</h3>
                  <p className="text-lg text-white/70 leading-relaxed">{facility.description}</p>
                  <ul className="grid grid-cols-2 gap-4 pt-4">
                    <li className="flex items-center text-sm text-white/50 italic">Premium Equipment</li>
                    <li className="flex items-center text-sm text-white/50 italic">Experienced Staff</li>
                    <li className="flex items-center text-sm text-white/50 italic">All-Day Access</li>
                    <li className="flex items-center text-sm text-white/50 italic">Modern Design</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center space-x-1 mb-4 text-gold">
              {[...Array(5)].map((_, i) => (<Star key={i} className={i < 4 ? "fill-gold" : ""} size={24} />))}
            </div>
            <h2 className="text-4xl font-bold text-deep-blue mb-4">What Our Guests Say</h2>
            <p className="text-slate-500 font-medium">3.9/5 overall rating from {HOTEL_DETAILS.reviewsCount.toLocaleString()} reviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-slate-50 p-8 rounded-sm relative">
                <div className="absolute top-8 right-8 text-gold/20 text-6xl font-serif">"</div>
                <div className="flex space-x-1 mb-6 text-gold">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={14} className={i < review.rating ? "fill-gold" : ""} />))}
                </div>
                <p className="text-slate-700 italic mb-8 relative z-10">"{review.comment}"</p>
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-bold text-deep-blue">{review.author}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              <div>
                <span className="text-gold font-bold tracking-[0.3em] uppercase mb-4 block">Neighborhood</span>
                <h2 className="text-4xl font-bold text-deep-blue mb-6">In the Heart of Kaduna</h2>
                <div className="flex items-center text-slate-600 mb-2">
                  <MapPin className="text-gold mr-3" size={20} /><span>{HOTEL_DETAILS.address}</span>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-deep-blue">Nearby Attractions</h3>
                <div className="space-y-6">
                  {['Kaduna Golf Club (6 min walk)', 'Murtala Square Stadium (12 min walk)', 'Kaduna International Airport (31 km drive)'].map((loc, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-white shadow-sm rounded-sm">
                      <div><h4 className="font-bold text-slate-800">{loc.split('(')[0].trim()}</h4><p className="text-sm text-slate-500">{loc.split('(')[1].replace(')', '')}</p></div>
                      <div className="text-gold"><ChevronRight /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-[500px] w-full bg-slate-200 rounded-sm overflow-hidden shadow-xl border-8 border-white">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.6304604812844!2d7.4414!3d10.5115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104d400e96472641%3A0xc665e31e5f8f877c!2s13%20Lafia%20Rd%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-4xl font-bold text-deep-blue">Get in Touch</h2>
              <p className="text-slate-600">Have questions? We're here to help you plan your perfect stay.</p>
              <div className="space-y-6">
                <a 
                  href={`tel:${HOTEL_DETAILS.phone.replace(/\s/g, '')}`} 
                  className="flex items-center p-4 bg-slate-50 rounded-sm hover:bg-gold hover:text-white transition-all group"
                  title="Call Us Now"
                >
                  <div className="bg-white p-3 rounded-sm shadow-sm mr-4 group-hover:bg-deep-blue group-hover:text-white">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400 group-hover:text-white/70">Phone</p>
                    <p className="font-bold">{HOTEL_DETAILS.phone}</p>
                  </div>
                </a>
                <a 
                  href="mailto:info@thepyramidhotels.com" 
                  className="flex items-center p-4 bg-slate-50 rounded-sm hover:bg-gold hover:text-white transition-all group"
                  title="Email Us Now"
                >
                  <div className="bg-white p-3 rounded-sm shadow-sm mr-4 group-hover:bg-deep-blue group-hover:text-white">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400 group-hover:text-white/70">Email</p>
                    <p className="font-bold">info@thepyramidhotels.com</p>
                  </div>
                </a>
                <div className="flex items-center p-4 bg-slate-50 rounded-sm group">
                  <div className="bg-white p-3 rounded-sm shadow-sm mr-4 text-deep-blue">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Check-out Time</p>
                    <p className="font-bold">{HOTEL_DETAILS.checkout}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <form className="bg-slate-50 p-10 rounded-sm shadow-inner border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Your Name</label><input type="text" className="w-full px-5 py-4 border border-slate-200 focus:outline-none focus:border-gold rounded-sm bg-white" placeholder="John Doe" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Email Address</label><input type="email" className="w-full px-5 py-4 border border-slate-200 focus:outline-none focus:border-gold rounded-sm bg-white" placeholder="john@example.com" /></div>
                </div>
                <div className="space-y-2 mb-8"><label className="text-xs font-bold text-slate-500 uppercase">Subject</label><input type="text" className="w-full px-5 py-4 border border-slate-200 focus:outline-none focus:border-gold rounded-sm bg-white" placeholder="Reservation Inquiry" /></div>
                <div className="space-y-2 mb-8"><label className="text-xs font-bold text-slate-500 uppercase">Message</label><textarea rows={5} className="w-full px-5 py-4 border border-slate-200 focus:outline-none focus:border-gold rounded-sm bg-white resize-none" placeholder="How can we help you?"></textarea></div>
                <button type="submit" className="w-full md:w-auto bg-deep-blue text-white px-12 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-opacity-95 transition-all">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10"><span className="text-3xl font-serif font-bold tracking-wider">THE PYRAMID <span className="text-gold">HOTELS</span></span></div>
          <p className="text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">Experience the standard of hospitality in Kaduna. Whether for business or pleasure, we ensure your stay is memorable.</p>
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} The Pyramid Hotels. All Rights Reserved.</p>
            <div className="flex space-x-8"><a href="#" className="hover:text-gold">Privacy Policy</a><a href="#" className="hover:text-gold">Terms of Service</a><a href="#" className="hover:text-gold">Sitemap</a></div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <Chatbot />

      {/* Booking Modal */}
      <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </div>
  );
};

export default App;
