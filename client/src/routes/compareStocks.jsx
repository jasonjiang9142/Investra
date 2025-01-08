
import React, { useEffect, useState } from "react";
import StockChart from "../components/stockChart";
import CompanyInfo from "../components/companyInfo";
import CompanyNews from "../components/companyNews";
import { backendurl } from "@/utilities";
import CompanyMetrics from "../components/companyMetrics";
import Navbar from "../components/navbar";
import SearchForm from "../components/searchform";
import { set } from "date-fns";
import CompareForm from "../components/compareform";

function CompareStocks() {
    const [hasSearched, setHasSearched] = useState(false);
    const [searchParams, setSearchParams] = useState({
        amount: null,
        stockSymbol1: null,
        stockSymbol2: null,
        inputDate: null,
    });

    const passDataToParent = (dataFromParent) => {
        setSearchParams({
            amount: dataFromParent.amount,
            stockSymbol1: dataFromParent.stockSymbol1,
            stockSymbol2: dataFromParent.stockSymbol2,  // Removed the duplicate stockSymbol1
            inputDate: dataFromParent.date,
        });

        console.log("------------------ Starting a new query----------------------");
        console.log(dataFromParent);  // Log the data passed from the form
        setHasSearched(true); // Update search status
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar passDataToGrandparent={passDataToParent} isCompare={true} />

            {!hasSearched ? (
                <div>
                    <div className="min-h-screen bg-gray-50 p-16 flex flex-col items-center">

                        {/* Main Container */}
                        <div className="flex w-full max-w-6xl gap-12 items-center justify-center mt-16">
                            {/* Stock Cards */}
                            <div className="w-1/2 grid grid-cols-2 gap-6">
                                {/* Example Stock Card 1 */}
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800">AAPL</h2>
                                        <span className="text-green-500 font-medium">+12.3%</span>
                                    </div>
                                    <p className="text-gray-500 mb-4">Apple Inc.</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">$14,500</span>
                                        <span className="text-gray-500 text-sm">Initial: $10,000</span>
                                    </div>
                                </div>

                                {/* Example Stock Card 2 */}
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800">TSLA</h2>
                                        <span className="text-red-500 font-medium">-5.6%</span>
                                    </div>
                                    <p className="text-gray-500 mb-4">Tesla, Inc.</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">$9,450</span>
                                        <span className="text-gray-500 text-sm">Initial: $10,000</span>
                                    </div>
                                </div>

                                {/* Example Stock Card 3 */}
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800">MSFT</h2>
                                        <span className="text-green-500 font-medium">+8.2%</span>
                                    </div>
                                    <p className="text-gray-500 mb-4">Microsoft Corp.</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">$10,820</span>
                                        <span className="text-gray-500 text-sm">Initial: $10,000</span>
                                    </div>
                                </div>

                                {/* Example Stock Card 4 */}
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800">AMZN</h2>
                                        <span className="text-green-500 font-medium">+20.5%</span>
                                    </div>
                                    <p className="text-gray-500 mb-4">Amazon.com Inc.</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">$12,050</span>
                                        <span className="text-gray-500 text-sm">Initial: $10,000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Enlarged Search Box */}
                            <div className="w-2/3 bg-white shadow-lg rounded-lg p-8">
                                <label
                                    htmlFor="search"
                                    className="block text-2xl font-semibold text-gray-800 mb-6 text-center transform transition duration-300 ease-in-out "
                                >
                                    Compare for a Stock
                                </label>
                                <CompareForm id="search" passDataToParent={passDataToParent} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='py-10'>
                    <div className="flex flex-row items-center justify-center text-center gap-x-10  ">
                        <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700">Start Date: </span>
                            <span className="text-lg font-semibold text-blue-600">{searchParams.inputDate}</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700">Amount Invested: </span>
                            <span className="text-lg font-semibold text-green-600">${searchParams.amount}</span>
                        </div>
                    </div>


                    <div className="flex space-x-8 px-6 w-full justify-center">


                        <div className="w-full md:w-1/2">
                            <Root stockSymbol={searchParams.stockSymbol1} amount={searchParams.amount} inputDate={searchParams.inputDate} />
                        </div>
                        <div className="w-full md:w-1/2">
                            <Root stockSymbol={searchParams.stockSymbol2} amount={searchParams.amount} inputDate={searchParams.inputDate} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
const Root = ({ stockSymbol, amount, inputDate }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [previousPrice, setPreviousPrice] = useState(null);
    const [returnOnInvestment, setReturnOnInvestment] = useState(null);
    const [priceProgressionDates, setPriceProgressionDates] = useState([]);
    const [priceProgressionRois, setPriceProgressionRois] = useState([]);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [companyNews, setCompanyNews] = useState([]);
    const [companyMetrics, setCompanyMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [hasSearched, setHasSearched] = useState(false);
    const [searchIsLoading, setSearchIsLoading] = useState(false);

    const passDataToGrandparent = (dataFromParent) => {
        setIsLoading(true);

        // Clear existing data
        setStartDate(null);
        setEndDate(null);
        setCurrentPrice(null);
        setPreviousPrice(null);
        setReturnOnInvestment(null);
        setPriceProgressionDates([]);
        setPriceProgressionRois([]);
        setCompanyInfo(null);
        setCompanyNews([]);
        setCompanyMetrics(null);

        console.log("------------------ Starting a new query----------------------")
        console.log(dataFromParent);
        setHasSearched(true); // Update search status
    };

    useEffect(() => {
        if (!stockSymbol || !amount) {
            return;
        }

        setSearchIsLoading(true);
        const get_return_on_investment = async () => {
            setIsLoading(true); // Start loading

            try {
                const queryParams = { symbol: stockSymbol, date: inputDate, amount };
                const queryString = new URLSearchParams(queryParams).toString();
                const response = await fetch(`${backendurl}/api/pricenow?${queryString}`);

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

        get_return_on_investment();
    }, [stockSymbol, amount]);

    useEffect(() => {
        if (!startDate || !endDate || !amount || !stockSymbol) {
            return;
        }

        const get_price_progression = async () => {
            const queryParams = {
                startDate,
                endDate,
                amountInvested: amount,
                symbol: stockSymbol,
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

        get_price_progression();
    }, [startDate, endDate]);

    useEffect(() => {
        if (!stockSymbol) {
            return;
        }

        const fetchCompanyData = async (endpoint, setter) => {
            const queryParams = { symbol: stockSymbol };
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`${backendurl}${endpoint}?${queryString}`);

            if (response.ok) {
                const data = await response.json();
                if (endpoint === '/api/info/metrics') {
                    setter(data.metric);
                } else {
                    setter(data);
                }
            } else {
                console.error(`Error fetching data from ${endpoint}`);
            }
        };

        fetchCompanyData("/api/info/news", setCompanyNews);
        fetchCompanyData("/api/info/profile", setCompanyInfo);
        fetchCompanyData("/api/info/metrics", setCompanyMetrics);
    }, [stockSymbol]);

    const LoadingState = ({ message = "Loading data..." }) => (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg font-medium text-gray-600 mb-4">{message}</div>
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className='p-4'>
            <h1 className="text-center font-semibold text-xl text-gray-900 mb-4">
                {companyInfo ? `${companyInfo.name} (${companyInfo.ticker})` : "Company Information"}
            </h1>
            <div className="bg-white rounded-3xl p-3">
                {companyInfo ? (
                    <CompanyInfo companyInfo={companyInfo} startDate={startDate} endDate={endDate} currentPrice={currentPrice} previousPrice={previousPrice} returnOnInvestment={returnOnInvestment} amount={amount} textSize="text-lg" />
                ) : (
                    <LoadingState message="Fetching company information..." />
                )}

                {priceProgressionDates.length > 0 && priceProgressionRois.length > 0 ? (
                    <StockChart priceProgressionDates={priceProgressionDates} priceProgressionRois={priceProgressionRois} maxTicks={5} />
                ) : (
                    <LoadingState message="Fetching stock chart data..." />
                )}

                {companyMetrics ? (
                    <CompanyMetrics companyMetrics={companyMetrics} gridStyle="grid-cols-2" />
                ) : (
                    <LoadingState message="Fetching company metrics..." />
                )}

                {companyInfo && companyNews.length > 0 ? (
                    <CompanyNews companyNews={companyNews} companyInfo={companyInfo} gridStyle="grid-cols-1" />
                ) : (
                    <LoadingState message="Fetching news articles..." />
                )}
            </div>
        </div>
    );
};




export default CompareStocks;