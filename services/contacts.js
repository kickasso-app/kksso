const createContact = async (newRequest) => {
  const newContact = {
    request_id: newRequest.request_id,
    contact_id: newRequest.guest_id,
    name: newRequest.requestor_name,
    email: newRequest.requestor_email,
    website: newRequest.requestor_link,
  };
  let isContactCreated = false;
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
