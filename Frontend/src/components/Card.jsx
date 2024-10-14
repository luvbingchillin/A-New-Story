import React from 'react';

const Card = ({children, hoverBg = 'hover:bg-gray-200'}) => {
  return (
    <div className={`bg-white h-[280px] p-6 rounded-lg shadow-lg transition-colors shadow-lg hover:shadow-2xl transition-shadow border border-gray-300 duration-300 mt-8 ${hoverBg}`}>
      {children}
      {/**children prop will contain the content between the opening (<Card>) and closing (</Card>) tags. */}
    </div>
  );
}

export default Card;
