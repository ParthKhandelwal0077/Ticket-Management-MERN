import { Outlet } from 'react-router-dom';
import HomeHeader from './HomeHeader';

const Layout = () => {


  return (
    <div className="min-h-screen bg-primary">
      <HomeHeader />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

     
    </div>
  );
};

export default Layout; 