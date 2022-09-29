import React, {useContext, useState} from "react";
import {Form, Formik} from "formik";
import {createAssessment, createCourse, queryCourse} from "../utils/Request";
import {Assessment, Course, Question, Topic} from "../utils/Type";
import {
    Button, Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import UserContext from "./UserContextApi";
import LinearProgress from "@mui/material/LinearProgress";
import {useNavigate} from "react-router-dom";


interface TopicQuery {
    id: string;
    name: string;
    course_id: string;
    questions: Question[]
    code?: string;
}


const AllCourses = () => {

    const [topics, setTopics] = useState<TopicQuery[] | undefined>();
    const navigate = useNavigate();

    const user = useContext(UserContext);

    if (!user) {
        return (
            <div className="flex flex-col w-full min-h-screen">
                <LinearProgress/>
            </div>
        );
    }

    return (
        <div className="w-full h-auto min-h-screen">
            <div className="flex flex-col rounded-lg  w-full divide-y mb-10">
                <Formik
                    initialValues={{code: '', title: '', topic: ''}}
                    onSubmit={async (values, {setSubmitting}) => {
                        let queryString = "?"
                        if (values.code !== '') {
                            queryString += `code=${values.code}`
                        }
                        if (values.title !== '') {
                            queryString += `&&title=${values.title}`
                        }

                        const response = await queryCourse(queryString);
                        setSubmitting(false);
                        if (response.status === 200) {
                            // gets the feedback from backend
                            const courses = response.data as Course[];
                            let responseTopics = [] as TopicQuery[][];

                            courses.map(course => responseTopics.push(course.topics.map(topic => {
                                return {...topic, code: course.code}
                            })))

                            let flattenedTopics = responseTopics.flat(1)

                            setTopics(flattenedTopics.filter(topic => topic.name.toLowerCase().includes(values.topic.toLowerCase())))
                        }

                    }}
                >
                    {({isSubmitting, values, handleChange}) => (
                        <Form className="flex flex-col rounded-lg p-10 space-y-4 bg-white max-w-[1000px] ">
                            <h2 className="block text-xl font-bold text-amber-400 mb-2">
                                Test Bank Search
                            </h2>
                            <div className="grid grid-cols-6 gap-6">
                                {/*Input for course code*/}
                                <TextField id="outlined-basic"
                                           label="Course Code"
                                           variant="outlined"
                                           className="col-start-1 col-span-4 md:col-span-2 rounded-lg"
                                           name="code"
                                           value={values.code}
                                           onChange={handleChange}
                                />
                                <TextField id="outlined-basic"
                                           label="Course Title"
                                           variant="outlined"
                                           className="col-start-1 col-span-full"
                                           name="title"
                                           value={values.title}
                                           onChange={handleChange}
                                />
                                <TextField id="outlined-basic"
                                           label="Topic"
                                           variant="outlined"
                                           className="col-start-1 col-span-full"
                                           name="topic"
                                           value={values.topic}
                                           onChange={handleChange}
                                />
                            </div>
                            <div className="flex  w-full items-center justify-between pt-4">
                                <Button variant="contained"
                                        className="flex space-x-4 w-32 h-10 font-bold bg-neutral-700 hover:bg-neutral-600"
                                        type="submit"
                                        disabled={isSubmitting}
                                >
                                    Search
                                </Button>


                            </div>
                        </Form>
                    )}
                </Formik>

            </div>

            {
                topics && (
                    topics.length === 0 ?
                        <div className="w-full flex flex-col justify-center items-center  max-w-[1000px]">
                            <p className="text-xl font-semibold text-amber-500">
                                No topics found!
                            </p>

                        </div>
                        :
                        <Formik
                            initialValues={{
                                name: '',
                                user_id: user?.id,
                                topics: [],
                            }}
                            onSubmit={async (values, {setSubmitting}) => {
                                const response = await createAssessment(values);
                                setSubmitting(false);
                                if (response.status === 200) {
                                    // gets the feedback from backend
                                    const assessment = response.data as Assessment;
                                    navigate(`/create-quiz/${assessment.id}`);
                                    return;
                                }
                            }}
                        >
                            {({isSubmitting, values, handleChange, setFieldValue}) => (
                                <Form>
                                    <TableContainer component={Paper} className="w-full max-w-[1000px]">
                                        <Table sx={{minWidth: 650}} aria-label="simple table">
                                            <TableHead style={{background: "#F9F9FA"}}>
                                                <TableRow>
                                                    <TableCell style={{width: 150, fontWeight: "bold"}}>Course
                                                        Code</TableCell>
                                                    <TableCell style={{fontWeight: "bold"}} align="left">Topic</TableCell>
                                                    <TableCell style={{fontWeight: "bold", paddingRight: 30}}
                                                               align="right">Add Topic</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {topics.map((topic, index) => (
                                                    <TableRow
                                                        key={topic.id}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {topic.code}
                                                        </TableCell>
                                                        <TableCell align="left"
                                                                   style={{fontStyle: "italic"}}
                                                                   className="truncate text-ellipsis max-w-[180px]">{topic.name}</TableCell>
                                                        <TableCell align="right" className="flex items-center gap-x-2">
                                                            <Checkbox
                                                                color="success"
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    if (checked) {
                                                                        setFieldValue("topics", [...values.topics, topic])
                                                                    } else {
                                                                        setFieldValue("topics", (values.topics as Topic[]).filter(t => t.id !== topic.id))
                                                                    }
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>


                                        </Table>
                                    </TableContainer>
                                    <div className="flex justify-end max-w-[1000px] mt-5 gap-x-4 ">
                                        <Button variant="contained"
                                                className="flex space-x-4 w-36 h-12 font-bold bg-neutral-700 hover:bg-neutral-600"
                                                type="submit"
                                                disabled={isSubmitting || values.topics.length === 0}
                                        >
                                            Proceed Quiz
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                )
            }


        </div>
    );
}

export default AllCourses;