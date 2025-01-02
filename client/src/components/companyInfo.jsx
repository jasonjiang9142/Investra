import { useEffect, useState } from "react";

const CompanyInfo = ({ companyInfo, startDate, endDate, currentPrice, previousPrice, returnOnInvestment, amount }) => {


    useEffect(() => {
        console.log("Entering Company Info Page");
        console.log(companyInfo);
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };



    const isPositiveROI = returnOnInvestment >= 0;
    const roi_percent = (returnOnInvestment / amount) * 100;

    return (
        <div className="mx-12 flex items-center justify-center ">
            {companyInfo ? (
                <div className="w-full overflow-hidden">
                    {/* Header Section */}
                    <div className="flex items-center p-6 border-b ">
                        <img
                            src={companyInfo.logo}
                            alt={`${companyInfo.name} logo`}
                            className="w-16 h-16 rounded-full mr-6 shadow-md"
                        />
                        <div>
                            <p className="text-gray-500 text-xs mt-1">{companyInfo.exchange} • {companyInfo.currency} • {companyInfo.finnhubIndustry}</p>
                            <a
                                href={companyInfo.weburl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=""
                            >
                                <h1 className="text-3xl font-bold text-gray-800">{companyInfo.name} ({companyInfo.ticker})</h1>
                            </a>
                        </div>
                    </div>


                    {/* ROI Section */}
                    {startDate && endDate && currentPrice && previousPrice && returnOnInvestment ? (
                        <div className="p-6 border-t flex flex-row gap-10 ">
                            <div className="gap-4 flex flex-row items-center pb-4">

                                <p className="text-black-500 text-sm font-bold mt-1">Return: </p>
                                <p className={`text-2xl font-semibold ${isPositiveROI ? 'text-[#037b66]' : 'text-red-800'}`}>
                                    ${returnOnInvestment.toFixed(2)} ({roi_percent.toFixed(2)}%)
                                </p>

                            </div>

                            <div className="gap-10 flex">
                                <div>
                                    <p className="text-black text-2xl font-bold"> ${previousPrice.toFixed(2)}</p>
                                    <p className="text-black-500 text-xs mt-1">Price at start: {formatDate(startDate)} at 4:00:00 PM EST</p>


                                </div>
                                <div>
                                    <p className="text-black  text-2xl font-bold">${currentPrice.toFixed(2)}</p>
                                    <p className="text-black-500 text-xs mt-1">Price at end: {formatDate(endDate)} at 4:00:00 PM EST</p>

                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <p className="text-gray-500 text-lg">Waiting for data on return on investment...</p>
                        </div>
                    )}


                </div>

            ) : (
                <div className="text-gray-500 text-lg">Waiting for company data...</div>
            )
            }
        </div >
    );
};

export default CompanyInfo;
