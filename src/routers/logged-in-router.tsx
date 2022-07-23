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
import { Header } from "../components/header";
import { useMe } from "../pages/hooks/useMe";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { AddDish } from "../pages/owner/add-dish";
import { Order } from "../pages/clients/order";

const clientRoutes = [
    {
        path: "/",
        component: <Restuarants />
    },    
    {
        path: "/search",
        component: <Search />
    },
    {
        path: "/category/:slug",
        component: <Category />
    },
    {
        path: "/restaurants/:id",
        component: <Restaurant />
    },
    {
        path: "/orders/:id",
        component: <Order />
    }
];

const commonRoutes = [
    {
        path: "/confirm",
        component: <ConfirmEmail />
    },
    {
        path: "/edit-profile",
        component: <EditProfile />
    }
];

const restaurantRoutes = [
    {
        path: "/",
        component: <MyRestaurants />
    },
    {
        path: "/add-restaurant",
        component: <AddRestaurant />
    },
    {
        path: "/restaurants/:id",
        component: <MyRestaurant />
    },
    {
        path: "/restaurants/:id/add-dish",
        component: <AddDish />
    }
]

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
                {data.me.role === "Client" && clientRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.component} />
                ))}

                {data.me.role === "Owner" && restaurantRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.component} />
                ))}

                {commonRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.component} />
                ))}

                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    )
};