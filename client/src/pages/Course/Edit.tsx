import {
    Alert,
    CircularProgress,
    FormGroup,
    FormHelperText,
    TextareaAutosize,
    TextField,
} from "@mui/material";
import {Button} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {Link, useParams} from "react-router-dom";
import {Formik, Form} from "formik";
import {updateCourse, getCourseById} from "../../utils/Request";
import {useNavigate} from "react-router-dom";
import {Course} from "../../utils/Type";
import React, {useEffect, useState} from "react";
import * as yup from "yup";
import BreadCrumbs from "../Shared/Breadcrumbs";
import LinearProgress from "@mui/material/LinearProgress";

const CourseUpdateValidationSchema = yup.object().shape({
    code: yup
        .string()
        // Must be letters followed by numbers
        .matches(
            /^[A-Z]+([0-9]+[A-Z]*)$/,
            "Please enter a valid course code (e.g. CS101 & MATH001A)"
        )
        .required("Please enter a course code"),
    title: yup.string().required("Please enter a course name"),
    description: yup
        .string()
        .max(512, "Description cannot be more than 512 characters"),
});

const Edit = () => {
    const params = useParams();
    const [course, setCourse] = useState<Course | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        const setup = async () => {
            if (params.id) {
                const response = await getCourseById(params.id);
                if (response.status === 200) {
                    setCourse(response.data as Course);
                }
            }
        };
        setup();
    }, []);

    const [message, setMessage] = useState<string | null>(null);
    if (!course) {
        return (
            <div className="flex flex-col w-full min-h-screen">
                <LinearProgress/>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/*breadcrumbs*/}
            <BreadCrumbs link="/" pageTitle="Edit Course"/>

            <Formik
                initialValues={{
                    code: course.code,
                    title: course.title,
                    description: course.description,
                }}
                onSubmit={async (values, {setSubmitting, setFieldError}) => {
                    const response = await updateCourse(course.id, values);
                    setSubmitting(false);
                    if (response.status === 200) {
                        const course = response.data as Course;
                        navigate(`/courses/${course.id}`);
                    }
                    if (response.status >= 500) {
                        setMessage("Something went wrong. Please try again");
                        return;
                    }
                    setMessage(null);
                    setFieldError("code", "A course with this code already exists");
                }}
                validationSchema={CourseUpdateValidationSchema}
            >
                {({isSubmitting, values, handleChange, dirty, errors}) => (
                    <Form className="flex flex-col rounded-lg p-10 space-y-4 bg-white max-w-[767px]">
                        <h2 className="block font-bold text-2xl text-amber-400 mb-4">
                            Course Information
                        </h2>
                        {message && <Alert severity="error">{message}</Alert>}
                        <div className="grid grid-cols-6 gap-10">
                            <TextField
                                id="outlined-basic"
                                label="Course Code"
                                variant="outlined"
                                className="col-start-1 col-span-4 md:col-span-2 rounded-lg"
                                name="code"
                                value={values.code}
                                onChange={handleChange}
                                helperText={errors.code}
                                error={!!errors.code}
                            />

                            <TextField
                                id="outlined-basic"
                                label="Course Title"
                                variant="outlined"
                                className="col-start-1 col-span-full"
                                name="title"
                                value={values.title}
                                onChange={handleChange}
                                helperText={errors.title}
                                error={!!errors.title}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Course Description"
                                variant="outlined"
                                className="col-start-1 col-span-full"
                                name="description"
                                error={!!errors.description}
                                helperText={errors.description}
                                value={values.description}
                                onChange={handleChange}
                                minRows={6}
                                maxRows={6}
                                multiline
                            />

                            <div className="col-span-full flex justify-end space-x-5">
                                <Link to={`../../${course.id}`}>
                                    <Button
                                        variant="contained"
                                        className="flex space-x-4 w-36 h-12 bg-neutral-light-200 hover:bg-orange-400 hover:text-white text-neutral-light-700 font-bold"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    variant="contained"
                                    className="flex space-x-4 w-36 h-12 font-bold bg-main-700 hover:bg-iris-300 disabled:bg-red"
                                    type="submit"
                                    disabled={isSubmitting || !dirty}
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Edit;
