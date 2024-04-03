import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // With react-ga4, you use the `send` method to track page views
    ReactGA.send({ 
      hitType: 'pageview', 
      page: location.pathname + location.search 
    });
  }, [location]);

  return null; // This component does not render anything
};

export default RouteChangeTracker;
