import React, { useState } from 'react';
import MatcherBT from '../components/MatcherBT';
import Usertesti from '../components/Usertesti';
import '../index.css'; 


const HomePage = ({loggedIn, handleOpenModal}) => {

  return (
    <div
    >
      {/*pass in handleOpenModal to update state of showModal and re-render */}
      <MatcherBT loggedIn={loggedIn} handleOpenModal={handleOpenModal}/>
      <Usertesti />

    </div>
  );
};

export default HomePage;
