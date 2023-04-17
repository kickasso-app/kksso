// import { useState, useEffect } from "react";
// import Router from "next/router";
// import Link from "next/link";

// import firebase from "firebase/app";
// import "firebase/auth";

// import { initFirebase } from "services/firebase";

// import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
// import { Box, Heading, Text, Button } from "grommet";

// import styles from "./index.module.scss";

// initFirebase();

// const useInput = ({ type, placeholder }) => {
//   const [value, setValue] = useState("");
//   const input = (
//     <input
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//       type={type}
//       placeholder={placeholder}
//     />
//   );
//   return [value, input];
// };

// const SignIn = () => {
//   const [authorizing, setAuthorizing] = useState(false);

//   const [isNewUser, setIsNewUser] = useState(false);
//   const [email, emailInput] = useInput({ type: "text", placeholder: "Email" });
//   const [password, passwordInput] = useInput({
//     type: "password",
//     placeholder: "Pass",
//   });

//   const [displayName, displayNameInput] = useInput({
//     type: "text",
//     placeholder: "Your Name",
//   });

//   const margin = "medium";
//   const sectionMargin = { vertical: "12rem" };

//   // const signUpEmail = async () => {
//   //   // const user = { email, password };
//   //   console.log("setup", { email, password });
//   //   try {
//   //     const response = await firebase
//   //       .auth()
//   //       .createUserWithEmailAndPassword(email, password);
//   //     const token = await response.user.getIdToken(); // getIdToken is a method of user
//   //     console.log("THIS IS THE RESPONSE", token);
//   //     const signedIn = await logInEmail();
//   //   } catch (error) {
//   //     // Handle Errors here.
//   //     var errorCode = error.code;
//   //     var errorMessage = error.message;
//   //     if (errorCode == "auth/weak-password") {
//   //       alert("The password is too weak.");
//   //     } else {
//   //       alert(errorMessage);
//   //     }
//   //     console.log(error);
//   //   }
//   // };

//   const handleAuth = async () => {
//     // setAuthorizing(true);
//     // try {
//     //   const response = await firebase.auth().createUserWithPopUp(provider);
//     //   const { user, credenitals } = result;
//     //   // console.log({ user, credenitals });
//     //   if (!user) {
//     //     throw new Error("no user");
//     //   }
//     //   Router.push("/about");
//     // } catch (error) {
//     //   alert(error);
//     // }
//     // setAuthorizing(false);
//   };

//   return (
//     <Grid fluid id={styles.signin} align="center">
//       <section>
//         <Box margin={sectionMargin} align="center">
//           <Row>
//             <Heading level={2} margin={{ vertical: "1rem" }}>
//               Ready to give it a try?
//             </Heading>
//           </Row>
//           <Row>
//             <Col xs={12} md={6}>
//               <Box
//                 align="center"
//                 pad={{ vertical: "small" }}
//                 margin={{ vertical: "xlarge" }}
//               >
//                 <Button onClick={handleAuth}>Sign In</Button>
//                 <Text size="medium" margin="medium">
//                   Discover artists by location or medium and plan a visit to
//                   their studios
//                 </Text>
//               </Box>
//             </Col>

//             <Col xs={12} md={6}>
//               <Box
//                 align="center"
//                 pad={{ vertical: "small" }}
//                 margin={{ vertical: "xlarge" }}
//               ></Box>
//             </Col>
//           </Row>
//         </Box>
//       </section>
//     </Grid>
//   );
// };

// export default SignIn;
