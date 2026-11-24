import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getDashboardStats } from '../services/dashboardService';

const DashboardDataContext = createContext(undefined);

export const DashboardDataProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetching = useRef(false);

  const fetchStats = async (force = false) => {
    if (fetching.current) return;
    if (stats && !force) {
      setLoading(false);
      return;
    }
    try {
      fetching.current = true;
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setError('');
    } catch (err) {
      console.error("Dashboard Data Fetch Error:", err);
      setError('Unable to load dashboard stats.');
    } finally {
      fetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAndFetch = () => {
      const token = localStorage.getItem('token');
      if (token && !stats && !error) {
        fetchStats();
      } else if (!token && stats) {
        // Reset stats on logout
        setStats(null);
        setLoading(false);
      } else if (!token && !stats) {
        setLoading(false);
      }
    };
    
    checkAndFetch();
    const interval = setInterval(checkAndFetch, 1000);
    return () => clearInterval(interval);
  }, [stats, error]);

  return (
    <DashboardDataContext.Provider value={{ stats, setStats, loading, setLoading, error, refreshStats: () => fetchStats(true) }}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
};
