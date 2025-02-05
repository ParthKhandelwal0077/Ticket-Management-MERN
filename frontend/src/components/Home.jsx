import { Outlet } from "react-router-dom";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

const Home = () => {
  return (  
    <>
      <HomeHeader />
      <Outlet />
      <HomeFooter />
    </>
  )
}

export default Home
