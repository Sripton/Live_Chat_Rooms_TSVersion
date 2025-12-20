import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { checkUserSession } from "./redux/actions/userActions";
import { useAppDispatch } from "./redux/store/hooks";
export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <Box sx={{ pt: "64px" }}>
        <Outlet />
      </Box>
    </>
  );
}
