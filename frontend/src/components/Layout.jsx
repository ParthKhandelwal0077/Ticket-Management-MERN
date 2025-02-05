import { Outlet } from 'react-router-dom';

const Layout = () => {


  return (
    <div className="min-h-screen bg-primary">

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

     
    </div>
  );
};

export default Layout; 