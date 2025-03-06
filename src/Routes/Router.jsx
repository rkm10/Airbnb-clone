import { Typography } from "@mui/material";
import React, { lazy, Suspense } from "react";

const Auth = lazy(() => import("../Auth/Auth"));
const Layout = lazy(() => import("../components/Layout/Layout"));
const MainLayout = lazy(() => import("../components/MainLayout/MainLayout"));
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const Experience = lazy(() => import("../Pages/Experience/Experience"));
const HelpCenter = lazy(() => import("../Pages/Help/HelpCenter"));
const HomePage = lazy(() => import("../Pages/Home/HomePage"));
const ViewDetails = lazy(() => import("../Pages/ViewDetails/ViewDetails"));

const Router = [
    { 
        path: "/",
        element: (
            <Suspense>
                <MainLayout />
            </Suspense>
        ),
        children: [
            {
                index: true, // Use index for the default route instead of path:'/'
                element: (
                    <Suspense>
                        <Dashboard />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "/",
        element: (
            <Suspense>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                path: "auth",
                element: (
                    <Suspense>
                        <Auth />
                    </Suspense>
                ),
            },
            {
                path: "homepage",
                element: (
                    <Suspense>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: "helpcenter",
                element: (
                    <Suspense>
                        <HelpCenter />
                    </Suspense>
                ),
            },
            {
                path: "experience",
                element: (
                    <Suspense>
                        <Experience />
                    </Suspense>
                ),
            },
            {
                path: "viewdetails",
                element: (
                    <Suspense>
                        <ViewDetails />
                    </Suspense>
                ),
            },
        ],
    },
];

export default Router;
