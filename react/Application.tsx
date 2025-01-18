import React, { Suspense, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./Elements/Landing";

const root = ReactDOM.createRoot(document.querySelector("#application")!);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
        </Routes>
    );
}