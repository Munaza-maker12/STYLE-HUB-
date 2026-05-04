
import { useNavigate } from "react-router-dom";


import NewArrivals from "./NewArrival";
import Catagory from "./Catagory";
import Hero from "./Hero";
import PromoBanner from "./Banner";

const Home = () => {
 

  return (
    <div>
      <Hero/>
     
      <Catagory/>
      <NewArrivals/>
      <PromoBanner/>
    </div>
  );
};

export default Home;



