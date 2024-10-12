// dashboard/src/components/BoundingBoxDrawer.js
import React from 'react';
import WebRTCStream from './WebRTCStream';

const BoundingBoxDrawer = ({
  isTracking,
  imageRef,
  startPos,
  currentPos,
  boundingBox,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  videoSrc,
  protocol, // Added protocol prop
}) => {
  return (
    <div
      ref={imageRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        touchAction: 'none', // Prevent touch scrolling
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <WebRTCStream protocol={protocol} src={videoSrc} />
      {((startPos && currentPos) || boundingBox) && (
        <div
          style={{
            position: 'absolute',
            border: '2px dashed red',
            left: boundingBox
              ? boundingBox.left
              : Math.min(startPos.x, currentPos.x),
            top: boundingBox
              ? boundingBox.top
              : Math.min(startPos.y, currentPos.y),
            width: boundingBox
              ? boundingBox.width
              : Math.abs(currentPos.x - startPos.x),
            height: boundingBox
              ? boundingBox.height
              : Math.abs(currentPos.y - startPos.y),
          }}
        />
      )}
    </div>
  );
};

export default BoundingBoxDrawer;
