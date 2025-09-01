'use client';

import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ESPBadgeProps {
  espType: string;
  confidence: number;
}

export default function ESPBadge({ espType, confidence }: ESPBadgeProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-700 bg-green-100 border-green-200';
    if (conf >= 0.6) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-red-700 bg-red-100 border-red-200';
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 0.8) return <CheckCircle className="h-4 w-4" />;
    if (conf >= 0.6) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const getESPIcon = (esp: string) => {
    const espLower = esp.toLowerCase();
    
    // Return appropriate styling based on ESP type
    if (espLower.includes('gmail')) {
      return '📧'; // Gmail
    } else if (espLower.includes('outlook') || espLower.includes('hotmail')) {
      return '📮'; // Outlook
    } else if (espLower.includes('amazon') || espLower.includes('ses')) {
      return '📦'; // Amazon SES
    } else if (espLower.includes('sendgrid')) {
      return '⚡'; // SendGrid
    } else if (espLower.includes('mailgun')) {
      return '🔫'; // Mailgun
    } else if (espLower.includes('yahoo')) {
      return '💜'; // Yahoo
    } else if (espLower.includes('zoho')) {
      return '🟢'; // Zoho
    } else if (espLower.includes('mailchimp')) {
      return '🐒'; // Mailchimp
    } else {
      return '📨'; // Generic
    }
  };

  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className="flex items-center gap-4">
      {/* ESP Type Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg">{getESPIcon(espType)}</span>
        <div>
          <div className="font-semibold text-blue-900">{espType}</div>
          <div className="text-xs text-blue-700">Email Service Provider</div>
        </div>
      </div>

      {/* Confidence Badge */}
      <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${getConfidenceColor(confidence)}`}>
        {getConfidenceIcon(confidence)}
        <div>
          <div className="font-medium text-sm">
            {confidencePercentage}% Confidence
          </div>
          <div className="text-xs opacity-75">
            Detection accuracy
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="flex-1 min-w-[100px]">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Confidence Level</span>
          <span>{confidencePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              confidence >= 0.8 ? 'bg-green-500' : 
              confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}