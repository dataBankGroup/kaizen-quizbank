import {
    Avatar,
    Button, CircularProgress,
} from "@mui/material";
import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {getCourseById, getAllUsers} from "../../utils/Request";
import {Course, Topic, User} from "../../utils/Type";
import CreateTopic from "../Topic/Create";
import EditIcon from "@mui/icons-material/Edit";
import Index from "../Topic/Index";
import BreadCrumbs from "../Shared/Breadcrumbs";
import DestroyCourse from "./Destroy"


import {useContext} from "react";
import UserContext from "../UserContextApi";
import AuthorUpdate from "./AuthorUpdate";
import {deepPurple} from "@mui/material/colors";
import LinearProgress from "@mui/material/LinearProgress";


interface DetailsProps {
    course: Course,
    updateAuthorState: (updatedCourse: Course) => void,
    user: User,
    users: User[],
}

const CourseDetails: React.FC<DetailsProps> = ({course}) => {
    return (
        <div className="flex flex-col rounded-lg p-8 bg-white w-full max-w-[562px] divide-y">
            <div className="flex justify-between ">
                <h2 className="block font-bold text-amber-400 mb-2 text-xl">
                    Course Details
                </h2>
                {/* Edit course BUTTON*/}
                <Link to={`../edit/${course.id}`}>
                    <Button variant="outlined"
                            className="flex items-center border-amber-400 gap-x-1 max-w-[20px] text-xs max-h-6 text-amber-400 capitalize">
                        <EditIcon className="h-4"/>
                        Edit
                    </Button>
                </Link>

            </div>
            <div className="flex flex-col space-y-5 pt-4">
                <div>
                    <p className="text-sm text-neutral-light-700">
                        Course Code
                    </p>
                    <p >
                        {course.code}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-neutral-light-700 ">
                        Course Title
                    </p>
                    <p className="">
                        {course.title}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-neutral-light-700">
                        Course Description
                    </p>
                    <p className=" italic break-words">
                        {course.description}
                    </p>
                </div>
            </div>
        </div>
    );
}


const UserDetails: React.FC<DetailsProps> = ({course, updateAuthorState, user, users}) => {
    return (
        <div className="flex flex-col rounded-lg p-8 bg-white min-w-[361px]">
            <h2 className="block font-bold text-amber-400 text-xl">
                Collaborators
            </h2>
            <div className="flex flex-col space-y-5 pt-3 text-sm ">
                <div className="divide-y space-y-1">
                    <p className="font-semibold text-lg">
                        Primary Author
                    </p>
                    <div className="flex items-center pl-2 space-x-4 pt-3">
                        <Avatar sx={{
                            backgroundColor: "#FFDE59",
                            width: 35,
                            height: 35,
                            fontSize: 15
                        }}>{course.primary_author.first_name[0] + course.primary_author.last_name[0]}</Avatar>
                        <p className="text-lg">
                            {course.primary_author.first_name + " " + course.primary_author.last_name}
                        </p>
                    </div>
                </div>
                <div className="divide-y space-y-1">
                    <p className="block font-semibold text-lg">
                        Co-Authors
                    </p>
                    <div>
                        {course.co_authors.map((author) => {
                            return (
                                <div className="block flex px-2 space-x-4 pt-3 justify-between">
                                    <div className="inline-flex items-center space-x-4">
                                        <Avatar sx={{
                                            backgroundColor: "#FFDE59",
                                            width: 35,
                                            height: 35,
                                            fontSize: 15
                                        }}>{author.first_name[0] + author.last_name[0]}</Avatar>
                                        <p className="text-lg">
                                            {author.first_name + " " + author.last_name}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {user.id === course.primary_author.id &&
                    <div className="flex justify-end">
                        <AuthorUpdate users={users} course={course} updateAuthorState={updateAuthorState}/>
                    </div>
                }
            </div>
        </div>
    );
}


const View = () => {

    const params = useParams();
    const [course, setCourse] = useState<Course | undefined>();
    const [users, setUsers] = useState<User[] | undefined>();
    const user = useContext(UserContext)

    useEffect(() => {
        const setup = async () => {
            if (params.id) {
                const response = await getCourseById(params.id);
                if (response.status === 200) {
                    setCourse(response.data as Course);
                }
                const indexResponse = await getAllUsers();
                if (indexResponse.status === 200) {
                    setUsers(indexResponse.data as User[]);
                }
            }
        }
        setup();
    }, [])

    if (!course || !user || !users) {
        return (
            <div className="flex flex-col w-full min-h-screen">
                <LinearProgress/>
            </div>
        );
    }

    const updateTopicState = (topic: Topic) => {
        const index = course.topics.findIndex(t => t.id === topic.id);
        if (index >= 0) {
            const topics = course.topics;
            topics[index].name = topic.name
            setCourse({...course, topics: topics});
        }
    }

    const deleteTopicState = (topic: Topic) => {
        const topics = course.topics.filter(t => t.id !== topic.id);
        setCourse({...course, topics: topics});
    }

    const updateAuthorState = (updatedCourse: Course) => {
        setCourse(updatedCourse)
    }


    return (
        <div className="min-w-full h-auto min-h-screen flex flex-col">

            <BreadCrumbs link="/" pageTitle={course.title}/>

            <div className="flex flex-wrap justify-center sm:justify-start gap-16 text-shades-text-100 mb-16">
                <CourseDetails course={course} user={user} users={users} updateAuthorState={updateAuthorState}/>
                <UserDetails course={course} user={user} users={users} updateAuthorState={updateAuthorState}/>
            </div>

            <div className="flex flex-col gap-y-7">
                <div className="flex justify-between">
                    <CreateTopic/>
                    <p>
                        {/*search*/}
                    </p>
                </div>

                <Index topics={course.topics} updateTopicState={updateTopicState} deleteTopicState={deleteTopicState}
                       permission={user.id === course.primary_author.id}/>

                {user.id === course.primary_author.id &&
                    <div className="flex justify-end max-w-[1000px]">
                        <DestroyCourse course={course}/>
                    </div>
                }


            </div>


        </div>


    )
}

export default View;