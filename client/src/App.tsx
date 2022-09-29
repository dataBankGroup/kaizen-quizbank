import React, {Component, useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import Home from "./pages/Home";
import CourseCreate from "./pages/Course/Create";
import CourseView from "./pages/Course/View";
import TopicView from "./pages/Topic/View";
import CourseEdit from "./pages/Course/Edit";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AllCourses from "./pages/AllCourses";
import Settings from "./pages/Settings";
import About from "./pages/About";
import {createTheme, ThemeProvider} from "@mui/material";
import Export from "./pages/Assessment/Export";

function App() {

    const theme = createTheme({
        typography: {
            // Tell MUI what's the font-size on the html element is.
            htmlFontSize: 16,
            fontFamily: ["Open Sans"].join(','),
        },

    });

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>

                    <Route path="/" element={<NavLayout/>}>
                        <Route index element={<Home/>}/>
                        <Route path="courses/">
                            <Route index element={<Home/>}/>
                            <Route path="create" element={<CourseCreate/>}/>
                            <Route path=":id" element={<CourseView/>}/>
                            <Route path="edit/">
                                <Route path=":id" element={<CourseEdit/>}/>
                            </Route>
                        </Route>
                        <Route path="topics/">
                            <Route path=":id" element={<TopicView/>}/>
                        </Route>
                        <Route path="/create-quiz" >
                            <Route index element={<AllCourses/>}/>
                            <Route path=":id" element={<Export/>}/>
                        </Route>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/about" element={<About/>}/>
                    </Route>
                    <Route path="*" element={<h1>404</h1>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>

    )
        ;
}


export default App;
