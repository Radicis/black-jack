import React, { ComponentPropsWithoutRef, forwardRef, Ref } from "react";

// eslint-disable-next-line react/display-name
const Button = forwardRef(
  (
    { children, ...props }: ComponentPropsWithoutRef<"button">,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className="font-medium border rounded border-gray-700 px-4 py-2"
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
