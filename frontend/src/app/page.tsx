'use client';

import { useState, useEffect } from 'react';
import EmailConfig from '@/components/EmailConfig';
import EmailAnalysis from '@/components/EmailAnalysis';
import { Email } from '@/types/email';
import { emailService } from '@/services/emailService';

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmails();
    
    // Poll for new emails every 10 seconds
    const interval = setInterval(loadEmails, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadEmails = async () => {
    try {
      setError(null);
      const fetchedEmails = await emailService.getAllEmails();
      setEmails(fetchedEmails);
    } catch (err) {
      setError('Failed to load emails');
      console.error('Error loading emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmails = () => {
    setLoading(true);
    loadEmails();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📧 Email Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automatically identify email receiving chains and ESP providers using IMAP analysis
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Configuration */}
          <div className="lg:col-span-1">
            <EmailConfig onRefresh={refreshEmails} />
          </div>

          {/* Email Analysis Results */}
          <div className="lg:col-span-2">
            <EmailAnalysis 
              emails={emails}
              loading={loading}
              error={error}
              onRefresh={refreshEmails}
            />
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500">
          <p>Built with Next.js, NestJS & MongoDB for Lucid Growth Assignment</p>
        </footer>
      </div>
    </div>
  );
}