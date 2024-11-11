import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "./FirebaseConfig";
import AlertBox from "../Components/Alert";
import { useNavigate } from "react-router-dom";



const Login = () => {
  // variable declaration
  let [registeredSuccess, setRegisterdSuccess] = useState(false);
  const navigate = useNavigate();

  // login with google
  function googleLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setRegisterdSuccess(true);
        setTimeout(()=>{
          setRegisterdSuccess(false);
          navigate(`/home`);
        },1200);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return (
    <>
    
      <Box className="flex justify-center items-center h-[40vh]">
        {registeredSuccess && <AlertBox text="Successfull" servity="success"/>}
        <Button
          variant="outlined"
          sx={{ color: "blue", width: 220, height: 40, fontSize: 15 }}
        >
          Continue With{" "}
          <span
            className="text-[yellow] font-medium ml-[5px]"
            onClick={googleLogin}
          >
            {" "}
            Google
          </span>
        </Button>
      </Box>
    </>
  );
};

export default Login;
