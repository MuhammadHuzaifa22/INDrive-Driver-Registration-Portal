import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import { useForm } from "react-hook-form";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db, storage } from "./FirebaseConfig";
import { LoadingButton } from "@mui/lab";
import { onAuthStateChanged } from "firebase/auth";
import TargetComponent from "../Components/TargetComponent";
import { useNavigate } from "react-router-dom";


import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import AlertBox from "../Components/Alert";

const Home = () => {
  // use hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // variable declaration
  const [company, setCompany] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const targetRef = useRef(null);
  let [imageURL, setImageURL] = useState("");
  let [isLoading, setLoading] = useState(false);
  let [isRegistered, setIsRegisterd] = useState(false);
  let [isCarSelected, setIsCarSelected] = useState(false);
  let [carSelected, setCarSelected] = useState("");
  let [registerFunctionClick, setRegisteredFunctionClick] = useState(false);
  let [emailMatched, setEmailMatched] = useState(false);
  let [emailChanged, setEmailChanged] = useState(false);
  let [emailValue, setEmailValue] = useState("");
  let [registeredSuccess, setRegisterdSuccess] = useState(false);
  let [photoURL, setPhotoURL] = useState("");
  let [registeredUserEmail,setRegisteredUserEmail] = useState('');
  let [registeredEmailNotMatched,setREgisteredEmailNotMatched] = useState(false);

  // navigate
  const navigate = useNavigate();


  useEffect(() => {
    // On auth state change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setRegisteredUserEmail(user.email);
 
      } else {
        navigate(`/`);
      }
    });


    // get registered Drivers Email
    async function getRegisteredDriversData(email) {
      const querySnapshot = await getDocs(collection(db, "drivers"));
      querySnapshot.forEach((doc) => {
        console.log(doc.data().email);
        if (doc.data().email === email) {
          console.log("Email Matched.");
          setEmailMatched(true);

        }
      });
    }

    if (emailChanged) {
      console.log(emailValue);
      getRegisteredDriversData(emailValue);
    }
  }, [emailChanged, emailValue]);

  // Check image blob or url function
  function getImageBlob(event) {
    const file = event.target.files[0];
    if (file instanceof Blob) {
      const fileURL = window.URL.createObjectURL(file);
      console.log(fileURL);
      setImageURL(fileURL);
    } else {
      console.log("Image is not a blob or URL.");
    }
  }

  // form regsiter function
  const registerDriver = async (data) => {
    if (!isCarSelected) {
      setRegisteredFunctionClick(true);
      return;
    }
    if(registeredUserEmail !== data.email){
      setREgisteredEmailNotMatched(true);
      setTimeout(()=>{
        setREgisteredEmailNotMatched(false);
      },2000)
      return;
    }
    
    if (!emailMatched) {
      setLoading(true);
      const URL = await showURL(data.email, data.image[0]);
      console.log(URL);
      if (URL) {
        setLoading(false);
        try {
          const docRef = await addDoc(collection(db, "drivers"), {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            company,
            carSelected,
            URL,
          });
          setRegisterdSuccess(true);
          setPhotoURL(URL);
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        setIsRegisterd(true);
        setCompany("");
        reset();
        setImageURL("");
        scrollToComponent();
      }
    }

    // For alert show & hide
    if (isRegistered) {
      setTimeout(() => {
        setIsRegisterd(false);
      }, 3000);
    }
  };

  // Get email changing for condition
  function getEmailChange(event) {
    setEmailChanged(true);
    setEmailValue(event.target.value);
    if (emailMatched) {
      setEmailMatched(false);
    }
  }

  // Select change handle for car company
  const handleChange = (event) => {
    setCompany(event.target.value);
    setIsCarSelected(false);
  };

  // Get User Image URL
  async function showURL(email, files) {
    const storageRef = ref(storage, email);
    try {
      const uploadImg = await uploadBytes(storageRef, files);
      const url = await getDownloadURL(storageRef);
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
    }
  }

  // Set auto Scroll to component
  function scrollToComponent() {
    targetRef.current.scrollIntoView({ behaviour: "smooth", block: "start" });
  }

  // Get Car Name
  function getCarName(event) {
    setIsCarSelected(true);
    console.log(event.target.textContent);
    setCarSelected(event.target.textContent);
  }

  return (
    <>
    {registeredEmailNotMatched && <AlertBox text="Your registered email is not match with this email" severity="error"/>}
      {emailMatched && (
        <AlertBox text="Driver with this email already exists." severity="error"/>
      )}
      
      {isRegistered && (
          <AlertBox text="Successfully registered." severity="success"/>

          
        )}
      <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl audiowide  text-center">
        Driver Registration Portal
      </h1>
      <Box className="flex w-[600px] mx-auto justify-center ">
        <Box
          onSubmit={handleSubmit(registerDriver)}
          component="form"
          className="p-[10px] border-[1px] w-full flex justify-center flex-wrap gap-[10px] mt-[20px] border-[#e4e4e4] rounded-md bg-[#ffffffa4]"
        >
          <Box className="flex flex-col w-[280px]">
            <TextField
              id="outlined-required"
              label="Email*"
              defaultValue=""
              type="email"
              {...register("email", { required: true })}
              onChange={getEmailChange}
              color={errors.email ? "warning" : "success"}
            ></TextField>
            {errors.email && (
              <span className="text-red-500 my-[5px]">Email is required</span>
            )}
          </Box>
          <Box className="flex flex-col w-[280px]">
            <TextField
              id="outlined-required"
              fullWidth
              label="FirstName*"
              defaultValue=""
              type="text"
              {...register("firstName", { required: true })}
              color={errors.firstName ? "warning" : "success"}
            ></TextField>
            {errors.firstName && (
              <span className="text-red-500 my-[5px]">
                First Name is required
              </span>
            )}
          </Box>
          <Box className="flex flex-col w-[280px]">
            <TextField
              id="outlined-required"
              fullWidth
              label="LastName*"
              defaultValue=""
              type="text"
              {...register("lastName", { required: true })}
              color={errors.lastName ? "warning" : "success"}
            ></TextField>
            {errors.lastName && (
              <span className="text-red-500 my-[5px]">
                Last Name is required
              </span>
            )}
          </Box>
          <Box className="flex flex-col w-[280px]">
            <Typography className="my-[2px] text-sm">
              Select a company of your car
            </Typography>
            <FormControl fullWidth sx={{ background: "none", borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-label">Company</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={company}
                label="Company"
                color="white"
                required
                onChange={handleChange}
                background="transparent"
              >
                <MenuItem value="honda" sx={{ background: "transparent" }}>
                  Honda
                </MenuItem>
                <MenuItem value="suzuki">Suzuki</MenuItem>
                <MenuItem value="changan">Changan</MenuItem>
              </Select>
            </FormControl>
            {/* nested Select For Honda */}
            {company !== "" && !isCarSelected && (
              <>
                <h1 className="text-md ">Car Name: </h1>
                <FormControl
                  sx={{
                    marginLeft: 10,
                    position: "absolute",
                    marginTop: 11,
                    display: "flex",
                  }}
                >
                  <MenuItem
                    onClick={getCarName}
                    value={
                      company === "honda"
                        ? "civic 2022"
                        : company === "suzuki"
                        ? "wagon-r"
                        : company === "changan"
                        ? "changan-x"
                        : null
                    }
                    sx={{ border: 1, borderColor: "green", borderRadius: 1 }}
                  >
                    {company === "honda"
                      ? "Civic"
                      : company === "suzuki"
                      ? "Wagon R"
                      : company === "changan"
                      ? "Changan Lumin"
                      : null}
                  </MenuItem>
                  <MenuItem
                    onClick={getCarName}
                    value={
                      company === "honda"
                        ? "civic 2022"
                        : company === "suzuki"
                        ? "wagon-r"
                        : company === "changan"
                        ? "changan-x"
                        : null
                    }
                    sx={{ border: 1, borderColor: "green", borderRadius: 1 }}
                  >
                    {company === "honda"
                      ? "City"
                      : company === "suzuki"
                      ? "Alto"
                      : company === "changan"
                      ? "Changan Raeton Plus"
                      : null}
                  </MenuItem>
                  <MenuItem
                    onClick={getCarName}
                    value={
                      company === "honda"
                        ? "civic 2022"
                        : company === "suzuki"
                        ? "wagon-r"
                        : company === "changan"
                        ? "changan-x"
                        : null
                    }
                    sx={{ border: 1, borderColor: "green", borderRadius: 1 }}
                  >
                    {company === "honda"
                      ? "Accord"
                      : company === "suzuki"
                      ? "Cultus"
                      : company === "changan"
                      ? "Changan UNI-T"
                      : null}
                  </MenuItem>
                </FormControl>{" "}
              </>
            )}

            {registerFunctionClick && !isCarSelected ? (
              <span className="text-red-500 ml-[200px]">Plase Select Car</span>
            ) : null}
          </Box>
          <Box
            sx={{
              width: 280,
              margin: "0 auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="p"
              gutterBottom
              className={`${errors.image ? "text-red-500" : "text-black"}`}
            >
              Upload your image
            </Typography>

            <Button
              variant="outlined"
              component="label"
              color={errors.image ? "warning" : "success"}
              sx={{
                mb: 2,
                width: 130,
                margin: "auto",
                fontSize: 12,
                color: `${errors.image ? "warning" : "success"} `,
                background: "white",
                color: "black",
                borderRadius: 1,
              }}
            >
              Choose Image
              <input
                hidden
                accept="image/*"
                type="file"
                {...register("image", { required: true })}
                onChange={getImageBlob}
              />
            </Button>
            {errors.image && (
              <span className="text-red-500">Image is required.</span>
            )}
            {imageURL !== "" && (
              <Box className="w-[200px] ml-[40px] my-[10px]">
                <img src={imageURL} sx={{ width: "45%", borderRadius: 5 }} />
              </Box>
            )}
          </Box>

          <Box className="w-full flex justify-center mt-[20px] text-[green]">
            <LoadingButton
              loading={isLoading}
              variant="outlined"
              type="submit"
              color="green"
              sx={{ background: "white", color: "black", borderRadius: 1 }}
            >
              Register
            </LoadingButton>
          </Box>
        </Box>

      </Box>

      {/* Target Component */}
      {registeredSuccess && (
        <Box className="mt-[140px] mx-auto max-w-lg">
          <div ref={targetRef}>
            <TargetComponent />
          </div>
        </Box>
      )}
    </>
  );
};

export default Home;
