'use client';

import { ArrowRight, Server } from 'lucide-react';

interface ReceivingChainTimelineProps {
  chain: string[];
}

export default function ReceivingChainTimeline({ chain }: ReceivingChainTimelineProps) {
  if (!chain || chain.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No receiving chain data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeline View */}
      <div className="flex flex-wrap items-center gap-2">
        {chain.map((server, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Server className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 truncate max-w-[200px]" title={server}>
                {server}
              </span>
            </div>
            {index < chain.length - 1 && (
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Table View for Detailed Info */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-gray-700">Step</th>
              <th className="text-left py-2 px-3 font-medium text-gray-700">Server</th>
              <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
            </tr>
          </thead>
          <tbody>
            {chain.map((server, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                </td>
                <td className="py-2 px-3 font-mono text-xs">
                  {server}
                </td>
                <td className="py-2 px-3">
                  <span className="text-xs text-gray-600">
                    {getServerType(server)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
        <span className="text-gray-600">
          Total hops: <strong className="text-gray-900">{chain.length}</strong>
        </span>
        <span className="text-gray-600">
          Final destination: <strong className="text-gray-900 truncate max-w-[200px]" title={chain[chain.length - 1]}>
            {chain[chain.length - 1]}
          </strong>
        </span>
      </div>
    </div>
  );
}

function getServerType(server: string): string {
  const serverLower = server.toLowerCase();
  
  if (serverLower.includes('gmail') || serverLower.includes('google')) {
    return 'Gmail/Google';
  } else if (serverLower.includes('outlook') || serverLower.includes('hotmail') || serverLower.includes('microsoft')) {
    return 'Outlook/Microsoft';
  } else if (serverLower.includes('yahoo')) {
    return 'Yahoo';
  } else if (serverLower.includes('amazon') || serverLower.includes('ses')) {
    return 'Amazon SES';
  } else if (serverLower.includes('sendgrid')) {
    return 'SendGrid';
  } else if (serverLower.includes('mailgun')) {
    return 'Mailgun';
  } else if (serverLower.includes('smtp')) {
    return 'SMTP Server';
  } else if (serverLower.includes('mx')) {
    return 'Mail Exchange';
  } else if (serverLower.includes('relay')) {
    return 'Mail Relay';
  } else {
    return 'Mail Server';
  }
}