import { useEffect, useState } from "react";

const CompanyNews = ({ companyNews, companyInfo }) => {
    const [visibleNews, setVisibleNews] = useState(10); // Initially show 10 news articles

    useEffect(() => {
        console.log("---");
        console.log("company news", companyNews);
        console.log("company info", companyInfo);
    }, []);

    // Function to load more news
    const loadMoreNews = () => {
        setVisibleNews((prev) => prev + 10); // Load 10 more news articles
    };

    return (
        <div className="p-6 ">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Recent News: </h1>

            {companyNews && companyNews.length > 0 ? (
                <div className="grid grid-cols-2 gap-8 ">
                    {companyNews.slice(0, visibleNews).map((news, index) => (
                        <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-4 text-sm"
                        >
                            <div
                                key={news.id || index}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow grid grid-cols-3 gap-4 h-[175px]"
                            >

                                <div className='col-span-2'>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-3">{news.headline}</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-600">
                                            {news.source}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            •
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(news.datetime * 1000).toLocaleDateString()}
                                        </p>

                                    </div>

                                    <p className="text-xs text-gray-700 mt-2 line-clamp-3">{news.summary}</p>

                                </div>

                                <div>
                                    {news.image ? (
                                        <img
                                            src={news.image}
                                            alt={news.headline}
                                            className="w-full h-32 object-cover rounded-md mt-4"
                                        />
                                    ) : (
                                        <img
                                            src={companyInfo.logo}
                                            alt="Placeholder"
                                            className="w-full h-32 object-cover rounded-md mt-4"
                                        />

                                    )}

                                </div>


                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Waiting for news data...</p>
            )
            }

            {
                visibleNews < companyNews.length && (
                    <button
                        onClick={loadMoreNews}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        More News
                    </button>
                )
            }
        </div >
    );
};

export default CompanyNews;
