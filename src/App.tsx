import type React from "react"
import { Provider } from "react-redux"
import { store, persistor } from "./redux/store"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"
import { routes } from "./routes/Route"

const router = createBrowserRouter(routes)

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  )
}

export default App
