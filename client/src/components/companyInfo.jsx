const CompanyInfo = ({ companyInfo }) => {
    return (
        <div>
            {
                companyInfo ? (
                    <div>
                        <h1>Company Info</h1>
                        <p><strong>Name:</strong> {companyInfo.name}</p>
                        <p><strong>Ticker:</strong> {companyInfo.ticker}</p>
                        <p><strong>Industry:</strong> {companyInfo.finnhubIndustry}</p>
                        <p><strong>Country:</strong> {companyInfo.country}</p>
                        <p><strong>Currency:</strong> {companyInfo.currency}</p>
                        <p><strong>Estimate Currency:</strong> {companyInfo.estimateCurrency}</p>
                        <p><strong>Exchange:</strong> {companyInfo.exchange}</p>
                        <p><strong>IPO Date:</strong> {companyInfo.ipo}</p>
                        <p><strong>Market Cap:</strong> ${companyInfo.marketCapitalization.toFixed(2)} Billion</p>
                        <p><strong>Shares Outstanding:</strong> {companyInfo.shareOutstanding}</p>
                        <p><strong>Phone:</strong> {companyInfo.phone}</p>
                        <p><strong>Website:</strong> <a href={companyInfo.weburl} target="_blank" rel="noopener noreferrer">{companyInfo.weburl}</a></p>
                        <p><strong>Logo:</strong></p>
                        <img src={companyInfo.logo} alt={`${companyInfo.name} logo`} style={{ width: "100px", height: "100px" }} />

                    </div>
                ) : (
                    <div>
                        <p>Waiting for data...</p>
                    </div>
                )
            }
        </div>

    );
}


export default CompanyInfo;