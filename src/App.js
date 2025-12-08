import Routing from "./Routing";
import React from "react";
import LoaderHelper from "./customComponent/Loading/LoaderHelper";
import Loading from "./customComponent/Loading";

function App() {
  return (
    <>
      <Routing />
      <Loading ref={ref => LoaderHelper.setLoader(ref)} />
    </>
  );
}

export default App;
