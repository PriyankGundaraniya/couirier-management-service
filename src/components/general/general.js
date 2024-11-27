import React, { useRef } from "react";
import { Document } from "../../general/document";
import { Link, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import BottomDoc from "../../general/bottomDoc";
import { DocumentPrint } from "./dummy";
import "./style.css";

const General = () => {
  const generalRef = useRef();
  const generalRef2 = useRef();
  const { state } = useLocation();
  const { data, dates, type } = state;
  console.log("state data: ", data);
  const dummay = data.filter((item) => !item?.returned);
  const handlePrint = useReactToPrint({
    content: () => generalRef2.current,
  });

  return (
    <>
      <Document ref={generalRef} data={data} dates={dates} type={type} />
      {/* <BottomDoc /> */}
      <div className="d-flex align-items-center temo justify-content-center my-4">
        <DocumentPrint ref={generalRef2} data={dummay} dates={dates} />
        <button className="btn btn-primary" onClick={handlePrint}>
          Print
        </button>
      </div>
    </>
  );
};

export default General;
