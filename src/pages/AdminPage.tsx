import { Outlet } from "react-router-dom";
import Sidebar from "../components/commons/Sidebar";

export default function AdminPage() {
  return ( 
    <div className="min-h-screen w-full font-[inter] bg-gray-50 select-none flex flex-row">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
