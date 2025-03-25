import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const InputField = ({
  control,
  name,
  label,
  type = "text",
  textarea = false,
  placeholder,
}: {
  control: any;
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="text-base text-dark-3">{label}</FormLabel>
          <FormControl>
            {textarea ? (
              <Textarea placeholder={placeholder} rows={5} {...field} />
            ) : (
              <Input type={type} className="" placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default InputField;
