import { BrowserRouter, Routes, Route } from "react-router-dom";
import HelloWorld from "./HelloWorld";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HelloWorld />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
