import React from 'react';
import Slider from 'react-slick';
import Card from './Card';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {FaQuoteRight} from 'react-icons/fa'
/// component for carousel user testi
const Usertesti = () => {
  const settings = {
    dots: false,  
    infinite: true,
    speed: 1000,
    slidesToShow: 3,  
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  const testimonials = [
    {
      title: 'Annie',
      content: `Thanks to Shelfwise, I can confidently walk in a bookstore, grab the perfect book, and pretend I always knew it was a masterpiece. My friends think I’m a reading genius, and I’m okay with that. `,
    },
    {
      title: 'Leo',
      content: `It's kinda neat i guess`,
    },
    {
      title: 'Darius',
      content: `Thanks to this i have found enlightenment and inner peace. Wow amazing`,
    },
    {
      title: 'Alex',
      content: `It's like tinder and goodreads but weirder`,
    },
    {
      title: 'Chris',
      content: `10/10 will try again. I’ve discovered so many great books that now my bookshelf is judging me for not reading fast enough`,
    },
  ];

  return (
    <div className='w-full h-[400px] font-poppins bg-white px-10 py-5'>
      <Slider {...settings}>
        {/* map is used to interate over testimonial (array) */}
        {testimonials.map((testimony, index) => (
          <div className="px-4" key={index}>
            {/*imported card component is the container with hover color as prop passed */}
            <Card hoverBg="hover:bg-gray-100">
              <div>
                <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{testimony.title}</h3>
                {/* improted Quote icon  */}
                <FaQuoteRight className='inline text-lg mb-1'/>
                </div>
                <hr className="border-t-2 border-gray-200 my-2" />{/*horizontal ruler to visually seperate content */}
                <p className="text-sm text-gray-600">{testimony.content}</p>
              </div>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Usertesti;
