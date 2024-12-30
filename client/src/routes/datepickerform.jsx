import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { backendurl } from "@/utilities";

// Schema for validation using Zod
const FormSchema = z.object({
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  amount: z
    .string() // Accepting the value as string initially
    .transform((val) => parseFloat(val)) // Transform it to a number
    .refine((val) => !isNaN(val), { message: "Amount must be a valid number." }) // Check if it's a valid number
    .refine((val) => val > 0, { message: "Amount must be greater than zero." }), // Ensure the number is positive
  stockSymbol: z.string().nonempty("Stock symbol is required"),
});

export function DatePickerForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  // Handling form submission
  const onSubmit = async (data) => {
    console.log(data); // This will print the validated form data
    const date = format(data.date, "yyyy-MM-dd");
    const amount = data.amount;
    const stockSymbol = data.stockSymbol;

    const queryParams = {
      symbol: stockSymbol,
      date: date,
      amount: amount,
    }

    const queryString = new URLSearchParams(queryParams).toString();
    console.log(queryString);

    try {
      const response = await fetch(`${backendurl}/api/pricenow?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }

    } catch (e) {
      console.log(e)
    }



  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Please choose a date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    className="border border-gray-200 rounded-lg shadow-lg p-4 bg-white"
                    dayClassName={(date) =>
                      "hover:bg-blue-500 hover:text-white transition-colors ease-in-out duration-200"
                    }
                    selectedClassName="bg-blue-500 text-white"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Please input the amount</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Amount"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stockSymbol"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Please input the stock symbol</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="string"
                  placeholder="ex: AAPL"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
