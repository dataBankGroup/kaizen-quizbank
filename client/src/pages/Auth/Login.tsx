import {Button, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Form, Formik} from "formik";
import {loginUser} from "../../utils/Request";
import {getCookie, setCookie} from "typescript-cookie";
import React, {useEffect, useState} from "react";
import * as yup from "yup";
import Footer from "../Shared/Footer";

const LoginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter a valid email address.")
        .matches(/@tip.edu.ph$/, "Only TIP accounts are allowed.")
        .required("Please enter a valid email address"),
    password: yup.string().required("Please enter a password"),
});

const LoginBox = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-amber-100 w-96 h-auto space-y-5 p-4 sm:p-8 border-2 border-white">
            <div className=" flex flex-col space-y-2">
                <h1 className="font-bold text-2xl">Welcome to Quiz Bank</h1>
                <span className="flex gap-x-2 items-center">
                    <p className="text-sm">No account yet? &nbsp;
                        <Link to="/register" className="underline decoration-black">Register</Link>
                    </p>
                </span>
            </div>
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={LoginValidationSchema}
                onSubmit={async (values, {setSubmitting, setFieldError}) => {
                    console.log(values);
                    const response = await loginUser(values);
                    setSubmitting(false);
                    if (response.status === 200) {
                        setCookie("testBankIsLogged", true);
                        navigate("/");
                        return;
                    }
                    if (response.status < 500) {
                        setFieldError("email", "Invalid email or password.");
                        return;
                    }
                    setFieldError("email", "Something went wrong. Please try again");
                }}
            >
                {({isSubmitting, values, errors, handleChange}) => (
                    <Form className="flex flex-col gap-y-2">
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            name="email"
                            error={!!errors.email}
                            helperText={errors.email ?? " "}
                            onChange={handleChange}

                            sx={{focused: "red"}}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            name="password"
                            type="password"
                            error={!!errors.password}
                            helperText={errors.password ?? " "}
                            onChange={handleChange}


                        />
                        <Button
                            variant="contained"
                            type="submit"
                            className="h-[40px] bg-neutral-700 capitalize hover:bg-neutral-600"
                            disabled={isSubmitting}
                        >
                            Log In
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const Login = () => {
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
            <div className="flex-grow flex sm:flex-col-reverse lg:flex-row p-8 sm:p-20 justify-center items-center sm:gap-y-4 lg:gap-y-0">
                <img
                    className="xs:hidden sm:block h-[500px] w-auto"
                    src="/login.png"
                    alt=""
                />
                <LoginBox/>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
