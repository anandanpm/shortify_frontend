
import type React from "react"
import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import "../styles/Layout.scss"

const AppLayout: React.FC = () => {
  return (
    <div>
     <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
     </div>
    </div>
  )
}

export default AppLayout
