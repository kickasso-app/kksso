import { createContext, useContext, useState } from "react";
import { supabase } from "./supabase";

import { studioColumns } from "config/constants/studioColumns";
import { calendarBounds } from "config/calendar";

const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [profile, setProfile] = useState();
  const [calendarDate, setCalendarDate] = useState(calendarBounds.Start);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  /**
   * This function fetches the user's account and profile from a Supabase database and sets it in state.
   */

  const fetchProfile = async (user) => {
    if (!profile) {
      setIsUpdateSuccess(false);
      setIsUpdateError(false);

      setLoading(true);
      let { data, error, status } = await supabase
        .from("studios")
        .select(studioColumns.join(", "))
        .eq("uuid", user.id)
        .single();
      if (!data) {
        data = await createProfile(user);
      }
      setProfile({ ...data });
      // console.log({ ...data });

      if (error && status !== 406) {
        setError(error);
        console.log(error);
      }
      setLoading(false);
    }
  };

  /**
   * This function creates a new user's account and profile if it doesn't exist.
   */

  const createProfile = async (user) => {
    const randomId = 10000 + Math.floor(Math.random() * 10000);
    const newProfile = {
      uuid: user.id,
      studio_id: randomId,
      email: user.email,
      created_at: new Date().toISOString(),
    };
    try {
      const response = await fetch("/api/create-studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newProfile }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create studio");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating studio:", error);
      throw error;
    }
  };

  /**
   * This function updates the user's account and profile from a Supabase database and sets it in state.
   */

  const updateAccount = async (updates, user) => {
    setIsUpdateError(false);
    setIsUpdateSuccess(false);
    setLoading(true);

    if (updates) {
      let { data, error } = await supabase
        .from("studios")
        .update(updates)
        .eq("uuid", user.id)
        .select();

      if (error) {
        setIsUpdateError(true);
        setLoading(false);
        throw error;
      } else {
        await setProfile(data?.[0]);
        setIsUpdateSuccess(true);
      }
    }

    setLoading(false);
  };

  const updateCalendarDate = (date) => {
    setCalendarDate(date);
  };

  const contextObj = {
    profile,
    calendarDate,
    fetchProfile,
    updateAccount,
    updateCalendarDate,
    isUpdateSuccess,
    isUpdateError,
    loading,
    error,
  };

  return (
    <AccountContext.Provider value={contextObj}>
      {children}
    </AccountContext.Provider>
  );
};

const useAccount = () => useContext(AccountContext);

export { useAccount, AccountContext, AccountProvider };

// TODO B4 MERGE: remove
// const createProfileOld = async (user) => {
//   const randomId = 10000 + Math.floor(Math.random() * 10000);
//   const newRow = {
//     uuid: user.id,
//     studio_id: randomId,
//     email: user.email,
//     location: "",
//     district: "",
//     artist: "",
//     styles: "",
//   };

//   const { newProfile, error } = await supabase
//     .from("studios")
//     .insert([newRow])
//     .select();

//   return newProfile;
// };

// update count using API

// try {
//   const response = await fetch("/api/update-studio", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ updates, userId: user.id }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     setIsUpdateError(true);
//     throw new Error(errorData.message || "Failed to update studio");
//   }

//   const updatedProfile = await response.json();
//   console.log(updatedProfile);
//   setProfile(updatedProfile.user);
//   setIsUpdateSuccess(true);

//   return updatedProfile;
// } catch (error) {
//   console.error("Error updating studio:", error);
//   throw error;
// } finally {
//   setLoading(false);
// }
