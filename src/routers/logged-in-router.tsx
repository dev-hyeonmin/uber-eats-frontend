import { gql, useQuery } from "@apollo/client";
import React from "react";
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";
import { NotFound } from "../pages/404";
import { Category } from "../pages/clients/category";
import { ConfirmEmail } from "../pages/clients/confirm-email";
import { EditProfile } from "../pages/clients/edit-profile";
import { Restaurant } from "../pages/clients/restaurant";
import { Restuarants } from "../pages/clients/restaurants";
import { Search } from "../pages/clients/search";
import { Header } from "../pages/header";
import { useMe } from "../pages/hooks/useMe";

const ClientRoutes = [
    <Route key={1} path="/" element={<Restuarants />} />,
    <Route key={2} path="/confirm" element={<ConfirmEmail />} />,
    <Route key={3} path="/edit-profile" element={<EditProfile />} />,
    <Route key={4} path="/search" element={<Search />} />,
    <Route key={5} path="/category/:slug" element={<Category />} />,
    <Route key={6} path="/restaurants/:id" element={<Restaurant/>}/>
];

export const LoggedInRouter = () => {
    const { data, loading, error } = useMe();

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                {data.me.role === "Client" && ClientRoutes}
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    )
};