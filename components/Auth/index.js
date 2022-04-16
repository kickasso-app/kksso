import { useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "services/auth";
import {
  Box,
  Form,
  FormField,
  MaskedInput,
  CheckBoxGroup,
  TextArea,
  TextInput,
  Text,
  Heading,
  Anchor,
  Paragraph,
  Button as GrommetButton,
} from "grommet";
import Button from "components/Button";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(true);

  const router = useRouter();

  const { signUp, signIn, user } = useAuth();

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
      if (user) {
        router.push("/welcome?email=${user.email}");
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
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
      if (user) {
        // router.push("/");
        router.push("/welcome");
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  return (
    <>
      <form onSubmit={newUser ? handleSignUp : handleLogIn}>
        <Box width="large" pad="medium">
          <Heading level={3}>{newUser ? "Sign Up" : "Login"}</Heading>
          <Box>
            {/* <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            /> */}
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
              <TextInput type="password" id="password" name="password" />
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

          {newUser ? (
            <Paragraph>
              Already have an account?{" "}
              <Anchor onClick={() => setNewUser(false)}>Log In</Anchor>
            </Paragraph>
          ) : (
            <Paragraph>
              Don't have an account?{" "}
              <Anchor onClick={() => setNewUser(true)}>Sign Up</Anchor>
            </Paragraph>
          )}
        </Box>
      </form>
    </>
  );
}
