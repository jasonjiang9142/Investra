import { useEffect } from "react";

const CompanyMetrics = ({ companyMetrics }) => {

    useEffect(() => {
        console.log("Entering Company Metrics Page");
    })

    const mapMetrics = {
        "5 Day Price Return Daily": companyMetrics["5DayPriceReturnDaily"] || "Data Not Available",
        "13 Week Price Return Daily": companyMetrics["13WeekPriceReturnDaily"] || "Data Not Available",
        "52 Week Price Return Daily": companyMetrics["52WeekPriceReturnDaily"] || "Data Not Available",
        "Price Relative to S&P500 (52 Week)": companyMetrics["priceRelativeToS&P50052Week"] || "Data Not Available",
        "Beta": companyMetrics["beta"] || "Data Not Available",
        "10 Day Average Trading Volume": companyMetrics["10DayAverageTradingVolume"] || "Data Not Available",
        "3 Month Average Trading Volume": companyMetrics["3MonthAverageTradingVolume"] || "Data Not Available",
        "52 Week High": companyMetrics["52WeekHigh"] || "Data Not Available",
        "52 Week Low": companyMetrics["52WeekLow"] || "Data Not Available",
        "EPS Annual": companyMetrics["epsAnnual"] || "Data Not Available",
        "Operating Margin Annual": companyMetrics["operatingMarginAnnual"] || "Data Not Available",
        "Net Profit Margin Annual": companyMetrics["netProfitMarginAnnual"] || "Data Not Available",
        "Revenue Growth (3 Years)": companyMetrics["revenueGrowth3Y"] || "Data Not Available",
        "Current Ratio Quarterly": companyMetrics["currentRatioQuarterly"] || "Data Not Available",
        "Long-Term Debt/Equity Annual": companyMetrics["longTermDebt/equityAnnual"] || "Data Not Available",
        "Total Debt/Total Equity Quarterly": companyMetrics["totalDebt/totalEquityQuarterly"] || "Data Not Available"
    };
    return (
        <div className="m-6 py-5 mx-auto bg-gray-50 rounded-lg shadow-sm">
            {
                companyMetrics ? (
                    <div cla>
                        {/* <h1 className="text-3xl font-bold text-center mb-6">Company Metrics</h1> */}
                        <div className="grid grid-cols-4 gap-12 ">
                            <div className="flex flex-col items-start p-6 border-r border-gray-400">

                                <span className="text-xs text-gray-500">5 Day Price Return Daily</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["5 Day Price Return Daily"]}</span>
                                <span className="text-xs text-gray-500">13 Week Price Return Daily</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["13 Week Price Return Daily"]}</span>

                                <span className="text-xs text-gray-500">52 Week Price Return Daily</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["52 Week Price Return Daily"]}</span>
                                <span className="text-xs text-gray-500">Price Relative to S&P500 (52 Week)</span>
                                <span className="text-lg font-semibold ">{mapMetrics["Price Relative to S&P500 (52 Week)"]}</span>
                            </div>
                            <div className="flex flex-col items-start p-4 border-r border-gray-400">
                                <span className="text-xs text-gray-500">Beta</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["Beta"]}</span>
                                <span className="text-xs text-gray-500">10 Day Average Trading Volume</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["10 Day Average Trading Volume"]}</span>
                                <span className="text-xs text-gray-500">3 Month Average Trading Volume</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["3 Month Average Trading Volume"]}</span>
                                <span className="text-xs text-gray-500">52 Week High</span>
                                <span className="text-lg font-semibold">{mapMetrics["52 Week High"]}</span>
                            </div>
                            <div className="flex flex-col items-start p-4 border-r border-gray-400">
                                <span className="text-xs text-gray-500">52 Week Low</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["52 Week Low"]}</span>
                                <span className="text-xs text-gray-500">EPS Annual</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["EPS Annual"]}</span>
                                <span className="text-xs text-gray-500">Operating Margin Annual</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["Operating Margin Annual"]}</span>
                                <span className="text-xs text-gray-500">Net Profit Margin Annual</span>
                                <span className="text-lg font-semibold">{mapMetrics["Net Profit Margin Annual"]}</span>
                            </div>
                            <div className="flex flex-col items-start p-4">
                                <span className="text-xs text-gray-500">Revenue Growth (3 Years)</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["Revenue Growth (3 Years)"]}</span>
                                <span className="text-xs text-gray-500">Current Ratio Quarterly</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["Current Ratio Quarterly"]}</span>
                                <span className="text-xs text-gray-500">Long-Term Debt/Equity Annual</span>
                                <span className="text-lg font-semibold pb-3">{mapMetrics["Long-Term Debt/Equity Annual"]}</span>
                                <span className="text-xs text-gray-500">Total Debt/Total Equity Quarterly</span>
                                <span className="text-lg font-semibold">{mapMetrics["Total Debt/Total Equity Quarterly"]}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Waiting for metrics data...</p>
                    </div>
                )
            }
        </div>
    );
}

export default CompanyMetrics;