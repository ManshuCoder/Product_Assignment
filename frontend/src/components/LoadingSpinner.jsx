const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  const content = (
    <div className="spinner-container">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-overlay">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
