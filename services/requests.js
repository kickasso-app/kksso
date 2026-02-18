import { createContext, useContext, useState } from "react";
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
    try {
      const response = await fetch(`/api/requests?studio_uuid=${id}`);
      if (!response.ok) throw new Error("Failed to fetch requests");
      const supaRequests = await response.json();
      setRequests(supaRequests || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchRequest = async (id, studio_uuid) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/requests?studio_uuid=${studio_uuid}&request_id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch request");
      const supaRequest = await response.json();
      setRequest(supaRequest);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      event_title,
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
      event_title,
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
      try {
        const response = await fetch("/api/requests", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request_id: id, updates }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update request");
        }

        const data = await response.json();
        setRequest(data);
        setIsUpdateSuccess(true);
        return { error: false };
      } catch (err) {
        setIsUpdateError(true);
        setError(err.message);
        setLoading(false);
        return { error: err };
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
