import { useEffect } from "react";

const CompanyMetrics = ({ companyMetrics }) => {

    useEffect(() => {
        console.log("Entering Company Metrics Page");
    })
    // Define the keys of the metrics to display
    const metricKeys = [
        "5DayPriceReturnDaily",
        "13WeekPriceReturnDaily",
        "52WeekPriceReturnDaily",
        "priceRelativeToS&P50052Week",
        "beta",
        "10DayAverageTradingVolume",
        "3MonthAverageTradingVolume",
        "52WeekHigh",
        "52WeekLow",
        "epsAnnual",
        "operatingMarginAnnual",
        "netProfitMarginAnnual",
        "revenueGrowth3Y",
        "currentRatioQuarterly",
        "longTermDebtEquityAnnual",
        "totalDebtTotalEquityQuarterly",
    ];

    // Use the provided companyMetrics to map the values, adding fallback if any metric is missing
    const mapMetrics = metricKeys.reduce((acc, key) => {
        acc[key] = companyMetrics[key] || "Data not available"; // Use fallback if key is missing
        return acc;
    }, {});
    return (
        <div className="m-6 p-5 mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
            {companyMetrics ? (
                <div>
                    {/* Dynamically generate the grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {metricKeys.map((key, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-start p-6 bg-gray-100 rounded-lg shadow-sm transition-all hover:shadow-lg hover:bg-gray-200"
                            >
                                <span className="text-sm text-gray-600 mb-2">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="text-xl font-semibold text-gray-800">
                                    {mapMetrics[key]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>Waiting for metrics data...</p>
                </div>
            )}
        </div>
    );
}

export default CompanyMetrics;