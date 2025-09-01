'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Mail, Server, Copy, Check } from 'lucide-react';
import { emailService } from '@/services/emailService';
import { EmailConfig as EmailConfigType, ConnectionStatus } from '@/types/email';

interface EmailConfigProps {
  onRefresh: () => void;
}

export default function EmailConfig({ onRefresh }: EmailConfigProps) {
  const [config, setConfig] = useState<EmailConfigType | null>(null);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const [configData, statusData] = await Promise.all([
        emailService.getConfig(),
        emailService.getStatus(),
      ]);
      setConfig(configData);
      setStatus(statusData);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusColor = () => {
    if (!status) return 'bg-gray-500';
    return status.connected ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (!status) return 'Unknown';
    return status.connected ? 'Connected' : 'Disconnected';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Test Configuration</h2>
        <button
          onClick={() => {
            loadConfig();
            onRefresh();
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <div>
            <h3 className="font-semibold text-gray-900">IMAP Connection</h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>
      </div>

      {/* Email Instructions */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Test Email To:
          </h3>
          
          {config && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Email Address:
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm font-mono">
                    {config.email}
                  </code>
                  <button
                    onClick={() => copyToClipboard(config.email, 'email')}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {copied === 'email' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Subject Line:
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm font-mono">
                    {config.subject}
                  </code>
                  <button
                    onClick={() => copyToClipboard(config.subject, 'subject')}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {copied === 'subject' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <Server className="h-5 w-5" />
            How it works:
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Send an email to the address above with the exact subject line</li>
            <li>• The system will automatically detect and analyze the email</li>
            <li>• Results will appear in the analysis panel within seconds</li>
            <li>• You can test with different email providers (Gmail, Outlook, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}