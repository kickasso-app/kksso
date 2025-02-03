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
    setIsUpdateSuccess(false);
    setIsUpdateError(false);
    try {
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

      if (error && status !== 406) {
        setError(error);
        console.log(error);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * This function creates a new user's account and profile if it doesn't exist.
   */

  const createProfile = async (user) => {
    const randomId = 10000 + Math.floor(Math.random() * 10000);
    const newRow = {
      uuid: user.id,
      studio_id: randomId,
      email: user.email,
      location: "",
      district: "",
      artist: "",
      styles: "",
    };

    const { newProfile, error } = await supabase
      .from("studios")
      .insert([newRow])
      .select();

    return newProfile;
  };

  /**
   * This function updates the user's account and profile from a Supabase database and sets it in state.
   */

  const updateAccount = async (updates, user) => {
    setIsUpdateError(false);
    setIsUpdateSuccess(false);
    setLoading(true);

    if (updates) {
      let { error } = await supabase
        .from("studios")
        .update(updates, { returning: "minimal" })
        .eq("uuid", user.id);

      if (error) {
        setIsUpdateError(true);
        setLoading(false);
        throw error;
      } else {
        await fetchProfile(user);
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
