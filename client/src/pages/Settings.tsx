import {Form, Formik} from "formik";
import {
    Button,
    TextField
} from "@mui/material";
import React, {useContext} from "react";
import * as yup from "yup";
import UserContext from "./UserContextApi";
import {User, UserDTO} from "../utils/Type";
import {updateUser} from "../utils/Request";
import LinearProgress from "@mui/material/LinearProgress";


const RegisterValidationSchema = yup.object().shape({
    first_name: yup.string().required("Please enter your first name"),
    last_name: yup.string().required("Please enter your last name"),
    email: yup
        .string()
        .email("Please enter a valid email address")
        .matches(/@tip.edu.ph$/, "Only TIP accounts are allowed")
        .required("Please enter a valid email address"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])/,
            "Password must contain one lowercase letter & one uppercase letter"
        )
        // Must contain at least one number
        .matches(/^(?=.*\d)/, "Password must contain at least one number"),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .when('password', {
            is: (password: string | undefined | null) => password && password.length > 0,
            then: yup.string().required("Please confirm password")
        })


});

const Settings = () => {
    const user = useContext(UserContext)

    if (!user) {
        return (
            <div className="flex flex-col w-full min-h-screen">
                <LinearProgress/>
            </div>
        );
    }

    return (
        <div className="w-full h-auto min-h-screen">
            <div className="flex flex-col rounded-lg p-8 bg-white  max-w-[767px] divide-y mb-10">
                <Formik
                    initialValues={{
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        password: '',
                        password_confirmation: ''
                    }}
                    onSubmit={async (values, {setSubmitting}) => {
                        let userValues: UserDTO = {
                            id: user.id,
                            first_name: values.first_name,
                            last_name: values.last_name,
                            email: values.email,
                        }
                        if (values.password !== '') {
                            userValues.password = values.password
                        }

                        const response = await updateUser(userValues);
                        setSubmitting(false);
                        if (response.status === 200) {
                            // gets the feedback from backend
                            const user = response.data as User;
                            // view the created course
                            window.location.reload();
                        }


                    }}

                    validationSchema={RegisterValidationSchema}
                >
                    {({isSubmitting, values, handleChange, errors, dirty}) => (
                        <Form className="flex flex-col rounded-lg p-10 space-y-4 bg-white max-w-[767px]">
                            <h2 className="block text-xl font-bold text-amber-400 mb-2">
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-6 gap-6">
                                {/*Input for course code*/}
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    value={values.first_name}
                                    name="first_name"
                                    className="col-start-1 col-span-full"
                                    error={!!errors.first_name}
                                    helperText={errors.first_name ?? " "}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    className="col-start-1 col-span-full"
                                    name="last_name"
                                    value={values.last_name}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name ?? " "}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Email Address"
                                    variant="outlined"
                                    name="email"
                                    value={values.email}
                                    error={!!errors.email}
                                    helperText={errors.email ?? " "}
                                    onChange={handleChange}
                                    className="col-start-1 col-span-full"
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    name="password"
                                    error={!!errors.password}
                                    helperText={errors.password ?? " "}
                                    type="password"
                                    onChange={handleChange}
                                    className="col-start-1  col-span-full sm:col-span-3"
                                />
                                <TextField
                                    label="Confirm Password"
                                    variant="outlined"
                                    name="password_confirmation"
                                    error={!!errors.password_confirmation}
                                    helperText={errors.password_confirmation ?? " "}
                                    type="password"
                                    onChange={handleChange}
                                    className="col-start-1 col-span-full sm:col-start-4 sm:col-span-3"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button variant="contained"
                                        className="flex space-x-4 w-32 h-10 font-bold bg-neutral-700 hover:bg-neutral-600"
                                        type="submit"
                                        disabled={isSubmitting || !dirty}
                                >
                                    Update
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>


        </div>
    );


}


export default Settings;