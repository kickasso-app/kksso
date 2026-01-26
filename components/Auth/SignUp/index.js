// import { useState } from "react";
import { supabase } from "services/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "services/auth";

import { Box } from "grommet";

// NOT USED
export default function SignUp() {
  const router = useRouter();

  const { signUp, user } = useAuth();

  const handleSignUp = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    // With Context

    const { error } = await signUp({ email, password });

    if (error) {
      alert(error.message);
    } else if (user) {
      // Redirect user to Dashboard
      router.push("/welcome?email=${user.email}");
    }

    // Quick and Dirty
    //
    // try {
    //   console.log(event.target.email.value, event.target.password.value);
    //   // Use the Supabase provided method to handle the signup

    //   const { error } = await supabase.auth.signUp({
    //     email: event.target.email.value,
    //     password: event.target.password.value,
    //   });
    //   if (error) throw error;
    // } catch (error) {
    //   alert(error.error_description || error.message);
    // }

    // The Proper way with API route
    //     // call default function in pages/api/register
    //     // send the email and password from form submission event to that endpoint
    //     const res = await fetch("/api/signup", {
    //       body: JSON.stringify({
    //         email: event.target.email.value,
    //         password: event.target.password.value,
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       method: "POST",
    //     });

    //     const result = await res.json();
    //     const { user, error } = result;
    //     console.log(error);
    //     if (user) {
    //       router.push(`/welcome?email=${user.email}`);
    //     }
    //   };
  };

  return (
    <form onSubmit={handleSignUp}>
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
          Already have an account? <Link href="/login">Log In</Link>
        </p>
      </Box>
    </form>
  );
}
