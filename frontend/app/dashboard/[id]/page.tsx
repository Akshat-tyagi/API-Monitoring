'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { monitorAPI } from '@/utils/api';
import Link from 'next/link';

interface Stats {
  uptime: string;
  avgResponseTime: string;
  checksCount: number;
  upCount: number;
  downCount: number;
}

interface Incident {
  id: number;
  monitorId: number;
  startedAt: string;
  resolvedAt: string | null;
}

export default function MonitorDetail() {
  const params = useParams();
  const monitorId = Number(params.id);
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [monitorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsData, incidentsData] = await Promise.all([
        monitorAPI.getStats(monitorId),
        monitorAPI.getIncidents(monitorId)
      ]);
      
      setStats(statsData);
      setIncidents(incidentsData.incidents || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load monitor details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getIncidentDuration = (incident: Incident) => {
    const start = new Date(incident.startedAt);
    const end = incident.resolvedAt ? new Date(incident.resolvedAt) : new Date();
    const duration = end.getTime() - start.getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading monitor details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-8">
            {error}
          </div>
        )}

        {/* Stats Section */}
        {stats && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Monitor Statistics (24 hours)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Uptime Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <p className="text-sm font-medium text-green-600 mb-2">UPTIME</p>
                <p className="text-4xl font-bold text-green-900">{stats.uptime}</p>
                <p className="text-xs text-green-600 mt-2">Last 24 hours</p>
              </div>

              {/* Response Time Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <p className="text-sm font-medium text-blue-600 mb-2">AVG RESPONSE TIME</p>
                <p className="text-4xl font-bold text-blue-900">{stats.avgResponseTime}</p>
                <p className="text-xs text-blue-600 mt-2">Average</p>
              </div>
            </div>

            {/* Check Statistics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Checks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.checksCount}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-green-600 text-sm">Up</p>
                <p className="text-2xl font-bold text-green-900">{stats.upCount}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-red-600 text-sm">Down</p>
                <p className="text-2xl font-bold text-red-900">{stats.downCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Incidents Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Incidents (24 hours)</h3>

          {incidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No incidents detected</p>
              <p className="text-gray-400 text-sm mt-2">Your monitor is running smoothly!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`border rounded-lg p-4 ${
                    incident.resolvedAt
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            incident.resolvedAt ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            incident.resolvedAt ? 'text-green-900' : 'text-red-900'
                          }`}
                        >
                          {incident.resolvedAt ? 'Resolved' : 'Ongoing'}
                        </span>
                      </div>

                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <span className="font-medium">Started:</span>{' '}
                          {formatDate(incident.startedAt)}
                        </p>
                        {incident.resolvedAt && (
                          <>
                            <p>
                              <span className="font-medium">Resolved:</span>{' '}
                              {formatDate(incident.resolvedAt)}
                            </p>
                            <p>
                              <span className="font-medium">Duration:</span>{' '}
                              {getIncidentDuration(incident)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}