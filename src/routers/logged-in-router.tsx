import { gql, useQuery } from "@apollo/client";
import React from "react";
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";
import { Restuarants } from "../pages/clients/restaurants";
import { Header } from "../pages/header";
import { useMe } from "../pages/hooks/useMe";

const ClientRoutes = [
    <Route key="1" path="/" element={<Restuarants />} />
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
                <Route path="/potato" element={<Navigate replace to="/"/>} />
            </Routes>
        </BrowserRouter>
    )
};