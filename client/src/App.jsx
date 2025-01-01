import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import { DatePickerForm } from "./routes/datepickerform";
import Root from "./routes/root";


function App() {
  return (
    <div className=''>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<DatePickerForm />} />
          <Route path="/test" element={<Root />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;