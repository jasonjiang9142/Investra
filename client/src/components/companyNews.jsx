import { useEffect, useState } from "react";

const CompanyNews = ({ companyNews }) => {

    useEffect(() => {
        console.log("---")
        console.log("company news", companyNews)
    }, []);

    return (
        <div>
            {
                companyNews && companyNews.length > 0 ? (
                    <div>
                        <h1>Company News</h1>
                        <ul>
                            {companyNews.map((news, index) => (
                                <li key={news.id || index} style={{ marginBottom: "20px" }}>
                                    <h3>{news.headline}</h3>
                                    <p><strong>Date:</strong> {new Date(news.datetime * 1000).toLocaleDateString()}</p>
                                    <p><strong>Source:</strong> {news.source}</p>
                                    <p><strong>Category:</strong> {news.category}</p>
                                    <p><strong>Summary:</strong> {news.summary}</p>
                                    <p>
                                        <strong>Related:</strong> {news.related}
                                    </p>
                                    <p>
                                        <strong>Read more:</strong>{" "}
                                        <a href={news.url} target="_blank" rel="noopener noreferrer">
                                            {news.url}
                                        </a>
                                    </p>
                                    {news.image && (
                                        <img
                                            src={news.image}
                                            alt={news.headline}
                                            style={{ width: "150px", height: "100px", marginTop: "10px" }}
                                        />
                                    )}
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div>
                        <p>Waiting for news data... company news </p>
                    </div>
                )
            }
        </div>
    );
}
export default CompanyNews;