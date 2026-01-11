import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuth } from "services/auth";
import { useStudios } from "services/studios";

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

import { featureFlags } from "config/feature-flags";

export default function Join() {
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [referralApproved, setReferralApproved] = useState(false);
  const [revealPass, setRevealPass] = useState(false);

  const [passwordHint, setPasswordHint] = useState(false);
  const [signUpToast, setSignUpToast] = useState(false);

  const router = useRouter();
  const { referral } = router.query;
  const { doesStudioExist } = useStudios();

  const { signUp, signIn, user } = useAuth();

  useEffect(() => {
    async function checkReferral() {
      if (referral && featureFlags.referrals) {
        setNewUser(true);
        const isApproved = await doesStudioExist({ uuid: referral });
        setReferralApproved(isApproved);
      }
    }
    checkReferral();
  }, [referral]);

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user]);

  const handleSignUp = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    var passPattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    );

    if (password.length >= 8 && passPattern.test(password)) {
      setPasswordHint(false);
      let isUserCreated = true;
      try {
        setLoading(true);
        const { data, error } = await signUp({
          email,
          password,
        });
        if (error) {
          isUserCreated = false;
          throw error;
        }
        // console.log(data);
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        setLoading(false);
        setSignUpToast(isUserCreated);
      }
    } else {
      setPasswordHint(true);
    }
  };

  const handleLogIn = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      setLoading(true);
      const { data, error } = await signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldMargin = { vertical: "medium" };
  const textMargin = { vertical: "small" };

  return (
    <Row around="xs">
      <Col xs={12} md={8}>
        <form onSubmit={newUser ? handleSignUp : handleLogIn}>
          <Box pad="medium">
            <Heading level={3} alignSelf="center">
              {newUser ? "Sign Up as an Artist" : "Login"}
            </Heading>
            <Box>
              <FormField
                name="email"
                label="Email"
                margin={fieldMargin}
                required
              >
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
                <Box direction="row" align="center" border={false}>
                  <TextInput
                    type={revealPass ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder={newUser ? "********" : "Your password"}
                    plain
                  />
                  <Box margin="xsmall">
                    {revealPass ? (
                      <Eye
                        size={20}
                        color="#4B4B4B"
                        strokeWidth={1}
                        onClick={() => setRevealPass(false)}
                      />
                    ) : (
                      <EyeOff
                        size={20}
                        color="#4B4B4B"
                        strokeWidth={1}
                        onClick={() => setRevealPass(true)}
                      />
                    )}
                  </Box>
                </Box>
              </FormField>
              {passwordHint && (
                <Text color="#ffc0cb">
                  Your password must be at least 8 characters long and contain
                  uppercase and lowercase letters and at least 1 number and 1
                  special character.
                </Text>
              )}
            </Box>
            <Box margin={fieldMargin}>
              <Button
                btnStyle="filled"
                type="submit"
                disabled={!newUser ? false : !referralApproved}
              >
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
                  {!referralApproved && featureFlags.referrals && (
                    <>
                      <Paragraph margin={textMargin} fill>
                        At the moment, we are accepting new members based on
                        referrals from the current studios. If one of them is a
                        friend of yours, please ask them for an invite.
                      </Paragraph>
                      <Paragraph margin={textMargin} fill>
                        Otherwise please write us an email at{"  "}
                        <b>join@arti.my</b> {"  "}to request an account and let
                        us know a bit about your work, studio practice, and why
                        you would like to join Arti.
                      </Paragraph>
                    </>
                  )}
                  <Text weight="normal" margin={fieldMargin}>
                    As an art lover or collector, you don't need an account to
                    use the platform.
                  </Text>
                  <Paragraph margin={textMargin}>
                    Already have an account?{" "}
                    <Anchor onClick={() => setNewUser(false)}>
                      <u>Log In</u>
                    </Anchor>
                  </Paragraph>
                </>
              ) : (
                <>
                  <Paragraph margin={fieldMargin}>
                    Don't have an account?{" "}
                    <Anchor
                      onClick={() => {
                        setNewUser(true);
                        // setForgotPassword(false);
                      }}
                    >
                      <u>Sign Up First</u>
                    </Anchor>
                  </Paragraph>

                  <Paragraph margin={fieldMargin}>
                    Forgot your password?{" "}
                    <Link href="/join/magiclink">
                      <u>Get a magic link</u>
                    </Link>
                  </Paragraph>
                </>
              )}
            </Box>

            {signUpToast && (
              <Notification
                toast
                status="normal"
                title="Almost there!"
                message="Please check your inbox to verify your email."
                onClose={() => {
                  setSignUpToast(false);
                }}
              />
            )}
          </Box>
        </form>
      </Col>
    </Row>
  );
}
