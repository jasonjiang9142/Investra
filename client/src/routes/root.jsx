import React, { useEffect, useState } from "react";
import StockChart from "../components/stockChart";
import CompanyInfo from "../components/companyInfo";
import CompanyNews from "../components/companyNews";
import { backendurl } from "@/utilities";
import CompanyMetrics from "../components/companyMetrics";
import Navbar from "../components/navbar";

const Root = () => {
    // Initial states with default values
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [previousPrice, setPreviousPrice] = useState(null);
    const [returnOnInvestment, setReturnOnInvestment] = useState(null);

    // const [amount, setAmount] = useState(1000); // Default initial amount
    // const [stockSymbol, setStockSymbol] = useState("AAPL"); // Default stock symbol
    // const [inputDate, setInputDate] = useState("2023-01-01"); // Default input date

    const [amount, setAmount] = useState(null); // Default initial amount
    const [stockSymbol, setStockSymbol] = useState(null); // Default stock symbol
    const [inputDate, setInputDate] = useState(null); // Default input date

    const [priceProgressionDates, setPriceProgressionDates] = useState([]);
    const [priceProgressionRois, setPriceProgressionRois] = useState([]);

    const [companyInfo, setCompanyInfo] = useState(null);
    const [companyNews, setCompanyNews] = useState([]);
    const [companyMetrics, setCompanyMetrics] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // Function to handle search data
    const passDataToGrandparent = (dataFromParent) => {
        setIsLoading(true); // Trigger global loading
        setAmount(dataFromParent.amount);
        setStockSymbol(dataFromParent.stockSymbol);
        setInputDate(dataFromParent.date);
        console.log(amount, stockSymbol, inputDate);
    };
    useEffect(() => {
        const get_return_on_investment = async () => {
            setIsLoading(true); // Start loading
            try {
                const queryParams = {
                    symbol: stockSymbol,
                    date: inputDate,
                    amount: amount,
                };
                const queryString = new URLSearchParams(queryParams).toString();

                const response = await fetch(`${backendurl}/api/pricenow?${queryString}`);

                console.log('get price now', response);
                if (response.ok) {
                    const data = await response.json();
                    setStartDate(data.previousDate);
                    setEndDate(data.currentDate);
                    setCurrentPrice(data.currentPrice);
                    setPreviousPrice(data.previousPrice);
                    setReturnOnInvestment(data.returnOnInvestment);
                } else {
                    console.error("Error fetching ROI data");
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false); // Stop loading
            }

        };

        if (amount && stockSymbol && inputDate) {
            get_return_on_investment();
        }
    }, [amount, stockSymbol, inputDate]);

    useEffect(() => {
        const get_price_progression = async () => {
            const queryParams = {
                startDate: startDate,
                endDate: endDate,
                amountInvested: amount,
                symbol: stockSymbol
            };

            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`${backendurl}/api/priceprogression?${queryString}`);

            if (response.ok) {
                const data = await response.json();
                setPriceProgressionDates(data.dates.reverse());
                setPriceProgressionRois(data.rois.reverse());
            } else {
                console.error("Error fetching price progression data");
            }
        };

        if (startDate && endDate) {
            get_price_progression();
        }
    }, [startDate, endDate, amount, stockSymbol]);

    useEffect(() => {
        const fetchCompanyData = async (endpoint, setter) => {
            const queryParams = { symbol: stockSymbol };
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`${backendurl}${endpoint}?${queryString}`);

            if (response.ok) {
                const data = await response.json();
                setter(data);
            } else {
                console.error(`Error fetching data from ${endpoint}`);
            }
        };

        if (stockSymbol) {
            fetchCompanyData("/api/info/news", setCompanyNews);
            fetchCompanyData("/api/info/profile", setCompanyInfo);
            fetchCompanyData("/api/info/metrics", setCompanyMetrics);
        }
    }, [stockSymbol]);

    const LoadingState = ({ message = "Loading data..." }) => (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg font-medium text-gray-600 mb-4">{message}</div>
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div>
            {/* {isLoading ? <FullScreenLoader message="Fetching Data, Please Wait..." /> :
                ( */}
            <div>

                <Navbar passDataToGrandparent={passDataToGrandparent} />


                <div className='mx-32 my-8'>
                    <div>
                        {companyInfo ? (
                            <CompanyInfo companyInfo={companyInfo} startDate={startDate}
                                endDate={endDate} currentPrice={currentPrice}
                                previousPrice={previousPrice}
                                returnOnInvestment={returnOnInvestment} amount={amount} />
                        ) : (
                            <LoadingState message="Fetching company information..." />
                        )}
                    </div>

                    <div>
                        {priceProgressionDates.length > 0 && priceProgressionRois.length > 0 ? (
                            <StockChart priceProgressionDates={priceProgressionDates} priceProgressionRois={priceProgressionRois} />
                        ) : (
                            <LoadingState message="Fetching stock chart data..." />
                        )}
                    </div>

                    <div>
                        {companyMetrics ? (
                            <CompanyMetrics companyMetrics={companyMetrics} />
                        ) : (
                            <LoadingState message="Fetching company metrics..." />
                        )}
                    </div>

                    <div>
                        {companyInfo && companyNews.length > 0 ? (
                            <CompanyNews companyNews={companyNews} companyInfo={companyInfo} />
                        ) : (
                            <LoadingState message="Fetching news articles..." />
                        )}
                    </div>
                </div>
            </div>

            {/* )} */}


        </div>
    );
};

const FullScreenLoader = ({ message = "Loading data..." }) => (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-xl font-medium text-gray-600 mb-4">{message}</div>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export default Root;
