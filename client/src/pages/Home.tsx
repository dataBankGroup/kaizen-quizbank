import LinearProgress from "@mui/material/LinearProgress";
import {Button} from '@mui/material';
import {Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Course} from "../utils/Type";
import {getCourses} from "../utils/Request";
import Index from "./Course/Index";
import UserContext from "./UserContextApi";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';


const Home = () => {
    const [courses, setCourses] = useState<Course[] | undefined>();
    const user = useContext(UserContext)


    useEffect(() => {
        const setup = async () => {
            // setting up the data by requesting the courses from backend
            const response = await getCourses();
            if (response.status === 200) {
                setCourses(response.data as Course[]);
            }
        }
        setup();
    }, [])

    if (!courses || !user) {
        return (
            <div className="flex flex-col w-full min-h-screen">
                <LinearProgress/>
            </div>
        );
    }

    return (
        <div className="min-h-screen h-auto w-full relative">
            <div className="block flex w-full justify-end mb-8">
                <Link to="/courses/create">
                    <Button
                        variant="contained"
                        className="bg-white z-50 hover:bg-amber-400 hover:text-white flex space-x-2 fixed bottom-10 right-8 rounded-full text-neutral-700 text-lg px-5"
                        sx={{height: 50}}
                    >
                        <AddIcon/>
                        <p className="font-bold text-xl">
                            Create
                        </p>
                    </Button>
                </Link>
            </div>


            <Index courses={courses} userId={user.id}/>

        </div>
    )
}

export default Home