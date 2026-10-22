"use client";

import React from "react";
import { FieldValues } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputFieldProps } from "@/types";

const InputField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    disabled,
}: InputFieldProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="form-label">{label}</FormLabel>
                    <FormControl>
                        <input
                            {...field}
                            type="text"
                            placeholder={placeholder}
                            disabled={disabled}
                            value={field.value ?? ""}
                            className="form-input outline-none focus:ring-2 focus:ring-[#8B7355]/30 transition-all"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default InputField;
