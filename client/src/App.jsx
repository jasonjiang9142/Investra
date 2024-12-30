import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StockInfo from "./routes/stockinfo";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StockInfo />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;