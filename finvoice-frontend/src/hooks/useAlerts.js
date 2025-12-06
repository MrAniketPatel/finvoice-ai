import { useState, useEffect } from 'react';

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [dueSoonCount, setDueSoonCount] = useState(0);

  useEffect(() => {
    fetchAlerts();
    // Check alerts every minute
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/alerts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
        calculateCounts(data);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const calculateCounts = (alertsData) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDays = new Date(now);
    threeDays.setDate(threeDays.getDate() + 3);

    let pending = 0;
    let overdue = 0;
    let dueSoon = 0;

    alertsData.forEach((alert) => {
      if (alert.status === 'pending') {
        pending++;
        const dueDate = new Date(alert.dueDate);
        
        if (dueDate < now) {
          overdue++;
        } else if (dueDate <= threeDays) {
          dueSoon++;
        }
      }
    });

    setPendingCount(pending);
    setOverdueCount(overdue);
    setDueSoonCount(dueSoon);

    // Show browser notification for overdue
    if (overdue > 0 && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('FinVoice.AI - Payment Overdue!', {
        body: `You have ${overdue} overdue payment${overdue > 1 ? 's' : ''}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return {
    alerts,
    pendingCount,
    overdueCount,
    dueSoonCount,
    requestNotificationPermission,
    refreshAlerts: fetchAlerts,
  };
};

export default useAlerts;
