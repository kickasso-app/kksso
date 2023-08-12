// import { useState } from "react";
import { supabase } from "services/supabase";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuth } from "services/auth";

import { Box } from "grommet";

// NOT USED
export default function SignIn() {
  const router = useRouter();

  const { signIn, user } = useAuth();

  const handleSignIn = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    // With Context

    const { error } = await signIn({ email, password });

    if (error) {
      alert(error.message);
    } else if (user) {
      // Redirect user to Dashboard
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <Box width="large" pad="medium">
        <Box>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Box>
        <Box>
          <label htmlFor="password">Password</label>

          <input type="password" id="password" name="password" required />
        </Box>
        <br />
        <Box>
          <button type="submit">Sign Up</button>
        </Box>

        <br />

        <p>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </Box>
    </form>
  );
}
