
import React, { useState, useCallback } from 'react';
import { generateBrief } from './services/api';

type AppState = 'idle' | 'composing' | 'success';

const ProgressIndicator: React.FC<{ progress: number, statusText: string }> = ({ progress, statusText }) => (
    <div className="w-full max-w-lg mx-auto text-center">
        <p className="text-lg text-gray-700 mb-4">{statusText}</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
            <div
                className="bg-blue-600 h-4 rounded-full progress-bar-inner"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
);

export default function App() {
    const [appState, setAppState] = useState<AppState>('idle');
    const [jdText, setJdText] = useState('');
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (jdText.length < 200 || jdText.length > 20000) {
            setError('Job description must be between 200 and 20,000 characters.');
            return;
        }
        setError('');
        setAppState('composing');

        const progressUpdates = [
            { p: 30, t: 'Scrubbing and analyzing JD...' },
            { p: 60, t: 'Generating brief with Gemini...' },
            { p: 90, t: 'Composing PDF document...' },
            { p: 100, t: 'Done! Downloading...' },
        ];
        
        for (const update of progressUpdates) {
             await new Promise(res => setTimeout(res, 600));
             setProgress(update.p);
             setStatusText(update.t);
        }

        try {
            const result = await generateBrief({ jdText, role, company, botToken: 'dummy-token' });
            setShareUrl(result.shareUrl);
            setAppState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setAppState('idle');
        }
    };
    
    const handleReset = () => {
        setAppState('idle');
        setProgress(0);
        setStatusText('');
        setShareUrl('');
        setError('');
        // Keep form values for "Tweak & Regenerate"
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Share link copied to clipboard!');
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">WhyJosh</h1>
                    <p className="text-lg text-gray-600 mt-2">Turn a Job Description into a Personalised Brief</p>
                </header>
                
                <main className="bg-white p-8 rounded-xl shadow-lg w-full">
                    {appState === 'idle' && (
                        <form onSubmit={handleGenerate}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company (Optional)</label>
                                    <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role (Optional)</label>
                                    <input type="text" id="role" value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="jd" className="block text-sm font-medium text-gray-700">Job Description</label>
                                    <textarea id="jd" value={jdText} onChange={e => setJdText(e.target.value)} rows={12} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Paste the full job description here..."></textarea>
                                </div>
                                {error && <p className="text-red-600 text-sm">{error}</p>}
                            </div>
                            <div className="mt-8 text-center">
                                <button type="submit" className="w-full sm:w-auto px-12 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                                    Generate Brief
                                </button>
                            </div>
                        </form>
                    )}

                    {appState === 'composing' && <ProgressIndicator progress={progress} statusText={statusText} />}
                    
                    {appState === 'success' && (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-green-700">Brief Generated Successfully!</h2>
                            <p className="text-gray-600 mt-2">Your PDF has been downloaded automatically.</p>
                            <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
                                <button onClick={copyToClipboard} className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                    Copy Share Link
                                </button>
                                <button onClick={handleReset} className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Tweak & Regenerate
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
