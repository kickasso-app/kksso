import { createContext, useContext, useState } from "react";
import { supabase } from "./supabase";

import { createContact } from "./contacts";

const RequestsContext = createContext(null);

const RequestsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  /**
   * This function fetches published Requests from a Supabase database and sets them in state.
   */

  const fetchRequests = async (id) => {
    setLoading(true);
    // console.log("fetching Requests");

    let { data: supaRequests, error } = await supabase
      .from("requests")
      .select("*")
      .eq("studio_uuid", id)
      .order("request_date_tz", { ascending: false });
    if (supaRequests?.length) {
      // console.log(supaRequests);
      setRequests(supaRequests);
    } else {
      const returnError = error ?? "No Requests were fetched";
      setError(returnError);
    }
    setLoading(false);
  };

  const fetchRequest = async (id, studio_uuid) => {
    setLoading(true);
    // console.log("fetching Requests");
    try {
      let { data: supaRequest, error } = await supabase
        .from("requests")
        .select("*")
        .eq("studio_uuid", studio_uuid)
        .eq("request_id", id)
        .single();
      if (error) {
        setError(error.message);
        throw error;
      }

      setRequest(supaRequest);
    } catch (error) {
      const returnError = error.message ?? "No Request were fetched";
      console.error("There was a problem fetch this request:", error.message);
      setError(returnError);
    } finally {
      setLoading(false);
    }
    // setLoading(false);
  };

  /**
   * This function creates a new Requests in a Supabase database
   */

  const createRequest = async (request) => {
    setLoading(true);
    let requestCreated = false;
    let isContactCreated = false;
    let errorMsg = false;

    const {
      request_id,
      studio_name,
      from_name,
      request_date,
      requestor_email,
      requestor_link,
      visit_reason,
      request_date_tz,
      request_type,
      studio_uuid,
      event_uuid,
    } = request;

    const newRequest = {
      request_id,
      studio_uuid,
      event_uuid,
      has_response: false,
      requestor_name: from_name,
      studio_name,
      requestor_email,
      request_date,
      request_date_tz,
      requestor_link,
      messages: [{ reason: visit_reason }],
      request_type,
      // Default Values in DB
      // last_update: now(),
      // has_response: FALSE,
      // response: NULL,
      // response_date,: default NULL,
    };

    try {
      const response = await fetch("/api/create-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRequest }),
      });

      if (response.ok) {
        requestCreated = true;
      } else {
        setError(true);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
    }

    if (requestCreated === true) {
      isContactCreated = await createContact({ newRequest: newRequest });
      // console.log(isContactCreated);
      // TODO: add isContactCreated check
    }

    setLoading(false);
    return { requestCreated, error: { message: errorMsg } };
  };

  /**
   * This function updates a request item in a Supabase database
   */

  const updateRequest = async (updates, id, studio_id) => {
    setIsUpdateError(false);
    setIsUpdateSuccess(false);
    setLoading(true);

    if (updates) {
      let { data, error } = await supabase
        .from("requests")
        .update(updates)
        .eq("request_id", id)
        .select();

      if (error) {
        setError(true);
        setLoading(false);
        return { error };
        throw error;
      } else {
        await setRequest(data?.[0]);
        setIsUpdateSuccess(true);
      }
    }

    setLoading(false);
    return { error: false };
  };

  const contextObj = {
    requests,
    request,
    createRequest,
    updateRequest,
    fetchRequest,
    fetchRequests,
    loading,
    error,
  };

  return (
    <RequestsContext.Provider value={contextObj}>
      {children}
    </RequestsContext.Provider>
  );
};

const useRequests = () => useContext(RequestsContext);

export { useRequests, RequestsContext, RequestsProvider };

// const sample = {
//   request_id: "1c546bb6-79f9-498e-8dd4-889e9d7a0ad9",
//   request_date: "2025-03-04 at 13:00",
//   request_date_tz: "",
//   reponse: null,
//   studio_uuid: "a67a18aa-551c-4ecf-9281-8f1f6b596ef2",
//   has_response: false,
//   response_date: null,
//   messages: null,
//   studio_name: "Should be last",
//   last_update: "2025-02-17T15:43:40.972084+00:00",
//   requestor_email: null,
//   requestor_link: null,
// };
