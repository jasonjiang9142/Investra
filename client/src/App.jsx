import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StockInfo from "./routes/stockinfo";
import Navbar from "./components/navbar";
import { DatePickerForm } from "./routes/datepickerform";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DatePickerForm />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;