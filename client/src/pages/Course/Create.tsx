import {Alert, TextareaAutosize, TextField} from "@mui/material";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import {Formik, Form} from "formik";
import {createCourse} from "../../utils/Request";
import {useNavigate} from "react-router-dom";
import {Course} from "../../utils/Type";
import * as yup from "yup";
import React, {useState} from "react";
import BreadCrumbs from "../Shared/Breadcrumbs";

const CourseCreateValidationSchema = yup.object().shape({
    code: yup
        .string()
        // Must be letters followed by numbers
        .matches(
            /^[A-Z]+([0-9]+[A-Z]*)$/,
            "Please enter a valid course code (e.g. CS101 & MATH001A)"
        )
        .required("Please enter a course code"),
    title: yup.string().required("Please enter a course name"),
    description: yup.string().max(512, "Description cannot be more than 512 characters"),
});

const Create = () => {
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    return (
        <div className="h-screen flex flex-col">
            <BreadCrumbs link="/" pageTitle="Add New Course"/>
            <Formik
                initialValues={{code: "", title: "", description: ""}}
                validationSchema={CourseCreateValidationSchema}
                onSubmit={async (values, {setSubmitting, setFieldError}) => {
                    const response = await createCourse(values);
                    setSubmitting(false);
                    if (response.status === 200) {
                        // gets the feedback from backend
                        const course = response.data as Course;
                        // view the created course
                        navigate(`/courses/${course.id}`);
                        return;
                    }
                    if (response.status >= 500) {
                        setMessage("Something went wrong. Please try again");
                        return;
                    }
                    setMessage(null);
                    setFieldError("code", "A course with this code already exists");
                }}
            >
                {({isSubmitting, values, errors, handleChange}) => (
                    <Form className="flex flex-col rounded-lg p-10 space-y-4 bg-white max-w-[767px]">
                        <h2 className="block font-bold text-2xl text-amber-400 mb-4">
                            Course Information
                        </h2>
                        {message && <Alert severity="error">{message}</Alert>}
                        <div className="grid grid-cols-6 gap-10">
                            {/*Input for course code*/}
                            <TextField
                                id="outlined-basic"
                                label="Course Code"
                                variant="outlined"
                                className="col-start-1 col-span-4 md:col-span-2 rounded-lg"
                                name="code"
                                error={!!errors.code}
                                helperText={errors.code}
                                value={values.code}
                                onChange={handleChange}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Course Title"
                                variant="outlined"
                                className="col-start-1 col-span-full"
                                name="title"
                                error={!!errors.title}
                                helperText={errors.title}
                                value={values.title}
                                onChange={handleChange}
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
                                <Link to="/">
                                    <Button
                                        variant="contained"
                                        className="flex space-x-4 w-36 h-12 bg-neutral-light-200 hover:bg-orange-400 hover:text-white text-neutral-light-700 font-bold"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    variant="contained"
                                    className="flex space-x-4 w-36 h-12 font-bold bg-neutral-700 hover:bg-neutral-600"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Add Course
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Create;
