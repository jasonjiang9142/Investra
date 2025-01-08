# Stock Stimulator
![License](https://img.shields.io/badge/license-MIT-green)
![Docs](https://img.shields.io/badge/docs-read-blue)
![Repo Size](https://img.shields.io/github/repo-size/jasonjiang9142/StockStimulator)


**Stock Stimulator** is a web application that allows users to calculate how much money they would have made if they had invested in a stock at a specific year. It enables stock comparisons by tracking the value progression of multiple stocks, providing key stock information, performance metrics, and recent news.

## Features

- **Stock Investment Simulator:** Calculate the growth of an initial investment in a stock over a selected period.
- **Stock Comparison:** Compare the historical performance of two stocks side-by-side. 
- **Profit Progression:** Generates tailored study sheets to study the focus areas
- **Stock Metrics:** Provides a unique timeline from easy to difficult for each focus area
- **Recent News:** Automatically fetches job descriptions directly from provided URLs through webscraping


## Technologies Used

- **React** and **TailwindCSS**: Frontend interface, logic, and design
- **SpringBoot** & **Spring**:  Application core logic and HTTP API call


## Preview
<p align="center" width="100%">
  <img src="preview/Preview1.png" width="49%"/>
    <img src="preview/Preview2.png" width="49%"/>
</p>

<p align="center" width="100%">
  <img src="preview/Preview3.png" width="65%"/>
  <img src="preview/Preview5.png" width="48%"/>
  <img src="preview/Preview6.png" width="48%"/>
  <img src="preview/Preview4.png" width="48%"/>
</p>

## Demo Video

[![YouTube Video](https://img.youtube.com/vi/YOjBMhZcstM/0.jpg)](https://youtu.be/YOjBMhZcstM)


Click the image to watch the demo video on YouTube.

## Environment Variables

This project requires an **API key** for accessing the **Google Gemini API**. The key is stored securely in a `.env` file. Follow the steps below to configure your environment:

### **Setup Instructions**

1. **Create the `.env` file**  
   Copy the provided `.env.template` file and rename it to `.env`:  
   ```bash
   cp .env.template .env
2. Add Your API Key
   Open the .env file in your preferred editor and replace #your-google-api-key with your actual API key:
   ```bash
   API_KEY=your-google-api-key
   ```

   Example Configuration:
   ```bash
   API_KEY=AIzaSyEXAMPLE12345
   ```
3. Save and Close
   Make sure to save the changes before closing the file.

### **Setup Instructions**
   1. **In the `utils.js` file under /client/src/lib/utils.js**  
   Replace the the provided backend server host from flask to the variable
   ```bash
   export const backendhost = "http://127.0.0.1:5000";
   ```


## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/jasonjiang9142/cramify.ai.git
   cd client
   ```

2. Install dependencies for the client and server:
   Frontend 
   ```bash
   cd client
   npm install
   npm run dev
   ```

   Backend 
   ```bash
   cd server
   pip install -r requirements.txt
   python index.py
   ```

4. Install and configure the database:
   Redis:
   ```bash
   sudo apt update
   sudo apt install redis-server
   sudo systemctl enable redis
   sudo systemctl start redis
   ```

   Apache Cassandra:
   ```bash
   sudo apt update
   sudo apt install cassandra
   sudo systemctl enable cassandra
   sudo systemctl start cassandra
   ```

   Verify installation:
   ```bash
   redis-cli ping
   cqlsh
   ```


## Contributing

Contributions are welcome! If you’d like to improve JobsAI, please fork the repository, make changes, and submit a pull request.  

## License

This project is licensed under the [MIT License](LICENSE).  

