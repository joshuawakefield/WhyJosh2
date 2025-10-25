
import React, { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent } from 'react';
import type { AccordionItem } from './types';

// COLORS (from CSS variables for reference)
const colors = {
    bgMint0: '#e4f3ee',
    bgMint1: '#cfe8df',
    bgMint2: '#a6d1c2',
    teal600: '#5a9787',
    violet500: '#8e6cd1',
    violet600: '#6f56b3',
    magenta400: '#c48df2',
    gold300: '#ffd98e',
    rayWhite: '#ffffff',
    ink900: '#1e2a27',
    ink700: 'rgba(30,42,39,.75)',
};

// --- ICON COMPONENTS ---
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);


// --- REUSABLE UI COMPONENTS ---

interface AccordionProps {
    items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
    const [openId, setOpenId] = useState<string | null>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, items.length);
    }, [items]);

    const toggleItem = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (index + 1) % items.length;
            itemRefs.current[nextIndex]?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (index - 1 + items.length) % items.length;
            itemRefs.current[prevIndex]?.focus();
        }
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const isOpen = openId === item.id;
                return (
                    <div key={item.id} className="border-b border-[var(--teal-600)]/30">
                        <h2>
                            <button
                                // FIX: The ref callback function for a ref should not return a value. 
                                // The concise arrow function `el => itemRefs.current[index] = el` was implicitly returning the assigned value. 
                                // Changed to a block body to ensure a `void` return type.
                                ref={el => { itemRefs.current[index] = el; }}
                                onClick={() => toggleItem(item.id)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                aria-expanded={isOpen}
                                aria-controls={`accordion-content-${item.id}`}
                                id={`accordion-title-${item.id}`}
                                className="flex justify-between items-center w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--violet-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-mint-0)] rounded-md"
                            >
                                <span className="text-lg font-semibold text-[var(--teal-600)]">{item.title}</span>
                                <ChevronDownIcon className={`w-6 h-6 text-[var(--violet-500)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </h2>
                        <div
                            id={`accordion-content-${item.id}`}
                            role="region"
                            aria-labelledby={`accordion-title-${item.id}`}
                            className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : ''}`}
                        >
                            <div className="overflow-hidden">
                               <p className="p-4 pt-0 text-[var(--ink-700)] leading-relaxed">{item.content}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
    if (!show) return null;

    return (
        <div role="status" aria-live="polite" className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-[var(--ink-900)] text-[var(--bg-mint-0)] p-4 rounded-lg shadow-2xl flex items-center space-x-4 z-50 animate-[fadeIn_0.5s_ease-out]">
            <span>{message}</span>
            <button onClick={onClose} aria-label="Close notification" className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


// --- SECTIONAL COMPONENTS ---

interface HeaderProps {
    scrollTo: (id: string) => void;
}
const Header: React.FC<HeaderProps> = ({ scrollTo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = [
        { id: 'about', title: 'About' },
        { id: 'expect', title: 'What to Expect' },
        { id: 'sessions', title: 'Sessions' },
        { id: 'policies', title: 'Policies' },
        { id: 'faq', title: 'FAQ' },
        { id: 'book', title: 'Book' },
    ];

    const handleLinkClick = (id: string) => {
        setIsOpen(false);
        scrollTo(id);
    };

    return (
        <header className="sticky top-0 z-40 bg-[var(--bg-mint-0)]/80 backdrop-blur-md">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                         <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('hero');}} className="text-2xl font-bold tracking-wider text-[var(--teal-600)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--violet-500)] rounded-sm">And She Awoke</a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map(link => (
                                <button key={link.id} onClick={() => scrollTo(link.id)} className="px-3 py-2 rounded-md text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:bg-[var(--bg-mint-1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--violet-500)]">
                                    {link.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:bg-[var(--bg-mint-1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-mint-0)] focus:ring-[var(--violet-500)]" aria-controls="mobile-menu" aria-expanded={isOpen}>
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <button key={link.id} onClick={() => handleLinkClick(link.id)} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:bg-[var(--bg-mint-1)]">
                                {link.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

const Hero: React.FC<{ scrollTo: (id: string) => void }> = ({ scrollTo }) => (
    <section id="hero" className="relative h-[90vh] min-h-[600px] max-h-[800px] flex items-center justify-center text-center overflow-hidden">
        {/* Film Grain */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--ink-900) 1px, transparent 1px), radial-gradient(var(--ink-900) 1px, transparent 1px)', backgroundSize: '2px 2px, 2px 2px', backgroundPosition: '0 0, 1px 1px' }}></div>
        
        {/* Radial Light Well */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_55%_40%,var(--ray-white)_0%,rgba(255,255,255,0.85)_18%,var(--bg-mint-1)_42%,var(--bg-mint-2)_75%,transparent_100%)] motion-safe:animate-pulse-custom"></div>

        {/* Ray Beams */}
        <div className="absolute inset-0 z-20 bg-[repeating-conic-gradient(from_0deg,rgba(255,255,255,0.28)_0deg_6deg,transparent_6deg_18deg)] [mask:radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,transparent_65%)] mix-blend-screen blur-sm"></div>

        {/* Cosmic Hand */}
        <div role="img" aria-label="An abstract cosmic hand cradling light" className="absolute bottom-0 right-0 w-1/2 h-1/2 max-w-md max-h-md z-30 opacity-60">
            <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                    <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'var(--violet-600)' }} />
                        <stop offset="100%" style={{ stopColor: 'var(--magenta-400)' }} />
                    </linearGradient>
                     <pattern id="star-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="30" r="0.8" fill="white" opacity="0.8" className="motion-safe:animate-twinkle-1"/>
                        <circle cx="80" cy="70" r="1.1" fill="white" opacity="0.9" className="motion-safe:animate-twinkle-2"/>
                        <circle cx="50" cy="10" r="0.7" fill="white" opacity="0.7"/>
                        <circle cx="90" cy="20" r="0.9" fill="var(--gold-300)" opacity="1" className="motion-safe:animate-twinkle-3"/>
                        <circle cx="40" cy="80" r="0.6" fill="white" opacity="0.6"/>
                    </pattern>
                </defs>
                <path d="M226.7,358.9c-30.7-3.9-57.2-22.3-75-47.5c-15.6-22.2-24-49.3-24.9-77.5c-0.8-24.3,3.7-48.4,12.8-70.5 c10.3-25,27.9-46.1,50.7-59.5c18.1-10.7,38.8-16.1,59.9-15.7c26.7,0.5,52.2,9.6,72,26.4c1.5,1.3,2.4,3.2,2.4,5.2 c0,3.3-2.7,6-6,6c-1.8,0-3.5-0.8-4.6-2.2c-17.2-14.7-39.6-22.3-62.9-22.7c-18.7-0.3-36.9,4.4-52.9,13.7 c-20.2,11.9-36,30.8-45.1,53.2c-8.1,20-12,41.6-11.3,63.5c0.9,25.6,8.4,50.1,22.4,70.2c16.4,23.1,40.5,39.8,68.4,43.3 c3.3,0.4,5.8,3.2,5.8,6.5C232.7,356.2,230,358.9,226.7,358.9z M131.5,237.1c-19.1-3.6-35.3-15.3-46.1-32.3 c-12-19.2-15.4-42.5-10-64.8c6.6-27.1,25-49.2,49.2-61.1c19.1-9.4,40.7-11.7,61.1-7.1c25.9,5.8,47.7,22.2,60.1,44.9 c1.1,2,0.6,4.5-1,5.9c-1.6,1.4-4,1.6-5.9,0.5c-10.6-9.6-24.2-16.1-38.9-18.3c-17.9-2.7-36.2,1.3-51.2,11.2 c-18.3,12.1-30.8,31.2-34.5,52.4c-3.1,17.4,0.1,35.4,8.9,50.8c8.3,14.6,22,25.1,38.2,29c3.2,0.8,5.3,3.9,4.9,7.1 C137.9,235.8,134.8,237.8,131.5,237.1z" fill="url(#handGradient)"/>
                <path d="M226.7,358.9c-30.7-3.9-57.2-22.3-75-47.5c-15.6-22.2-24-49.3-24.9-77.5c-0.8-24.3,3.7-48.4,12.8-70.5 c10.3-25,27.9-46.1,50.7-59.5c18.1-10.7,38.8-16.1,59.9-15.7c26.7,0.5,52.2,9.6,72,26.4c1.5,1.3,2.4,3.2,2.4,5.2 c0,3.3-2.7,6-6,6c-1.8,0-3.5-0.8-4.6-2.2c-17.2-14.7-39.6-22.3-62.9-22.7c-18.7-0.3-36.9,4.4-52.9,13.7 c-20.2,11.9-36,30.8-45.1,53.2c-8.1,20-12,41.6-11.3,63.5c0.9,25.6,8.4,50.1,22.4,70.2c16.4,23.1,40.5,39.8,68.4,43.3 c3.3,0.4,5.8,3.2,5.8,6.5C232.7,356.2,230,358.9,226.7,358.9z M131.5,237.1c-19.1-3.6-35.3-15.3-46.1-32.3 c-12-19.2-15.4-42.5-10-64.8c6.6-27.1,25-49.2,49.2-61.1c19.1-9.4,40.7-11.7,61.1-7.1c25.9,5.8,47.7,22.2,60.1,44.9 c1.1,2,0.6,4.5-1,5.9c-1.6,1.4-4,1.6-5.9,0.5c-10.6-9.6-24.2-16.1-38.9-18.3c-17.9-2.7-36.2,1.3-51.2,11.2 c-18.3,12.1-30.8,31.2-34.5,52.4c-3.1,17.4,0.1,35.4,8.9,50.8c8.3,14.6,22,25.1,38.2,29c3.2,0.8,5.3,3.9,4.9,7.1 C137.9,235.8,134.8,237.8,131.5,237.1z" fill="url(#star-pattern)" opacity="0.8"/>
                <path d="M226.7,358.9c-30.7-3.9-57.2-22.3-75-47.5c-15.6-22.2-24-49.3-24.9-77.5c-0.8-24.3,3.7-48.4,12.8-70.5 c10.3-25,27.9-46.1,50.7-59.5c18.1-10.7,38.8-16.1,59.9-15.7c26.7,0.5,52.2,9.6,72,26.4c1.5,1.3,2.4,3.2,2.4,5.2 c0,3.3-2.7,6-6,6c-1.8,0-3.5-0.8-4.6-2.2c-17.2-14.7-39.6-22.3-62.9-22.7c-18.7-0.3-36.9,4.4-52.9,13.7 c-20.2,11.9-36,30.8-45.1,53.2c-8.1,20-12,41.6-11.3,63.5c0.9,25.6,8.4,50.1,22.4,70.2c16.4,23.1,40.5,39.8,68.4,43.3 c3.3,0.4,5.8,3.2,5.8,6.5C232.7,356.2,230,358.9,226.7,358.9z M131.5,237.1c-19.1-3.6-35.3-15.3-46.1-32.3 c-12-19.2-15.4-42.5-10-64.8c6.6-27.1,25-49.2,49.2-61.1c19.1-9.4,40.7-11.7,61.1-7.1c25.9,5.8,47.7,22.2,60.1,44.9 c1.1,2,0.6,4.5-1,5.9c-1.6,1.4-4,1.6-5.9,0.5c-10.6-9.6-24.2-16.1-38.9-18.3c-17.9-2.7-36.2,1.3-51.2,11.2 c-18.3,12.1-30.8,31.2-34.5,52.4c-3.1,17.4,0.1,35.4,8.9,50.8c8.3,14.6,22,25.1,38.2,29c3.2,0.8,5.3,3.9,4.9,7.1 C137.9,235.8,134.8,237.8,131.5,237.1z" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/>
            </svg>
        </div>

        <div className="relative z-30 px-4">
            <h1 className="text-4xl md:text-6xl font-light text-[var(--ink-900)] tracking-tight">A quiet space to reconnect.</h1>
            <p className="mt-4 text-lg md:text-xl text-[var(--ink-700)] max-w-2xl mx-auto">Reconnective Healing — in person or from anywhere.</p>
            <button onClick={() => scrollTo('book')} className="mt-8 px-8 py-4 bg-[var(--violet-500)] text-white font-semibold rounded-full shadow-lg hover:bg-[var(--violet-600)] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-mint-0)] focus-visible:ring-[var(--violet-600)]">
                Book a Session
            </button>
        </div>
    </section>
);

const About = () => (
    <section id="about" className="py-20 sm:py-24 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl font-semibold text-[var(--teal-600)]">Jolene Powell is a Reconnective Healing Foundational Practitioner based in Newport, Rhode Island.</h2>
            <p className="mt-6 text-lg text-[var(--ink-700)] leading-relaxed max-w-3xl mx-auto">
                She offers in-person and distance sessions with a calm, grounded presence. Clients describe her approach as clear, down-to-earth, and human.
            </p>
        </div>
    </section>
);

const WhatToExpect = () => (
    <section id="expect" className="py-20 sm:py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl font-semibold text-[var(--teal-600)]">What a session is like</h2>
            <p className="mt-6 text-lg text-[var(--ink-700)] leading-relaxed max-w-3xl mx-auto">
               Rest comfortably while you notice sensations and feelings as they arise—nothing to force. The work is non-touch and does not diagnose or treat conditions. Remote sessions are held at a set time while you relax at home.
            </p>
        </div>
    </section>
);

const Sessions: React.FC<{ scrollTo: (id: string) => void }> = ({ scrollTo }) => {
    const sessionData = [
        { title: '60-minute Reconnective Healing', price: '$120' },
        { title: 'Three-session reset (save 15%)', price: '$306' },
        { title: 'Remote session (60 min)', price: '$120' },
    ];
    return (
        <section id="sessions" className="py-20 sm:py-24 bg-[var(--bg-mint-1)]/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <h2 className="text-3xl font-semibold text-center text-[var(--teal-600)]">Sessions</h2>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {sessionData.map(session => (
                        <div key={session.title} className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col">
                            <h3 className="text-xl font-semibold text-[var(--teal-600)] flex-grow">{session.title}</h3>
                            <p className="mt-4 text-3xl font-light text-[var(--ink-900)]">{session.price}</p>
                            <button onClick={() => scrollTo('book')} className="mt-8 w-full px-6 py-3 bg-[var(--teal-600)] text-white font-semibold rounded-full shadow-md hover:bg-[var(--violet-500)] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--violet-600)]">
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Booking: React.FC<{ showToast: (message: string) => void }> = ({ showToast }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        showToast("Request sent! We'll confirm by email.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section id="book" className="py-20 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                 <h2 className="text-3xl font-semibold text-center text-[var(--teal-600)]">Book a Session</h2>
                 <div className="mt-12 grid md:grid-cols-2 gap-12 items-start">
                     <div>
                        <h3 className="text-xl font-semibold text-[var(--teal-600)]">To prepare:</h3>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-[var(--ink-700)]">
                            <li>Find a quiet, comfortable space</li>
                            <li>Silence phone and notifications</li>
                            <li>Have a glass of water nearby</li>
                        </ul>
                     </div>
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                           <label htmlFor="name" className="block text-sm font-medium text-[var(--ink-700)]">Full Name</label>
                           <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--bg-mint-2)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--violet-500)] focus:border-[var(--violet-500)] sm:text-sm" />
                        </div>
                         <div>
                           <label htmlFor="email" className="block text-sm font-medium text-[var(--ink-700)]">Email</label>
                           <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--bg-mint-2)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--violet-500)] focus:border-[var(--violet-500)] sm:text-sm" />
                        </div>
                         <div>
                           <label htmlFor="datetime" className="block text-sm font-medium text-[var(--ink-700)]">Preferred Date/Time</label>
                           <input type="text" name="datetime" id="datetime" placeholder="e.g., Weekday afternoons EST" className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--bg-mint-2)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--violet-500)] focus:border-[var(--violet-500)] sm:text-sm" />
                        </div>
                         <div>
                           <label htmlFor="notes" className="block text-sm font-medium text-[var(--ink-700)]">Notes (optional)</label>
                           <textarea name="notes" id="notes" rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--bg-mint-2)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--violet-500)] focus:border-[var(--violet-500)] sm:text-sm"></textarea>
                        </div>
                        <button type="submit" className="w-full px-6 py-3 bg-[var(--violet-500)] text-white font-semibold rounded-full shadow-md hover:bg-[var(--violet-600)] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--violet-600)]">Request Session</button>
                     </form>
                 </div>
            </div>
        </section>
    );
};


const Policies = () => {
    const policyItems: AccordionItem[] = [
        { id: 'scope', title: 'Scope of Practice', content: 'This is a complementary well-being practice, not medical care. It is not a substitute for diagnosis or treatment from a licensed medical professional.' },
        { id: 'cancellations', title: 'Cancellations', content: 'Please provide 24-hour notice to avoid fees. A 50% fee applies to late cancellations, and a 100% fee applies to no-shows.' },
        { id: 'privacy', title: 'Privacy', content: 'Session details are kept private. This is not a HIPAA-covered practice. Your data will not be sold, and email list subscriptions are opt-in.' },
    ];
    return (
        <section id="policies" className="py-20 sm:py-24 bg-[var(--bg-mint-1)]/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h2 className="text-3xl font-semibold text-center text-[var(--teal-600)]">Policies</h2>
                <div className="mt-12">
                    <Accordion items={policyItems} />
                </div>
            </div>
        </section>
    );
};

const FAQ = () => {
    const faqItems: AccordionItem[] = [
        { id: 'q1', title: 'Is this a medical treatment?', content: 'No. It’s a complementary well-being service. Continue care with your licensed providers.' },
        { id: 'q2', title: 'Do you offer remote sessions?', content: 'Yes—worldwide. Many clients find distance work as easeful as in-person.' },
        { id: 'q3', title: 'What will I feel?', content: 'Experiences vary: calm, clarity, emotional release, or subtle shifts over 24–72 hours.' },
        { id: 'q4', title: 'How many sessions?', content: 'Some feel complete in one; others prefer a short series.' },
    ];
    return (
        <section id="faq" className="py-20 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h2 className="text-3xl font-semibold text-center text-[var(--teal-600)]">Frequently Asked Questions</h2>
                <div className="mt-12">
                    <Accordion items={faqItems} />
                </div>
            </div>
        </section>
    );
};


const Footer = () => (
    <footer className="bg-[var(--bg-mint-2)] text-[var(--ink-900)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-lg font-semibold">Stay in touch</h3>
                    <p className="mt-2 text-sm text-[var(--ink-700)]">No spam. Unsubscribe anytime.</p>
                    <form className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
                        <label htmlFor="footer-email" className="sr-only">Email address</label>
                        <input type="email" id="footer-email" placeholder="Enter your email" className="flex-grow px-3 py-2 bg-white border border-[var(--bg-mint-2)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--violet-500)] focus:border-[var(--violet-500)] sm:text-sm" />
                        <button type="submit" className="px-5 py-2 bg-[var(--teal-600)] text-white font-semibold rounded-md shadow-sm hover:bg-[var(--violet-500)] transition-colors duration-300">Subscribe</button>
                    </form>
                </div>
                <div className="md:text-right">
                    <p className="font-semibold">Newport, RI • hello@andsheawoke.com</p>
                    <p className="mt-4 text-sm text-[var(--ink-700)]">For urgent concerns, please contact emergency services.</p>
                    <p className="mt-1 text-sm text-[var(--ink-700)]">&copy; {new Date().getFullYear()} And She Awoke. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
);

const MobileCTA: React.FC<{ scrollTo: (id: string) => void }> = ({ scrollTo }) => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-mint-0)]/80 backdrop-blur-md z-40 border-t border-[var(--bg-mint-2)]">
        <button onClick={() => scrollTo('book')} className="w-full px-6 py-4 bg-[var(--violet-500)] text-white text-lg font-semibold rounded-full shadow-lg hover:bg-[var(--violet-600)] transition-colors duration-300">
            Book a Session
        </button>
    </div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
    const sectionRefs = {
        hero: useRef<HTMLElement>(null),
        about: useRef<HTMLElement>(null),
        expect: useRef<HTMLElement>(null),
        sessions: useRef<HTMLElement>(null),
        policies: useRef<HTMLElement>(null),
        faq: useRef<HTMLElement>(null),
        book: useRef<HTMLElement>(null),
    };

    const [toastInfo, setToastInfo] = useState({ show: false, message: '' });

    const showToast = (message: string) => {
      setToastInfo({ show: true, message });
      setTimeout(() => {
          setToastInfo({ show: false, message: '' });
      }, 5000);
    };

    const handleScrollTo = useCallback((id: keyof typeof sectionRefs) => {
        sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-section').forEach(section => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[var(--violet-500)] focus:text-white rounded-md">Skip to main content</a>
            <Header scrollTo={handleScrollTo} />
            <main id="main-content">
                <Hero scrollTo={handleScrollTo} />
                <div ref={sectionRefs.about as React.RefObject<HTMLDivElement>} className="fade-in-section">
                    <About />
                </div>
                 <div ref={sectionRefs.expect as React.RefObject<HTMLDivElement>} className="fade-in-section">
                    <WhatToExpect />
                </div>
                <div ref={sectionRefs.sessions as React.RefObject<HTMLDivElement>} className="fade-in-section">
                    <Sessions scrollTo={handleScrollTo} />
                </div>
                 <div ref={sectionRefs.book as React.RefObject<HTMLDivElement>} className="fade-in-section">
                    <Booking showToast={showToast} />
                </div>
                <div ref={sectionRefs.policies as React.RefObject<HTMLDivElement>} className="fade-in-section">
                    <Policies />
                </div>
                <div ref={sectionRefs.faq as React.RefObject<HTMLDivElement>} className="fade-in-section">
                    <FAQ />
                </div>
            </main>
            <Footer />
            <MobileCTA scrollTo={handleScrollTo} />
            <Toast message={toastInfo.message} show={toastInfo.show} onClose={() => setToastInfo({ show: false, message: '' })} />
        </>
    );
}
