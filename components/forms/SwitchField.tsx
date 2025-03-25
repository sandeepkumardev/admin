import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const SwitchField = ({ control, name, label }: { control: any; name: string; label: string }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center space-y-0 gap-3">
          <Switch id={label} checked={field.value} onCheckedChange={field.onChange} />
          <FormLabel htmlFor={label} className="text-base text-dark-3 ">
            {label}
          </FormLabel>
        </FormItem>
      )}
    />
  );
};

export default SwitchField;
