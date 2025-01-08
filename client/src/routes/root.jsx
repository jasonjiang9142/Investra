import React, { useEffect, useState } from "react";
import StockChart from "../components/stockChart";
import CompanyInfo from "../components/companyInfo";
import CompanyNews from "../components/companyNews";
import { backendurl } from "@/utilities";
import CompanyMetrics from "../components/companyMetrics";
import Navbar from "../components/navbar";
import SearchForm from "../components/searchform";
import { set } from "date-fns";

const Root = () => {
    const [searchParams, setSearchParams] = useState({
        amount: null,
        stockSymbol: null,
        inputDate: null,
    });

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


    // New state to track if the user has submitted the search
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

        setSearchParams({
            amount: dataFromParent.amount,
            stockSymbol: dataFromParent.stockSymbol,
            inputDate: dataFromParent.date,
        });

        console.log("------------------ Starting a new query----------------------")
        console.log(searchParams)
        setHasSearched(true); // Update search status
    };


    useEffect(() => {
        console.log(searchParams)
        if (!searchParams.amount || !searchParams.stockSymbol) {
            return;
        }
        console.log('==============================================')
        console.log('Entering get_return_on_investment')
        setSearchIsLoading(true);
        const { amount, stockSymbol, inputDate } = searchParams;
        const get_return_on_investment = async () => {
            setIsLoading(true); // Start loading

            try {
                const queryParams = { symbol: stockSymbol, date: inputDate, amount };
                const queryString = new URLSearchParams(queryParams).toString();
                const response = await fetch(`${backendurl}/api/pricenow?${queryString}`);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setStartDate(data.previousDate);
                    setEndDate(data.currentDate);
                    setCurrentPrice(data.currentPrice);
                    setPreviousPrice(data.previousPrice);
                    setReturnOnInvestment(data.returnOnInvestment);

                    console.log('start date:', startDate, 'end date:', endDate, 'current price:', currentPrice, 'previous price:', previousPrice, 'return on investment:', returnOnInvestment)
                    console.log("Ending return on investment")
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


    }, [searchParams]);

    // Optional: track when state changes and log updated values
    useEffect(() => {
        if (startDate || endDate || currentPrice || previousPrice || returnOnInvestment) {
            console.log('Updated ROI data:', {
                startDate, endDate, currentPrice, previousPrice, returnOnInvestment
            });
        }
    }, [startDate, endDate, currentPrice, previousPrice, returnOnInvestment]);


    // Fetch price progression data when startDate and endDate change
    useEffect(() => {
        if (!startDate || !endDate || !searchParams.amount || !searchParams.stockSymbol) {
            return;
        }

        console.log('==============================================')
        console.log('Entering get_price_progression')
        const get_price_progression = async () => {
            const { amount, stockSymbol } = searchParams;

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
                console.log('price progression dates:', priceProgressionDates, 'price progression rois:', priceProgressionRois)
                console.log("Ending price progression")
            } else {
                console.error("Error fetching price progression data");
            }
        };

        if (startDate && endDate) {
            get_price_progression();
        }
    }, [startDate, endDate, currentPrice, previousPrice, returnOnInvestment]);

    // Fetch company data when stockSymbol changes
    useEffect(() => {
        if (!searchParams.stockSymbol) {
            return
        }

        console.log('==============================================')
        console.log('Entering get_company_data')

        const fetchCompanyData = async (endpoint, setter) => {
            console.log('Fetching company data for:', endpoint)

            const queryParams = { symbol: searchParams.stockSymbol };
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`${backendurl}${endpoint}?${queryString}`);

            if (response.ok) {
                const data = await response.json();
                if (endpoint == '/api/info/metrics') {
                    setter(data.metric);
                } else {
                    setter(data);
                }
                console.log('company data:', data)
                console.log("Ending company data")
            } else {
                console.error(`Error fetching data from ${endpoint}`);
            }
        };

        if (searchParams.stockSymbol) {
            fetchCompanyData("/api/info/news", setCompanyNews);
            fetchCompanyData("/api/info/profile", setCompanyInfo);
            fetchCompanyData("/api/info/metrics", setCompanyMetrics);
        }

        console.log('Ending get_company_data')
    }, [startDate, endDate, currentPrice, previousPrice, returnOnInvestment]);



    const LoadingState = ({ message = "Loading data..." }) => (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg font-medium text-gray-600 mb-4">{message}</div>
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div>
            <Navbar passDataToGrandparent={passDataToGrandparent} />
            {!hasSearched ? (
                <div className="min-h-screen bg-gray-50 p-12 flex flex-col items-center">
                    {/* Header */}
                    <header className="w-full max-w-4xl mb-1 text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Stock Growth Simulator</h1>
                        <p className="text-gray-500 text-lg">
                            Calculate how much your investment in your favorite stock would be worth today!
                        </p>
                    </header>

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
                        <div className="w-1/2 bg-white shadow-lg rounded-lg p-8">
                            <label
                                htmlFor="search"
                                className="block text-2xl font-semibold text-gray-800 mb-6 text-center transform transition duration-300 ease-in-out "
                            >
                                Search for a Stock
                            </label>
                            <SearchForm id="search" passDataToGrandparent={passDataToGrandparent} />
                        </div>
                    </div>
                </div>



            ) : (
                <div>



                    <div className="mx-32 my-4">
                        <div>
                            {companyInfo ? (
                                <CompanyInfo
                                    companyInfo={companyInfo}
                                    startDate={startDate}
                                    endDate={endDate}
                                    currentPrice={currentPrice}
                                    previousPrice={previousPrice}
                                    returnOnInvestment={returnOnInvestment}
                                    amount={searchParams.amount}
                                />
                            ) : (
                                <LoadingState message="Fetching company information..." />
                            )}
                        </div>

                        <div>
                            {priceProgressionDates.length > 0 && priceProgressionRois.length > 0 ? (
                                <StockChart
                                    priceProgressionDates={priceProgressionDates}
                                    priceProgressionRois={priceProgressionRois}
                                />
                            ) : (
                                <LoadingState message="Fetching stock chart data..." />
                            )}
                        </div>

                        <div>
                            {companyMetrics ? (
                                <CompanyMetrics companyMetrics={companyMetrics} gridStyle="grid-cols-4" />
                            ) : (
                                <LoadingState message="Fetching company metrics..." />
                            )}
                        </div>

                        <div>
                            {companyInfo && companyNews.length > 0 ? (
                                <CompanyNews companyNews={companyNews} companyInfo={companyInfo} gridStyle="grid-cols-2" />
                            ) : (
                                <LoadingState message="Fetching news articles..." />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Root;
