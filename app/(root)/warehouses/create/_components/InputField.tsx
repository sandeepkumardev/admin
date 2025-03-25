const InputField = ({
  formik,
  value,
  onChange,
  name,
  label,
  placeholder,
  type = "text",
}: {
  formik: any;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  label: string;
  placeholder?: string;
  type?: string;
}) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={label} className="text-sm">
        {label}
      </label>
      <input
        className="border rounded px-2 py-1 text-sm sm:text-[15px] w-full"
        id={name || label.toLowerCase()}
        name={name || label.toLowerCase()}
        type={type}
        placeholder={placeholder || `Enter ${label}`}
        onChange={onChange || formik.handleChange}
        onBlur={formik.handleBlur}
        value={value || formik.values[name || label]}
      />
      {formik.errors[name || label.toLowerCase()]?.message ||
      (formik.touched[name || label.toLowerCase()] && formik.errors[name || label.toLowerCase()]) ? (
        <div className="text-red-500 text-xs">
          {formik.errors[name || label.toLowerCase()]?.message || formik.errors[name || label.toLowerCase()]}
        </div>
      ) : null}
    </div>
  );
};

export default InputField;
