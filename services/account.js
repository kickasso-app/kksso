import { createContext, useContext, useState } from "react";

const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  /**
   * This function fetches the user's account and profile from a Supabase database and sets it in state.
   */

  const fetchProfile = async (user) => {
    resetNotification();
    if (!profile) {
      setLoading(true);
      try {
        const response = await fetch(`/api/account?uuid=${user.id}`);
        
        if (response.status === 404) {
          const newData = await createProfile(user);
          setProfile(newData);
        } else if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  /**
   * This function creates a new user's account and profile if it doesn't exist.
   */

  const createProfile = async (user) => {
    const randomId = 50000 + Math.floor(Math.random() * 10000);
    const newProfile = {
      uuid: user.id,
      studio_id: randomId,
      rank: randomId,
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

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Error creating studio:", error);
      throw error;
    }
  };

  /**
   * This function updates the user's account and profile from a Supabase database and sets it in state.
   */

  const updateAccount = async (updates, user) => {
    resetNotification();
    if (updates) {
      setLoading(true);
      try {
        const response = await fetch("/api/account", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uuid: user.id, updates }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update account");
        }

        const data = await response.json();
        setProfile(data);
        setIsUpdateSuccess(true);
      } catch (err) {
        setIsUpdateError(true);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetNotification = () => {
    setIsUpdateSuccess(false);
    setIsUpdateError(false);
  };

  const contextObj = {
    profile,
    fetchProfile,
    updateAccount,
    resetNotification,
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
