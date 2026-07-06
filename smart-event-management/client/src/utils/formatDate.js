export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  return `${date.toLocaleDateString('en-US', dateOptions)} at ${date.toLocaleTimeString('en-US', timeOptions)}`;
};

export const isUpcoming = (dateString) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  return eventDate >= today;
};

export const isPast = (dateString) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  return eventDate < today;
};
