import React from "react";
import PropTypes from "prop-types";

const LoadingButton = ({
  children,
  isLoading,
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${className} disabled:opacity-70 disabled:cursor-not-allowed`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

LoadingButton.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

export default LoadingButton;
