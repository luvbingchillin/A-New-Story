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
    autoplaySpeed: 4000,
  };

  const testimonials = [
    {
      title: 'Magdalena & Annie',
      content: `I had just gotten out of a relationship, and Annie had just started dating women so we were both nervous and treading lightly for a little bit! We both fell hard and fast and knew we had found our person fairly quickly.`,
    },
    {
      title: 'Shannon & Julian',
      content: `I was feeling lonely back in my hometown because most of my friends had started romantic relationships while I was abroad. We both decided to download Tinder and see what happened.`,
    },
    {
      title: 'Courtney & Miranda',
      content: `Thanks to Tinder I have found the love of my life and we are to be married. After going on a few dates and having a few fun nights I came across Miranda.`,
    },
    {
      title: 'Alex & Jamie',
      content: `We connected on Tinder and instantly hit it off. We’ve been together ever since, and I couldn't imagine my life without Jamie!`,
    },
    {
      title: 'Chris & Taylor',
      content: `We met on Tinder and we are so thankful for the app bringing us together. We now share our lives and have never been happier.`,
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
