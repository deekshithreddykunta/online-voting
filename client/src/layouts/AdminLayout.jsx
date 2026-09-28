import Sidebar from "../components/Admin/Sidebar";

import { Outlet } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}