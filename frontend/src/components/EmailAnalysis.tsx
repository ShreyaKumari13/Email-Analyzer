'use client';

import { RefreshCw, Mail, Clock, Shield } from 'lucide-react';
import { Email } from '@/types/email';
import ReceivingChainTimeline from './ReceivingChainTimeline';
import ESPBadge from './ESPBadge';

interface EmailAnalysisProps {
  emails: Email[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function EmailAnalysis({ emails, loading, error, onRefresh }: EmailAnalysisProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Email Analysis Results</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && emails.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading email analysis...</p>
          </div>
        </div>
      ) : emails.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emails Analyzed Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Send a test email to the configured address with the specified subject line to see analysis results here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {emails.map((email) => (
            <div key={email._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Email Header Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {email.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      From: {email.from}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(email.date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.processingStatus)}`}>
                    {email.processingStatus}
                  </span>
                </div>
              </div>

              {/* ESP Detection */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Email Service Provider</h4>
                </div>
                <ESPBadge espType={email.espType} confidence={email.espConfidence} />
              </div>

              {/* Receiving Chain */}
              {email.receivingChain && email.receivingChain.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Email Receiving Chain
                  </h4>
                  <ReceivingChainTimeline chain={email.receivingChain} />
                </div>
              )}

              {/* Additional Details */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    View Technical Details
                  </summary>
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
                    <div className="mb-2">
                      <strong>Message ID:</strong> {email.messageId}
                    </div>
                    <div className="mb-2">
                      <strong>Processing Status:</strong> {email.processingStatus}
                    </div>
                    {email.error && (
                      <div className="mb-2 text-red-600">
                        <strong>Error:</strong> {email.error}
                      </div>
                    )}
                    <div>
                      <strong>Raw Headers:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">
                        {JSON.stringify(email.rawHeaders, null, 2)}
                      </pre>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}