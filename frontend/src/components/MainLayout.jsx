import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
   return (
    <div className="flex">
      {/* Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-[240px]">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout