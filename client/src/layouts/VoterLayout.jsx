import { Outlet } from "react-router-dom";

import Sidebar from "../components/Voter/Sidebar";

export default function VoterLayout() {

    return (

        <div style={{display:"flex"}}>

            <Sidebar />

            <div
                style={{
                    marginLeft:"260px",
                    width:"100%",
                    padding:"35px",
                    background:"#eef3fb",
                    minHeight:"100vh"
                }}
            >
                <Outlet />
            </div>

        </div>

    );

}