const createContact = async ({ newReferral, newRequest }) => {
  const newContact = { contact_id: self.crypto.randomUUID() };
  let isContactCreated = false;

  if (newReferral) {
    newContact = {
      ...newContact,
      source: "referral",
      name: newReferral.name,
      email: newReferral.email,
      referedBy: newReferral.referedBy,
    };
  } else if (newRequest) {
    newContact = {
      ...newContact,
      source: "request",
      request_id: newRequest.request_id,
      name: newRequest.requestor_name,
      email: newRequest.requestor_email,
      website: newRequest.requestor_link,
    };
  } else {
    console.warn("No newReferral or newRequest provided to createContact");
    return false; // Or throw an error, depending on your error handling strategy
  }

  try {
    const response = await fetch("/api/create-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newContact }),
    });

    if (response.ok) {
      isContactCreated = true;
    } else {
      setError(true);
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create contact");
    }
  } catch (error) {
    console.error("Error creating contact:", error);
  }
  return isContactCreated;
};

export { createContact };
