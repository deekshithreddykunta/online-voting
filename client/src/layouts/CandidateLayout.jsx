import { Outlet } from "react-router-dom";

import CandidateSidebar from "../components/CandidateSidebar";

export default function CandidateLayout() {

    return (

        <div style={{ display: "flex" }}>

            <CandidateSidebar />

            <div
                style={{
                    marginLeft: "260px",
                    width: "100%",
                    padding: "35px",
                    background: "#eef3fb",
                    minHeight: "100vh"
                }}
            >
                <Outlet />
            </div>

        </div>

    );

}