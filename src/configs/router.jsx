import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Customers from "../pages/Customers";
import Accounts from "../pages/Accounts";
import Deposito from "../pages/Deposito";

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/deposito" element={<Deposito />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
