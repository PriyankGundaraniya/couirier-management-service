import React, { useState } from "react";
import logo from "../../images/pavan_logo.jpeg";
import "./header.sass";
import { Link, useNavigate } from "react-router-dom";
import { CONSTANTS, UTILS } from "../../utils/contants";
import { FiLogOut } from "react-icons/fi";
import supabase from "../../supabase/supabaseClient";
import moment from "moment";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Header = () => {
  const navigate = useNavigate();
  const [lr, setLr] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [dateModal, setDateModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onFindDetails = async () => {
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .eq("receipt_no", lr);
    if (!error) {
      console.log("data: ", data);
      navigate("/lr", { state: { data: data, is_dispatched: data[0]?.is_dispatched } });
    } else {
      console.log("error: ", error);
    }
  };

  function handleEnter(event) {
    if (event.keyCode === 13) {
      onFindDetails();
      event.preventDefault();
    }
  }

  const onDownloadAndDelete = async (e) => {
    e?.preventDefault();
    setDateModal(true);
  };

  const confirmDownloadAndDelete = async () => {
    // Fetch the data from Supabase
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .lt(
        "created_at",
        moment(endDate).add(1, "day").format("YYYY-MM-DD")
      )
      .gte("created_at", moment(startDate).format("YYYY-MM-DD"))

    if (!error) {
      if(data.length === 0) {
        setDateModal(false);
        setConfirmationModal(false);
        setTimeout(() => {
          alert("No data found for selected date range.");
        }, 500);
        return;
      }
      // Format the 'created_at' field using moment
      const formattedData = data.map(row => ({
        ...row,
        created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss') // Change format as needed
      }));

      // Convert formatted data to CSV
      const csv = formatToCSV(formattedData);

      // Create a Blob from the CSV data
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      // Create a link element
      const link = document.createElement('a');

      // Create a URL for the Blob and set it as the href attribute of the link
      link.href = URL.createObjectURL(blob);
      link.download = 'parcels.csv';

      // Append the link to the body (it needs to be in the DOM for click to work)
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);
      
      console.log("CSV file downloaded successfully.");
      // setConfirmationModal(false);
      setDateModal(false);
      setConfirmationModal(true);
    } else {
      console.error("Error fetching data:", error);
    }
  }

  const onFinalDelete = async() => {
    const result = await supabase.from("parcels").delete()
      .lt(
        "created_at",
        moment(endDate).add(1, "day").format("YYYY-MM-DD")
      )
      .gte("created_at", moment(startDate).format("YYYY-MM-DD"))
      if (!result.error) {
        alert("Data deleted successfully");
      } else {
        alert("Failed to delete data, try again!");
      }
  }

  // Function to convert array of objects to CSV format
  const formatToCSV = (data) => {
    if (data.length === 0) return '';

    // Extract headers
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers to CSV
    csvRows.push(headers.join(','));

    // Add rows to CSV
    for (const row of data) {
      const values = headers.map(header => JSON.stringify(row[header] || ''));
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  return (
    <header>
      <div className="container">
        <div className="row align-center">
          <div className="col-12">
            <div className="zn__header-wrapper">
              <div className="d-flex align-center gap">
                <div className="zn__header-logo">
                  <Link to="/">
                    <img src={logo} alt="logo" />
                  </Link>
                </div>
                <nav className="zn__header-menu">
                  <ul>
                    {/* {localStorage.getItem(CONSTANTS.USER_TYPE) === "admin" ? <li className="zn__main-menu-list">
                      <Link to="/setting/items" className="btn btn-primary">
                        Setting
                      </Link>
                    </li> : null} */}
                    {localStorage.getItem(CONSTANTS.USER_TYPE) === "admin" ? <li className="zn__main-menu-list">
                      <a href=" " className="btn btn-primary" onClick={onDownloadAndDelete}>
                        Download
                      </a>
                    </li> : null}
                  </ul>
                </nav>
              </div>
              <div className="zn__header-btn">
                {/* {localStorage.getItem(CONSTANTS.USER_TYPE) !== "admin" ?  */}
                <form className="header_form">
                  <input
                    onKeyDown={handleEnter}
                    // type="number"
                    placeholder="Enter LR Number"
                    className="header_input"
                    value={lr}
                    onChange={(e) => {
                      setLr(e.target.value);
                    }}
                  />
                  <Link
                    to=""
                    className="btn btn-primary"
                    onClick={onFindDetails}
                  >
                    Find Details
                  </Link>
                </form> 
                {/* : null} */}

                <button
                  className="btn btn-primary ms-5"
                  onClick={() => {
                    localStorage.removeItem(CONSTANTS.BRANCH);
                    localStorage.removeItem(CONSTANTS.USER_TYPE);
                    navigate("/login");
                  }}
                >
                  Logout
                  <FiLogOut className="ms-2" size={25} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* final delete modal */}
      <Modal show={confirmationModal} centered onHide={() => setConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Parcel Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete downloaded parcel data from the database? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setConfirmationModal(false)} className="btn btn-secondary">
            No
          </button>
          <button onClick={onFinalDelete} className="btn btn-primary">
            Yes
          </button>
        </Modal.Footer>
      </Modal>

      {/* date modal */}
      <Modal show={dateModal} centered onHide={() => setDateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Download</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form action="" className="form_control_wrapper align-items-center">
          <>
            {" "}
            <div className="days_count d-flex gap-3 align-center">
              {/* <h6>Date : </h6> */}
              <div className="text-dark d-flex align-items-center gap-3">
                <div className="">From: </div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  maxDate={new Date()}
                />
                <div className="">To: </div>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  maxDate={new Date()}
                />
              </div>
            </div>
            {/* <div className="line mt-5"></div> */}
          </>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={confirmDownloadAndDelete} className="btn btn-primary">
            Download
          </button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;
