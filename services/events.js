import React, { createContext, useContext, useState } from "react";
import { supabase } from "./supabase";

import { useCities } from "services/city";

const EventsContext = createContext(null);

const EventsProvider = ({ children }) => {
  const { selectedCity } = useCities();

  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  /**
   * This function fetches published Events from a Supabase database and sets them in state.
   */

  const fetchEvents = async () => {
    setLoading(true);
    // console.log("fetching Events");

    let supabaseQuery = supabase.from("events").select("*");

    if (selectedCity) {
      supabaseQuery = supabaseQuery.contains("cityLocation", [selectedCity]);
    }

    let { data: supaEvents, error } = await supabaseQuery

      .is("isPublished", true)
      .order("created_at", { ascending: false });
    if (supaEvents?.length) {
      // console.log(supaEvents);
      setEvents(supaEvents);
    } else {
      const returnError = error ?? "No Events were fetched";
      setError(returnError);
    }
    setLoading(false);
  };

  const fetchAllEvents = async () => {
    setLoading(true);
    // console.log("fetching Events");

    let { data: supaEvents, error } = await supabase
      .from("events")
      .select("*")
      // .eq("studio_uuid", id)
      .order("created_at", { ascending: false });
    if (supaEvents?.length) {
      // console.log(supaEvents);
      setEvents(supaEvents);
    } else {
      const returnError = error ?? "No Events were fetched";
      setError(returnError);
    }
    setLoading(false);
  };

  // Fetchs all account events including unpublished ones

  const fetchAccountEvents = async (id) => {
    setLoading(true);
    // console.log("fetching Events");

    let { data: supaEvents, error } = await supabase
      .from("events")
      .select("*")
      .eq("studio_uuid", id)
      .order("created_at", { ascending: false });
    if (supaEvents?.length) {
      // console.log(supaEvents);
      setEvents(supaEvents);
    } else {
      const returnError = error ?? "No Events were fetched";
      setError(returnError);
    }
    setLoading(false);
  };

  const fetchEvent = async ({ event_id }) => {
    setLoading(true);
    resetNotification;
    // console.log("fetching Events");
    try {
      let { data: supaEvent, error } = await supabase
        .from("events")
        .select("*")

        .eq("id", event_id)
        .single();
      if (error) {
        setError(error.message);
        throw error;
      }
      // console.log(supaEvent);
      setEvent(supaEvent);
    } catch (error) {
      const returnError = error.message ?? "No Event were fetched";
      console.error("There was a problem fetch this event:", error.message);
      setError(returnError);
    } finally {
      setLoading(false);
    }
    // setLoading(false);
  };

  /**
   * This function creates a new Events in a Supabase database
   */

  const createEvent = async ({ studio_uuid, event_id }) => {
    setLoading(true);
    let eventCreated = false;
    let errorMsg = false;

    // console.log("createEvent", studio_uuid, event_id);

    const newEvent = {
      id: event_id, // uuid from event
      studio_uuid: studio_uuid, // uuid of the studio
      created_at: new Date().toISOString(), // timestamp with time zone
      location: "Studio",
      isPublished: false,
      //   type: "event",
      //   title: studio_name,
      //   date: event_date, // YYYY-MM-DD
      //   time: event_time, // HH:MM text
      //   miniDescription: "", // text
      //   longDescription: "", // text
      //   currentNJoined: 0, // number
      //   maxNJoined: 0, // number
      //   contact: eventor_email, // text
      //   link: eventor_link, // text
    };

    // console.log(newEvent);
    try {
      const response = await fetch("/api/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEvent }),
      });

      if (response.ok) {
        eventCreated = true;
      } else {
        setError(true);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }

    setLoading(false);
    return { eventCreated, error: { message: errorMsg } };
  };

  /**
   * This function updates a event item in a Supabase database
   */

  const updateEvent = async (updates, id) => {
    setLoading(true);
    resetNotification();

    if (updates) {
      let { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        setError(true);
        setLoading(false);
        return { error };
        throw error;
      } else {
        await setEvent(data?.[0]);
        setIsUpdateSuccess(true);
      }
    }

    setLoading(false);
    return { error: false };
  };

  const resetNotification = () => {
    setIsUpdateSuccess(false);
    setIsUpdateError(false);
  };

  const contextObj = {
    events,
    event,
    createEvent,
    updateEvent,
    fetchEvent,
    fetchEvents,
    fetchAccountEvents,
    fetchAllEvents,
    loading,
    error,
    isUpdateSuccess,
    isUpdateError,
  };

  return (
    <EventsContext.Provider value={contextObj}>
      {children}
    </EventsContext.Provider>
  );
};

const useEvents = () => useContext(EventsContext);

export { useEvents, EventsContext, EventsProvider };
