import { useState } from "react";
import "./App.css";
import MainRouter from "./configs/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <MainRouter />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
