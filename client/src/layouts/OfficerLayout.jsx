import { Outlet } from "react-router-dom";
import OfficerSidebar from "../components/OfficerSidebar";
import "./OfficerLayout.css";

export default function OfficerLayout(){

    return(

        <div className="officer-layout">

            <OfficerSidebar/>

            <main className="officer-main">

                <Outlet/>

            </main>

        </div>

    );

}