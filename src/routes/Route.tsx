import React from "react"
import type { RouteObject } from "react-router-dom"
import HomePage from "../pages/Homepage"
import Login from "../pages/Loginpage"
 import Register from "../pages/Registerpage"
import Dashboard from "../pages/Dashboardpage"
 import AppLayout from "../layout/Applayout"
 import ProtectedRoute from "./ProtectedRoute"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      // Public pages
      {
        index: true,
        element: React.createElement(HomePage),
      },
      {
        path: "login",
        element: React.createElement(Login),
      },
      {
        path: "register",
        element: React.createElement(Register),
      },

      // Protected routes
      {
        element: React.createElement(ProtectedRoute),
        children: [
          {
            path: "dashboard",
            element: React.createElement(Dashboard),
          },
        ],
      },
    ],
  },
]
