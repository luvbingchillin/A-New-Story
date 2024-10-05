import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const MatcherCards = ({ book, onSwipe }) => {
  // Motion values for dragging
  const motionValue = useMotionValue(0);
  const rotateValue = useTransform(motionValue, [-300, 300], [-10, 10]);

  useEffect(() => {
    console.log(`Book changed: ${book.name}`);
    motionValue.set(0); // Reset motion value when book changes
  }, [book]);

  const handleCardDisappear = (direction) => {
    const offScreenX = direction === 'right' ? 1500 : -1500;

    // Use animate to move the card off the screen
    animate(motionValue, offScreenX, { duration: 0.9 }).then(() => {
      onSwipe(direction); // Trigger the onSwipe callback after animation completes
    });
  };

  return (
    <motion.div
      className="w-1/2 px-[10px] mx-auto h-4/5 border-4 border-red-500 cursor-grab hover:cursor-grabbing rounded-lg"
      drag="x"
      style={{
        x: motionValue, // Link motion value to x
        rotate: rotateValue, // Rotate based on drag 
      }}
      dragConstraints={{ left: -1000, right: 1000 }}
      onDragEnd={(event, info) => {
        const position = motionValue.get(); // Get current x position
        const velocity = info.velocity.x; // Get the velocity of the swipe

        // Check if the swipe was significant enough based on position or speed
        if (Math.abs(position) > 150 || Math.abs(velocity) > 800) {
          // Swipe right or left based on direction
          if (position > 0) {
            handleCardDisappear('right');
          } else {
            handleCardDisappear('left');
          }
        } else {
          // Reset to original position if not swiped far enough or fast enough
          animate(motionValue, 0, { duration: 0.5 });
        }
      }}
    >
      <div className="flex w-full space-x-4 h-full border-green-500 border-4 mt-2">
        <div className="w-2/3">
          <img
            src={book.img}
            className="w-full h-[86%] object-cover"
            alt={book.name}
          />
          <h3 className="text-2xl font-semibold text-center">{book.name}</h3>
          <div className="mt-2 text-xl text-center">By: {book.author_name}</div>
        </div>
        <div className="w-2/5 p-4 border-black border-4">{book.details}</div>
      </div>
    </motion.div>
  );
};

export default MatcherCards;
