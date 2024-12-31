const CompanyMetrics = ({ companyMetrics }) => {
    return (
        <div>
            {
                companyMetrics ? (
                    <div>
                        <h1>Company Metrics</h1>
                        <ul>
                            {Object.entries(companyMetrics).map(([key, value], index) => (
                                <li key={index} style={{ marginBottom: "10px" }}>
                                    <strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div>
                        <p>Waiting for metrics data...</p>
                    </div>
                )
            }
        </div>
    );
}

export default CompanyMetrics;