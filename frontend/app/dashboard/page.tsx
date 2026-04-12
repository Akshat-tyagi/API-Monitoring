'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { monitorAPI } from '@/utils/api';
import Link from 'next/link';

interface Monitor {
  id: number;
  name: string;
  url: string;
  interval: number;
  createdAt: string;
}

export default function Dashboard() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state for adding new monitor
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const router = useRouter();

  // Fetch all monitors on page load
  useEffect(() => {
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const data = await monitorAPI.getAll();
      setMonitors(data.monitors);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load monitors');
    } finally {
      setLoading(false);
    }
  };

  // Handle add monitor
  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      await monitorAPI.create(formData);
      setFormData({ name: '', url: '' });
      setShowForm(false);
      await fetchMonitors();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create monitor');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete monitor
  const handleDeleteMonitor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this monitor?')) return;

    try {
      await monitorAPI.delete(id);
      setMonitors(monitors.filter(m => m.id !== id));
    } catch (err: any) {
      alert('Failed to delete monitor: ' + err.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear auth cookie so middleware blocks access to protected routes
    document.cookie = 'authtoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">UptimeMonitor</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Monitors</h2>
            <p className="text-gray-600 mt-2">Monitor your APIs and websites in real-time</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            {showForm ? 'Cancel' : '+ Add Monitor'}
          </button>
        </div>

        {/* Add Monitor Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Monitor</h3>
            
            {formError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddMonitor} className="space-y-4">
              {/* Monitor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Monitor Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., My API Server"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Monitor URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">URL to Monitor</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/health"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition font-medium"
              >
                {formLoading ? 'Creating...' : 'Create Monitor'}
              </button>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading monitors...</p>
          </div>
        ) : monitors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No monitors yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
            >
              Create your first monitor
            </button>
          </div>
        ) : (
          /* Monitor Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitors.map((monitor) => (
              <div key={monitor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                {/* Monitor Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{monitor.name}</h3>
                
                {/* Monitor URL */}
                <p className="text-sm text-gray-600 mb-4 break-all">{monitor.url}</p>

                {/* Monitor Info */}
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-xs text-gray-600">Check Interval</p>
                  <p className="text-sm font-medium text-gray-900">{monitor.interval} seconds</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/${monitor.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition text-center text-sm font-medium"
                  >
                    View Stats
                  </Link>
                  <button
                    onClick={() => handleDeleteMonitor(monitor.id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}