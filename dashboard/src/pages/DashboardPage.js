//dashboard/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import ActionButtons from '../components/ActionButtons';
import BoundingBoxDrawer from '../components/BoundingBoxDrawer';
import StatusIndicator from '../components/StatusIndicator';
import { videoFeed, endpoints } from '../services/apiEndpoints';
import { useTrackerStatus, useFollowerStatus } from '../hooks/useStatuses';
import useBoundingBoxHandlers from '../hooks/useBoundingBoxHandlers';

const API_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;

const DashboardPage = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkInterval = 2000; // Check tracker and follower status every 2 seconds

  const isFollowing = useFollowerStatus(checkInterval);
  const trackerStatus = useTrackerStatus(checkInterval);
  const {
    imageRef,
    startPos,
    currentPos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useBoundingBoxHandlers(isTracking, setIsTracking);

  // Handler for tracking toggle
  const handleTrackingToggle = async () => {
    if (isTracking) {
      try {
        await fetch(endpoints.stopTracking, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Tracking stopped');
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setIsTracking(!isTracking);
  };

  // Handler for action button click
  const handleButtonClick = async (endpoint, updateTrackingState = false) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log(`Response from ${endpoint}:`, data);

      if (endpoint === endpoints.quit) {
        window.location.reload();  // Reload the page to ensure proper shutdown
      }

      if (updateTrackingState) {
        setIsTracking(false);
      }
    } catch (error) {
      console.error(`Error from ${endpoint}:`, error);
      alert(`Operation failed for endpoint ${endpoint}. Check console for details.`);
    }
  };

  // Effect to check the video stream
  useEffect(() => {
    const checkStream = setInterval(() => {
      const img = new Image();
      img.src = videoFeed;

      img.onload = () => {
        setLoading(false);
        clearInterval(checkStream);
      };

      img.onerror = () => {
        console.error('Error loading video feed');
      };
    }, checkInterval); // Check every 2 seconds

    return () => clearInterval(checkStream);
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">Dashboard</Typography>
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Loading video feed, please wait...
          </Typography>
        </Box>
      ) : (
        <Box>
          <ActionButtons 
            isTracking={isTracking} 
            handleTrackingToggle={handleTrackingToggle} 
            handleButtonClick={handleButtonClick} 
          />
          <StatusIndicator label="Tracking Status" status={trackerStatus} />
          <StatusIndicator label="Follower Status" status={isFollowing} />
          <BoundingBoxDrawer 
            isTracking={isTracking}
            imageRef={imageRef}
            startPos={startPos}
            currentPos={currentPos}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            videoSrc={videoFeed}
          />
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;
