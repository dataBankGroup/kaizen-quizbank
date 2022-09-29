import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {logoutUser} from "../../utils/Request";
import {removeCookie} from "typescript-cookie";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';

const NavigationBar = () => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const logout = async () => {
        const response = await logoutUser();
        if (response.status == 200 || response.status == 401) {
            removeCookie("testBankIsLogged")
            navigate("/login")
        }
    }

    const route = (link: string) => {

        setOpen(false)
        navigate(link)
    }

    return (
        <header
            className="h-auto w-full flex flex-col fixed z-50">
            <div
                className="flex items-center justify-between w-full h-[60px] px-4 sm:px-10 border-b-2 border-white bg-gradient-to-r from-yellow-400 to-yellow-600">
                <Link to={"/"}>
                    <div className="flex items-center  ">
                        <img className="h-auto w-16" src="/tiplogo.png" alt=""/>
                        <p className="text-2xl font-bold font-mono text-white px-2">
                            QUIZ
                        </p>
                        <img className="h-10 w-10" src="/logo.png" alt=""/>
                        <p className="text-2xl font-bold font-mono text-white px-2">
                             BANK
                        </p>


                    </div>
                </Link>
                <button
                    className="hidden sm:inline-block text-neutral-700 font-semibold text-sm bg-stone-50 py-2 px-4 rounded-[20px] hover:text-amber-500"
                    onClick={logout}>
                    LOGOUT &nbsp;
                    <LogoutIcon className="h-4"/>
                </button>
                <button
                    className="sm:hidden"
                    onClick={() => setOpen(prev => !prev)}
                >
                    {
                        open ? <MenuOpenOutlinedIcon className="h-10 fill-white"/> :
                            <MenuOutlinedIcon className="h-10 fill-white"/>
                    }
                </button>
            </div>
            {open &&
                <div
                    className="absolute top-[60px] left-0 z-50 w-full bg-stone-50 sm:hidden flex flex-col text-sm font-mono text-neutral-700">
                    <ul className="">
                        <button
                            className="p-2 w-full text-center hover:bg-indigo-200 hover:text-neutral-700 hover:font-semibold border-b-2 border-gray uppercase"

                            onClick={() => route("/")}
                        >
                            My Courses
                        </button>
                        <button
                            className="p-2 w-full text-center hover:bg-indigo-200 hover:text-neutral-700 hover:font-semibold border-b-2 border-gray uppercase"
                            onClick={() => route("/create-quiz")}
                        >
                            All Courses
                        </button>
                        <button
                            className="p-2 w-full text-center hover:bg-indigo-200 hover:text-neutral-700 hover:font-semibold border-b-2 border-gray uppercase"
                            onClick={() => route("/about")}
                        >
                            About
                        </button>
                        <button
                            className="p-2 w-full text-center hover:bg-indigo-200 hover:text-neutral-700 hover:font-semibold border-b-2 border-gray uppercase"
                            onClick={() => route("/settings")}
                        >
                            Settings
                        </button>
                        <button
                            className="p-2 w-full text-center hover:bg-indigo-200 hover:text-neutral-700 hover:font-semibold border-b-2 border-gray uppercase"
                            onClick={() => logout()}
                        >
                            Logout
                        </button>
                    </ul>
                </div>
            }

        </header>
    );
}

export default NavigationBar;