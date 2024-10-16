import React, { useContext } from 'react';
import MatcherBT from '../components/MatcherBT';
import Usertesti from '../components/Usertesti';
import '../index.css'; 
import { AuthContext } from '../Context/AuthContext';


const HomePage = ({handleOpenModal}) => {
  const { loggedIn} = useContext(AuthContext);

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
