import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "services/auth";

import { Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Eye, EyeOff } from "react-feather";

import {
  Box,
  FormField,
  TextInput,
  Heading,
  Text,
  Anchor,
  Paragraph,
  Notification,
} from "grommet";
import Button from "components/Button";

export default function Join() {

  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [revealPass, setRevealPass] = useState(false);

  // const [forgotPassword, setForgotPassword] = useState(false);

  const [signUpToast, setSignUpToast] = useState(false);
  // const [magicLinkToastToast, setMagicLinkToast] = useState(false);

  const router = useRouter();

  const { signUp, signIn, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user]);
  const handleSignUp = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      setLoading(true);
      const { error } = await signUp({
        email,
        password,
      });
      if (error) throw error;
      // if (user) {
      //   // router.push("/welcome?email=${user.email}");
      // }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
      setSignUpToast(true);
    }
  };

  const handleLogIn = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      setLoading(true);
      const { error } = await signIn({ email, password });
      if (error) throw error;
      // if (user) {
      //   router.push("/");
      //   // router.push("/welcome");
      // }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleMagicLink = async (event) => {
  //   event.preventDefault();
  //   const email = event.target.email.value;

  //   try {
  //     setLoading(true);
  //     const { error } = await sendMagicLink({ email });
  //     if (error) throw error;
  //   } catch (error) {
  //     alert(error.error_description || error.message);
  //   } finally {
  //     setLoading(false);
  //     setMagicLinkToast(true);
  //   }
  // };


  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  return (

    <Row around="xs">
      <Col xs={12} md={8}>
        <form onSubmit={newUser ? handleSignUp : handleLogIn}>
          <Box pad="medium" >
            <Heading level={3} alignSelf="center">{newUser ? "Sign Up as an Artist" : "Login"}</Heading>
            <Box >
              <FormField name="email" label="Email" margin={fieldMargin} required>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email"
                />
              </FormField>
            </Box>
            <Box>
              <FormField
                name="password"
                label="Password"
                margin={fieldMargin}
                required
              >
                <Box
                  direction="row"
                  align="center"
                  border={false}
                >
                  <TextInput
                    type={revealPass ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder={newUser ? "Your new password" : "Your passowrd"}
                    plain
                  />
                  <Box margin="xsmall">
                    {revealPass ?
                      <Eye size={20} color="#4B4B4B" strokeWidth={1} onClick={() => setRevealPass(false)} />
                      :
                      <EyeOff size={20} color="#4B4B4B" strokeWidth={1} onClick={() => setRevealPass(true)} />
                    }
                  </Box>
                </Box>

              </FormField>

            </Box>
            <Box margin={fieldMargin}>
              <Button btnStyle="filled" type="submit">
                {/* Still something is wrong with grommet button styles
               can't pad or size correctly */}
                {/* <GrommetButton primary size="large" type="submit"> */}
                {loading ? "Loading..." : newUser ? "Sign Up" : "Login"}
                {/* </GrommetButton> */}
              </Button>
            </Box>

            <br />
            <Box margin={"small"}>

              {newUser ? (
                <>
                  <Paragraph>
                    Already have an account?{" "}
                    <Anchor onClick={() => setNewUser(false)}>Log In</Anchor>
                  </Paragraph>
                </>

              ) : (
                <>
                  <Paragraph>
                    Don't have an account?{" "}
                    <Anchor
                      onClick={() => {
                        setNewUser(true)
                        // setForgotPassword(false);
                      }}>
                      Sign Up First</Anchor>
                    <br /> <br />
                  </Paragraph>

                  {/* {!forgotPassword && */}
                  <Text weight="300" margin={{ vertical: "small" }}>

                    Forgot your passoword?<br />
                  </Text>
                  <Text weight="200">
                    Please let us know by email and we will send you a magic link.
                    {/* <Anchor onClick={() => setForgotPassword(true)}>Send me a magic link</Anchor> */}
                  </Text>
                  {/* } */}
                </>

              )}
            </Box>



            {signUpToast && (
              <Notification
                toast
                status="normal"
                title="Almost there!"
                message="Please check your inbox to verify your email."
                onClose={() => { setSignUpToast(false) }}
              />
            )}

            {/* {magicLinkToastToast && (
            <Notification
              toast
              status="normal"
              title="We sent you a magic link!"
              message="Please check your inbox to log in to your account."
              onClose={() => { setSignUpToast(false) }}
            />
          )} */}

          </Box>
        </form>
      </Col>
    </Row>


  );
}
