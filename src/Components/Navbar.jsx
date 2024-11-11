import React, { useEffect, useState } from "react";
import logo from "/src/assets/Images/inDriver.png";
import "../index.css";
import { Box } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Pages/FirebaseConfig";

const Navbar = () => {
  // variable declaration
  let [isPhotoURL, setIsPhotoURL] = useState(false);
  let [userProfilePhoto,setProfilePhoto] = useState('');

  // use effect
  useEffect(() => {
    // on auth state change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if(user.photoURL !== '' || user.photoURL !== null){
          setIsPhotoURL(true);
          setProfilePhoto(user.photoURL);
          console.log(user.photoURL)
        }

      } else {
       
      }
    });

  }, []);

  return (
    <Box className="flex justify-between items-center p-[10px]">
      <Box className="flex justify-center gap-[5px]">
        <img src={logo} alt="" className="h-[40px] " />
        <h1 className="text-3xl audiowide font-bold ">InDrive</h1>
      </Box>
      {isPhotoURL && <Box>
        <img src={userProfilePhoto} alt="profile-photo" className="w-[45px] h-[45px] rounded-full border-[2px] border-[#c0f11c] shadow-sm shadow-[#c0f11c]"/>
        </Box>}
    </Box>
  );
};

export default Navbar;
