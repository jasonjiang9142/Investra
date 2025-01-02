import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import Root from "./routes/root";


function App() {
  return (
    <div className=''>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Root />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;