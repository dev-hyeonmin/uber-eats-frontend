import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NotFound } from "../pages/404";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";
import { LoggedInRouter } from "./logged-in-router";

export const LoggedOutRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/signup" element={<CreateAccount />} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    );
};