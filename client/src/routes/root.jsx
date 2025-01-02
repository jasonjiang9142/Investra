import React from "react";

import { useEffect, useState } from "react";
import StockChart from "../components/stockChart";
import CompanyInfo from "../components/companyInfo";
import CompanyNews from "../components/companyNews";
import { backendurl } from "@/utilities";
import CompanyMetrics from "../components/companyMetrics";
import Navbar from "../components/navbar";


const Root = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [previousPrice, setPreviousPrice] = useState(null);
    const [returnOnInvestment, setReturnOnInvestment] = useState(null);

    const [amount, setAmount] = useState(null);
    const [stockSymbol, setStockSymbol] = useState(null);
    const [inputDate, setInputDate] = useState(null);

    // data for the price progression 
    const [priceProgressionDates, setPriceProgressionDates] = useState([]);
    const [priceProgressionRois, setPriceProgressionRois] = useState([]);

    // data to get company info 
    const [companyInfo, setCompanyInfo] = useState(null);
    const [companyNews, setCompanyNews] = useState([]);
    const [companyMetrics, setCompanyMetrics] = useState(null);

    // Function to handle search data from the SearchForm
    const passDataToGrandparent = (dataFromParent) => {
        setAmount(dataFromParent.amount);
        setStockSymbol(dataFromParent.stockSymbol);
        setInputDate(dataFromParent.date);

        console.log("Data from parent: ")
        console.log(dataFromParent)
    };

    useEffect(() => {
        console.log('Root component mounted')
        console.log("Amount: ", amount)
        console.log("Stock Symbol: ", stockSymbol)
        console.log("Input Date: ", inputDate)




        const get_return_on_investment = async () => {
            try {
                const get_price_now = async () => {
                    const queryParams = {
                        symbol: stockSymbol,
                        date: inputDate,
                        amount: amount,
                    }

                    console.log("Query Params: ", queryParams)

                    const queryString = new URLSearchParams(queryParams).toString();

                    const price_now_response = await fetch(`${backendurl}/api/pricenow?${queryString}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })

                    if (price_now_response.ok) {
                        const data = await price_now_response.json();
                        console.log("return on investment")
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
        }
        console.log("Getting the Return on Investment component")
        if (amount && stockSymbol && inputDate) {
            console.log('Inside the conditional function')
            get_return_on_investment();
        }

        console.log("Return on investment done")
    }, [amount, stockSymbol, inputDate])


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
        // console.log("Price Progression Dates: ", priceProgressionDates)
        // console.log("Price Progression Rois: ", priceProgressionRois)
    }, [priceProgressionDates, priceProgressionRois])

    useEffect(() => {
        // console.log("Company Info: ", companyInfo)
        // console.log("Company News: ", companyNews)
        // console.log("Company Metrics: ", companyMetrics)
    }, [companyInfo, companyNews, companyMetrics])

    return (
        <div>
            {/* Passing the handler function to Navbar */}
            <Navbar passDataToGrandparent={passDataToGrandparent} />

            <div className='mx-32 my-8 '>

                <div>
                    {companyInfo ? (
                        <div>
                            <CompanyInfo companyInfo={companyInfo} startDate={startDate}
                                endDate={endDate}
                                currentPrice={currentPrice}
                                previousPrice={previousPrice}
                                returnOnInvestment={returnOnInvestment}
                                amount={amount} />
                        </div>
                    ) : (
                        <div>
                            <p>Waiting for data...</p>
                        </div>
                    )}
                </div>

                <div>
                    {priceProgressionDates && priceProgressionRois && priceProgressionDates.length > 0 && priceProgressionRois.length > 0 ? (
                        <div>
                            <StockChart
                                priceProgressionDates={priceProgressionDates}
                                priceProgressionRois={priceProgressionRois}
                            />
                        </div>
                    ) : (
                        <div>
                            <p>Waiting for data for the stock chart</p>
                        </div>
                    )}
                </div>

                <div>
                    {companyMetrics ? (
                        <div>
                            <CompanyMetrics companyMetrics={companyMetrics} />
                        </div>
                    ) : (
                        <div>
                            <p>Waiting for metrics data...</p>
                        </div>
                    )}
                </div>

                <div>
                    {companyInfo && companyNews && companyNews.length > 0 ? (
                        <div>
                            <CompanyNews companyNews={companyNews} companyInfo={companyInfo} />
                        </div>
                    ) : (
                        <div>
                            <LoadingState message="Waiting for data..." />

                        </div>
                    )}
                </div>

            </div>




        </div>
    )
}

const LoadingState = ({ message = "Waiting for data..." }) => (
    <div className="flex justify-center items-center h-full">
        <div className="text-lg font-medium text-gray-600">{message}</div>
        {/* Optionally add a spinner */}
        <div className="ml-3 animate-spin rounded-full border-4 border-t-4 border-blue-500 w-6 h-6"></div>
    </div>
);

export default Root;