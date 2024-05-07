import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import { store, persistor } from "./redux/store.js"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import ThemeProvider from "./components/ThemeProvider.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
)
