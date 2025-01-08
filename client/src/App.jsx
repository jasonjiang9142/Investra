import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import Root from "./routes/root";
import CompareStocks from "./routes/compareStocks";


function App() {
  return (
    <div className=''>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/compare" element={<CompareStocks />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;