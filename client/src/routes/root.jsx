import React, { useEffect, useState } from "react";
import StockChart from "../components/stockChart";
import CompanyInfo from "../components/companyInfo";
import CompanyNews from "../components/companyNews";
import { backendurl } from "@/utilities";
import CompanyMetrics from "../components/companyMetrics";
import Navbar from "../components/navbar";

const Root = () => {
    // Consolidated state for search parameters
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

    // Function to handle search data
    const passDataToGrandparent = (dataFromParent) => {
        setIsLoading(true); // Trigger global loading
        setSearchParams({
            amount: dataFromParent.amount,
            stockSymbol: dataFromParent.stockSymbol,
            inputDate: dataFromParent.date,
        });

    };

    // Fetch ROI data when searchParams change
    useEffect(() => {
        const { amount, stockSymbol, inputDate } = searchParams;

        const get_return_on_investment = async () => {
            setIsLoading(true); // Start loading

            try {
                const queryParams = { symbol: stockSymbol, date: inputDate, amount };
                console.log(queryParams);
                const queryString = new URLSearchParams(queryParams).toString();
                const response = await fetch(`${backendurl}/api/pricenow?${queryString}`);
                console.log(response)

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
    }, [searchParams]);

    // Fetch price progression data when startDate and endDate change
    useEffect(() => {
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
            } else {
                console.error("Error fetching price progression data");
            }
        };

        if (startDate && endDate) {
            get_price_progression();
        }
    }, [startDate, endDate, searchParams]);

    // Fetch company data when stockSymbol changes
    useEffect(() => {
        const fetchCompanyData = async (endpoint, setter) => {
            const queryParams = { symbol: searchParams.stockSymbol };
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await fetch(`${backendurl}${endpoint}?${queryString}`);

            if (response.ok) {
                const data = await response.json();
                setter(data);
            } else {
                console.error(`Error fetching data from ${endpoint}`);
            }
        };

        if (searchParams.stockSymbol) {
            fetchCompanyData("/api/info/news", setCompanyNews);
            fetchCompanyData("/api/info/profile", setCompanyInfo);
            fetchCompanyData("/api/info/metrics", setCompanyMetrics);
        }
    }, [searchParams.stockSymbol]);

    const LoadingState = ({ message = "Loading data..." }) => (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg font-medium text-gray-600 mb-4">{message}</div>
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div>
            <Navbar passDataToGrandparent={passDataToGrandparent} />

            <div className="mx-32 my-8">
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
    );
};

export default Root;
