import React from "react";

const InputForm = ({
  type = "text",
  label,
  value,
  children,
  onChange,
  id,
  ...props
}) => {
  return (
    <>
      <div className="mt-2">
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          {label}
        </label>
        <input
          {...props}
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-md dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-500 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </>
  );
};

export default InputForm;
