import React, {useState, useEffect} from 'react'
import { motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion';

const MatcherCards = ({ book, onSwipe }) => {
    // Motion values for dragging
    const motionValue = useMotionValue(0);
    const rotateValue = useTransform(motionValue, [-300, 300], [-15, 15]);
    const opacityValue = useTransform(motionValue, [-300, 0, 300], [0, 1, 0]);
    useMotionValueEvent(motionValue, "change", (latest) => {
      console.log('motionValue changed to:', latest); // Logs every time motionValue changes
    });

  return (
    <motion.div
      className="w-1/2 pt-[50px] mx-auto h-auto border-4 border-red-500 cursor-grab hover:cursor-grabbing"
      drag="x"
      style={{
        x: motionValue, // Link motion value to x
        rotate: rotateValue, // Rotate based on drag distance
        opacity: opacityValue, // Opacity based on drag distance
      }}
      dragConstraints={{ left: -400, right: 400 }}
      dragElastic={1}
      onDragEnd={(event, info) => {
        if (Math.abs(motionValue.get()) <= 150) {
          // Reset with animation using motionValue's animate method
          motionValue.set(0);
          console.log('reset');}
        else if (motionValue.get()> 200) {
          onSwipe('right');
        } else if (motionValue.get()< -200) {
          onSwipe('left');
        }
      }}
    >
      <h3 className="text-xl font-semibold text-center">{book.author_name}</h3>
      <div>{book.name}</div>
      <img
            src={book.img}
            className="w-1/2 h-1/2"
          />
      <div>{book.details}</div>

    </motion.div>
  );
};

export default MatcherCards