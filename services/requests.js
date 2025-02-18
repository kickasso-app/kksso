import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

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
      .from("requests_test")
      .select("*")
      .eq("studio_uuid", id)
      .order("last_update", { ascending: false });
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
        .from("requests_test")
        .select("*")
        .eq("studio_uuid", studio_uuid)
        .eq("request_id", id)
        .single();
      if (error) {
        throw error;
        setError(error.message);
      }

      setRequest(supaRequest);
    } catch (error) {
      const returnError = error.message ?? "No Request were fetched";
      console.error("There was a problem fetch this request:", error.message);
      setError(returnError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * This function creates a new Requests in a Supabase database
   */

  const createRequest = async (id, request) => {
    const reqUUID = self.crypto.randomUUID();
    const {
      studio_name,
      request_date,
      requestor_email,
      requestor_link,
      visit_reason,
      request_date_tz,
    } = request;

    const newRequest = {
      request_id: reqUUID,
      studio_uuid: id,
      has_response: false,
      studio_name,
      requestor_email,
      request_date,
      request_date_tz,
      requestor_link,
      messages: [`Visit Reason: ` + visit_reason],
      // Default Values in DB
      // last_update: now(),
      // has_response: FALSE,
      // response: NULL,
      // response_date,: default NULL,
    };

    const { data: insertedRequest, error } = await supabase
      .from("requests_test")
      .insert([newRequest])
      .select();

    if (error) {
      setError(true);
      setLoading(false);
      throw error;
    }

    return insertedRequest;
  };

  /**
   * This function updates a request item in a Supabase database
   */

  const updateRequest = async (updates, id, studio_id) => {
    setIsUpdateError(false);
    setIsUpdateSuccess(false);
    setLoading(true);

    if (updates) {
      let { error } = await supabase
        .from("requests_test")
        .update(updates, { returning: "minimal" })
        .eq("request_id", id);

      if (error) {
        setError(true);
        setLoading(false);
        throw error;
      } else {
        await fetchRequests(studio_id);
        setIsUpdateSuccess(true);
      }
    }

    setLoading(false);
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

const sample = {
  request_id: "1c546bb6-79f9-498e-8dd4-889e9d7a0ad9",
  request_date: "2025-03-04 at 13:00",
  request_date_tz: "",
  reponse: null,
  studio_uuid: "a67a18aa-551c-4ecf-9281-8f1f6b596ef2",
  has_response: false,
  response_date: null,
  messages: null,
  studio_name: "Should be last",
  last_update: "2025-02-17T15:43:40.972084+00:00",
  requestor_email: null,
  requestor_link: null,
};
