import { cn } from "../lib/utils";

export default function InputField({ 
  label, 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          error 
            ? "border-destructive text-destructive placeholder:text-destructive/50" 
            : "border-input"
        )}
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}