import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import StockChart from "../components/stockChart";
import ReturnOnInvestment from "../components/returnonInvestment";
import CompanyInfo from "../components/companyInfo";
import CompanyNews from "../components/companyNews";

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
import { use } from "react";
import CompanyMetrics from "../components/companymetrics";

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
  // data for the return on investment
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [returnOnInvestment, setReturnOnInvestment] = useState(null);
  const [amount, setAmount] = useState(null);
  const [stockSymbol, setStockSymbol] = useState(null);

  // data for the price progression 
  const [priceProgressionDates, setPriceProgressionDates] = useState(null);
  const [priceProgressionRois, setPriceProgressionRois] = useState(null);

  // data to get company info 
  const [companyInfo, setCompanyInfo] = useState(null);
  const [companyNews, setCompanyNews] = useState(null);
  const [companyMetrics, setCompanyMetrics] = useState(null);



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

    try {
      const get_price_now = async () => {
        const queryParams = {
          symbol: stockSymbol,
          date: date,
          amount: amount,
        }

        const queryString = new URLSearchParams(queryParams).toString();

        const price_now_response = await fetch(`${backendurl}/api/pricenow?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (price_now_response.ok) {
          const data = await price_now_response.json();
          console.log(data);
          setStartDate(data.previousDate);
          setEndDate(data.currentDate);
          setCurrentPrice(data.currentPrice);
          setPreviousPrice(data.previousPrice);
          setReturnOnInvestment(data.returnOnInvestment);

        } else {
          const errorData = await price_now_response.text();
          console.log("Error:", errorData);
        }
      }

      await get_price_now();

    } catch (e) {
      console.log(e)
    }

  };

  // get the price progression once the current price, previous price and return on investment are set 
  useEffect(() => {
    console.log("Current Price: ", currentPrice)
    console.log("Previous Price: ", previousPrice)
    console.log("Return on Investment: ", returnOnInvestment)

    const get_price_progression = async () => {
      const queryParams = {
        startDate: startDate,
        endDate: endDate,
        amountInvested: amount,
        symbol: stockSymbol
      }

      const queryString = new URLSearchParams(queryParams).toString();
      console.log(`${backendurl}/api/priceprogression?${queryString}`)

      const price_progression_response = await fetch(`${backendurl}/api/priceprogression?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })


      if (price_progression_response.ok) {
        const data = await price_progression_response.json();

        const priceProgressionDates = data.dates.reverse();
        console.log(data.dates);
        const priceProgressionRois = data.rois.reverse();

        setPriceProgressionDates(priceProgressionDates);
        setPriceProgressionRois(priceProgressionRois);
      } else {
        console.log("error")
      }
    }

    if (startDate && endDate) {
      get_price_progression();
    }

  }, [startDate, endDate, amount, stockSymbol])

  // get the news once the stock symbol is set
  useEffect(() => {
    const get_company_news = async () => {
      const queryParams = {
        symbol: stockSymbol
      }

      const queryString = new URLSearchParams(queryParams).toString();

      const news_response = await fetch(`${backendurl}/api/info/news?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })


      if (news_response.ok) {
        const data = await news_response.json();
        setCompanyNews(data);
      } else {
        console.log("error")
      }
    }

    const get_company_info = async () => {
      const queryParams = {
        symbol: stockSymbol
      }

      const queryString = new URLSearchParams(queryParams).toString();

      const news_response = await fetch(`${backendurl}/api/info/profile?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })


      if (news_response.ok) {
        const data = await news_response.json();
        setCompanyInfo(data);
      } else {
        console.log("error")
      }
    }

    const get_company_metrics = async () => {
      const queryParams = {
        symbol: stockSymbol
      }

      const queryString = new URLSearchParams(queryParams).toString();

      const news_response = await fetch(`${backendurl}/api/info/metrics?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })


      if (news_response.ok) {
        const data = await news_response.json();
        setCompanyMetrics(data.metric);
      } else {
        console.log("error")
      }

    }

    if (stockSymbol) {
      get_company_news();
      get_company_info();
      get_company_metrics();
    }

  }, [stockSymbol])



  useEffect(() => {
    console.log("Price Progression Dates: ", priceProgressionDates)
    console.log("Price Progression Rois: ", priceProgressionRois)
  }, [priceProgressionDates, priceProgressionRois])

  useEffect(() => {
    console.log("Company Info: ", companyInfo)
    console.log("Company News: ", companyNews)
    console.log("Company Metrics: ", companyMetrics)
  }, [companyInfo, companyNews, companyMetrics])



  return (
    <div className="m-8">
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

      <div>
        {startDate && endDate && currentPrice && previousPrice && returnOnInvestment ? (
          <div>
            <ReturnOnInvestment startDate={startDate} endDate={endDate} currentPrice={currentPrice} previousPrice={previousPrice} returnOnInvestment={returnOnInvestment} />
          </div>
        ) : (
          <div>
            <p>Waiting for data...</p>
          </div>
        )}

      </div>

      <p>------------</p>


      <div>
        {priceProgressionDates && priceProgressionRois && priceProgressionDates.length > 0 && priceProgressionRois.length > 0 ? (
          <div>
            <StockChart priceProgressionDates={priceProgressionDates} priceProgressionRois={priceProgressionRois} />
          </div>
        ) : (
          <div>
            <p>Waiting for data for the stockchart </p>
          </div>
        )}
      </div>

      {
        companyInfo ? (
          <div>
            <CompanyInfo companyInfo={companyInfo} />
          </div>
        ) : (
          <div>
            <p>Waiting for data...</p>
          </div>
        )
      }

      <p>------------</p>

      {
        companyMetrics ? (
          <div>
            <CompanyMetrics companyMetrics={companyMetrics} />
          </div>
        ) : (
          <div>
            <p>Waiting for metrics data...</p>
          </div>
        )
      }

      <p>------------</p>


      {
        companyNews && companyNews.length > 0 ? (
          <div>
            <CompanyNews companyNews={companyNews} />
          </div>
        ) : (
          <div>
            <p>Waiting for news data...</p>
          </div>
        )
      }



    </div >

  );
}

