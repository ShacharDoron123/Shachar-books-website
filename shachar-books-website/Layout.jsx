import { Navbar } from "./src/components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./src/components/Footer";
import Header from "./src/components/Header";
export function Layout(){
    return(
        <>
        <div className="color">
          <Navbar/>
          <Header/>
        </div>
        <main>
            <Outlet/>
        </main>
        <div className="color">
            <Footer/>
        </div>
        </>
    );
}