const ReturnOnInvestment = ({ startDate, endDate, currentPrice, previousPrice, returnOnInvestment }) => {
    return (
        <div>
            {startDate && endDate && currentPrice && previousPrice && returnOnInvestment ? (
                <div>
                    <h1>Return on Investment</h1>
                    <p>Start Date: {startDate}</p>
                    <p>End Date: {endDate}</p>
                    <p>Current Price: {currentPrice}</p>
                    <p>Previous Price: {previousPrice}</p>
                    <p>Return on Investment: {returnOnInvestment}</p>
                </div>
            ) : (
                <div>
                    <p>Waiting for data...</p>
                </div>
            )}

        </div>
    )
}


export default ReturnOnInvestment;