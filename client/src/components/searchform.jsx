import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";



// Schema for validation using Zod
const FormSchema = z.object({
    date: z.date({
        required_error: "A date is required.",
    }),
    amount: z
        .string() // Accepting the value as string initially
        .transform((val) => parseFloat(val)) // Transform it to a number
        .refine((val) => !isNaN(val), { message: "Amount must be a valid number." }) // Check if it's a valid number
        .refine((val) => val > 0, { message: "Amount must be greater than zero." }), // Ensure the number is positive
    stockSymbol: z.string().nonempty("Stock symbol is required"),
});

const SearchForm = ({ passDataToParent, passDataToGrandparent }) => {
    const [amount, setAmount] = useState(null);
    const [stockSymbol, setStockSymbol] = useState(null);
    const [inputDate, setInputDate] = useState(null);


    const form = useForm({
        resolver: zodResolver(FormSchema),
    });

    // Handling form submission
    const onSubmit = async (form_input) => {
        console.log(form_input); // This will print the validated form data
        const date = format(form_input.date, "yyyy-MM-dd");
        const amount = form_input.amount;
        const stockSymbol = form_input.stockSymbol;

        setAmount(amount);
        setStockSymbol(stockSymbol);
        setInputDate(date);

        // pass props to parent

        // passDataToParent({ date, amount, stockSymbol });
        if (passDataToParent) {
            passDataToParent({ date, amount, stockSymbol }); // Through parent
        }

        if (passDataToGrandparent) {
            passDataToGrandparent({ date, amount, stockSymbol }); // Direct to grandparent
        }

    };

    return (
        <div className='mx-6 my-8'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
                    {/* Date Picker Field */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-gray-700 font-medium">Date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="MMMM d, yyyy"
                                        className="w-full text-sm p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
                                        placeholderText="Pick a date"
                                        maxDate={new Date()} // Prevent future dates
                                        showMonthYearPicker={false} // Make sure to allow day selection
                                        showFullMonthYearPicker={false}

                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row space-x-5">  {/* Use space-x-5 for horizontal spacing */}
                        {/* Stock Symbol Input Field */}
                        <FormField
                            control={form.control}
                            name="stockSymbol"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-1/2">  {/* Ensure each field takes up half the space */}
                                    <FormLabel className="text-gray-700 font-medium">Stock Symbol</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="string"
                                            placeholder="AAPL"
                                            className="w-full text-sm p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Amount Input Field */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-1/2">  {/* Ensure each field takes up half the space */}
                                    <FormLabel className="text-gray-700 font-medium">Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="10000"
                                            className="w-full text-sm p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Stock Symbol Input Field */}




                    {/* Submit Button */}
                    <Button type="submit" className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-300'>
                        Search Stock
                    </Button>
                </form>
            </Form>
        </div>

    )
}

export default SearchForm;