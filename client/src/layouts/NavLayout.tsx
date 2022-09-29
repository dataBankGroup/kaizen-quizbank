import {Outlet, Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {User} from "../utils/Type";
import {getCurrentUser} from "../utils/Request";
import {CircularProgress} from "@mui/material";
import UserContext from "../pages/UserContextApi";
import Footer from "../pages/Shared/Footer";
import NavigationBar from "../pages/Shared/NavigationBar";
import SideBar from "../pages/Shared/SideBar";

const NavLayout = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        const setup = async () => {
            const response = await getCurrentUser();
            if (response.status === 200) {
                console.log("user loaded?")
                setUser(response.data as User);
            } else {
                navigate("/login")
            }
        }
        setup();

    }, [])

    if (!user) {
        return (
          <div className="flex flex-col w-full min-h-screen">
              <CircularProgress/>
          </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen">
            <NavigationBar/>
            <div className="flex justify-left bg-[#E5E5E5] mt-[60px]">
                <SideBar user={user}/>
                <UserContext.Provider value={user}>
                    <div className="w-full p-4 sm:p-12 bg-scroll bg-stone-200">
                        <Outlet/>
                    </div>
                </UserContext.Provider>
            </div>
            <Footer/>
        </div>
    );
};

export default NavLayout;
