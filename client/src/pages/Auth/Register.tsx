import {Alert, Button, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Form, Formik} from "formik";
import {createUser} from "../../utils/Request";
import {User} from "../../utils/Type";
import React, {useEffect, useState} from "react";
import * as yup from "yup";
import Footer from "../Shared/Footer";
import {getCookie} from "typescript-cookie";

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
        .matches(/^(?=.*\d)/, "Password must contain at least one number")
        .required("Please enter a password"),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required("Please confirm password"),
});

const RegisterBox = () => {
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    return (
        <div className="bg-amber-100 w-96 h-auto space-y-5 p-4 sm:p-8 border-2 border-white">
            <div className=" flex flex-col space-y-2 font-mono">
                <h1 className="font-bold text-2xl">Registering to Quiz Bank</h1>
                <span className="flex gap-x-2 items-center">
                    <p className="text-xs">Already have an account? &nbsp;
                        <Link to="/login" className="underline decoration-black">Login</Link>
                    </p>
                </span>
            </div>
            <Formik
                initialValues={{
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    password_confirmation: ""
                }}
                validationSchema={RegisterValidationSchema}
                onSubmit={async (values, {setSubmitting, setFieldError}) => {
                    let sentValues = {
                        first_name: values.first_name,
                        last_name: values.last_name,
                        email: values.email,
                        password: values.password,
                    }
                    const response = await createUser(sentValues);
                    setSubmitting(false);
                    if (response.status === 200) {
                        const user = response.data as User;
                        navigate(`/login`);
                    }
                    if (response.status >= 500) {
                        setMessage("Something went wrong. Please try again");
                        return;
                    }
                    setMessage(null);
                    setFieldError("email", "This email is already in use");
                }}
            >
                {({isSubmitting, values, errors, handleChange}) => (
                    <Form className="flex flex-col space-y-3">
                        {message && <Alert severity="error">{message}</Alert>}
                        <TextField
                            label="First Name"
                            variant="outlined"
                            className="col-start-1 col-span-full"
                            name="first_name"
                            error={!!errors.first_name}
                            helperText={errors.first_name ?? " "}
                            onChange={handleChange}
                            size="small"
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            className="col-start-1 col-span-full"
                            name="last_name"
                            error={!!errors.last_name}
                            helperText={errors.last_name ?? " "}
                            onChange={handleChange}
                            size="small"
                        />
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            className="col-start-1 col-span-full"
                            name="email"
                            error={!!errors.email}
                            helperText={errors.email ?? " "}
                            onChange={handleChange}
                            size="small"
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            className="col-start-1 col-span-full"
                            name="password"
                            error={!!errors.password}
                            helperText={errors.password ?? " "}
                            type="password"
                            onChange={handleChange}
                            size="small"
                        />
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            name="password_confirmation"
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation ?? " "}
                            type="password"
                            className="col-start-1 col-span-full"
                            onChange={handleChange}
                            size="small"
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            className="h-[29x] bg-neutral-700 capitalize hover:bg-neutral-600"
                            disabled={isSubmitting}
                        >
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};


const Register = () => {
    const [isLogged, setIsLogged] = useState<boolean | undefined>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const logged = getCookie("testBankIsLogged");
        if (logged !== undefined) {
            setIsLogged(true);
        }
    }, []);

    if (isLogged) {
        navigate("/");
    }

    return (
        <div className="min-h-screen flex flex-col justify-between bg-amber-50">
            <div
                className="flex-grow flex sm:flex-col-reverse lg:flex-row p-8 sm:p-20 justify-center items-center sm:gap-y-4 lg:gap-y-0">
                <img
                    className="xs:hidden sm:block h-[500px] w-auto"
                    src="/register.png"
                    alt=""
                />
                <RegisterBox/>
            </div>
            <Footer/>
        </div>
    );
};

export default Register;
