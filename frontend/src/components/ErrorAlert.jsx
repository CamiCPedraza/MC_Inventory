function ErrorAlert({ message }) {
  if (!message) return null;

  return <div className="error-message">{message}</div>;
}

export default ErrorAlert;
