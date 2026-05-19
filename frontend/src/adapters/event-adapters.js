const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.error,
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message,
    };
  }
};

export const fetchEvents = async () => {
  return handleFetch('/api/events');
};

export const createEvent = async (body) => {
  return handleFetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export const joinEvent = async (eventId) => {
  return handleFetch(`/api/events/${eventId}/join`, {
    method: 'POST',
  });
};

export const leaveEvent = async (eventId) => {
  return handleFetch(
    `/api/events/${eventId}/leave`,
    {
      method: 'DELETE',
    }
  );
};

export const deleteEvent = async (eventId) => {
  return handleFetch(`/api/events/${eventId}`, {
    method: 'DELETE',
  });
};