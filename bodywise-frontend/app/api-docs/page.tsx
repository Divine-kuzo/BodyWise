'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error('Failed to load API spec:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f5f2]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#523329] to-[#684233] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">BodyWise API Documentation</h1>
          <p className="text-[#f0d5b8] text-lg">
            Comprehensive REST API reference for the BodyWise mental health platform
          </p>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-12">
        <div className="bg-white rounded-2xl border border-[#e6d8ce] overflow-hidden shadow-lg">
          {spec ? <SwaggerUI spec={spec} /> : <div className="p-8 text-center text-[#6a4a3a]">Loading API documentation...</div>}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#523329] text-white py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#f0d5b8]">
            BodyWise API v1.0.0 • © 2025 BodyWise Health
          </p>
          <p className="text-sm text-[#d6b28f] mt-2">
            For support, contact: a.niyonseng@alustudent.com
          </p>
        </div>
      </div>
    </div>
  );
}
