import {Avatar} from "@mui/material";
import {Link} from "react-router-dom";
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import GridViewIcon from "@mui/icons-material/GridView";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from "react";
import {User} from "../../utils/Type";

interface SideBarProps {
    user: User
}

const SideBar: React.FC<SideBarProps> = ({user}) => {

    const isCreateQuiz = window.location.pathname.includes("/create-quiz");
    const isSettings = window.location.pathname.includes("/settings");
    const isAbout = window.location.pathname.includes("/about");
    const isMyCourses = !isCreateQuiz && !isSettings && !isAbout;

    return (
        <div
            className="xs:hidden sm:inline-block min-w-[250px] divide-y border border-1 min-h-full bg-stone-100">
            <div className="flex flex-col items-center w-full py-8 space-y-1">
                <Avatar
                    sx={{
                        backgroundColor: "#FFDE59",
                        height: 75,
                        width: 75,
                        border: 2,
                    }}>{user && user.first_name[0] + user.last_name[0]}</Avatar>
                <h6 className="font-bold text-2xl">{user.first_name}</h6>
            </div>
            <div className="w-full py-3 flex flex-col gap-y-2 px-4 text-neutral-700">
                <Link to={"/"}>
                    <button
                        className={`flex items-center space-x-4 w-full p-3 ${isMyCourses && "bg-amber-100 text-amber-500 font-bold"}`}>
                        <DashboardCustomizeOutlinedIcon className={`h-7 w-7 ${isMyCourses ? "fill-amber-500" : "fill-neutral-700"}`}/>
                        <p className="text-lg pl-3">
                            My Courses
                        </p>
                    </button>
                </Link>
                <Link to={"/create-quiz"}>
                    <button
                        className={`flex items-center space-x-4 w-full p-3 ${isCreateQuiz && "bg-amber-100 text-amber-500 font-bold"}`}>
                        <GridViewIcon className={`h-7 w-7 ${isCreateQuiz ? "fill-amber-500" : "fill-neutral-700"}`}/>
                        <p className="text-lg pl-3">
                            Create Quiz
                        </p>
                    </button>
                </Link>
            </div>
            <div className="w-full py-3 flex flex-col gap-y-2 px-4 text-neutral-700">
                <Link to={"/about"}>
                    <button
                        className={`flex items-center space-x-4 w-full p-3 ${isAbout && "bg-amber-100 text-amber-500 font-bold"}`}>
                        <InfoOutlinedIcon className={`h-7 w-7 ${isAbout ? "fill-amber-500" : "fill-neutral-700"}`}/>
                        <p className="text-lg pl-3">
                            About
                        </p>
                    </button>
                </Link>
                <Link to={"/settings"}>
                    <button
                        className={`flex items-center space-x-4 w-full p-3 ${isSettings && "bg-amber-100 text-amber-500 font-bold"}`}>
                        <SettingsOutlinedIcon
                            className={`h-7 w-7 ${isSettings ? "fill-amber-500" : "fill-neutral-700"}`}/>
                        <p className="text-lg pl-3">
                            Settings
                        </p>
                    </button>
                </Link>
            </div>
        </div>
    );
}


export default SideBar;