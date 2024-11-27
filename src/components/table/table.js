import React, { useEffect, useRef, useState } from "react";
import "./table.sass";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import supabase from "../../supabase/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CONSTANTS } from "../../utils/contants";
import { Document } from "../../general/document";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

const Table = () => {
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(null);
  const [type, setType] = useState("general");
  const [dispatchModal, setDispatchModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const onFindDetails = async (lr) => {
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .eq("receipt_no", lr);
    if (!error) {
      console.log("data: ", data);
      navigate("/lr", { state: { data: data } });
    } else {
      console.log("error: ", error);
    }
  };

  async function getData() {
    const { data, error } = await supabase.from("parcels").select("*");
    if (!error) {
      if (localStorage.getItem(CONSTANTS.BRANCH) === "Hirabagh (HO)") {
        const filteredData = data.filter(
          (item) =>
            new Date(item?.created_at).toLocaleDateString() ===
            new Date().toLocaleDateString()
        );
        setData(filteredData);
      } else if(localStorage.getItem(CONSTANTS.BRANCH) === "Mumbai Borivali (BO)"){
        const filteredData = data.filter(
          (item) =>
            new Date(item?.created_at).toLocaleDateString() ===
            new Date().toLocaleDateString() &&
            item.branch?.includes("Mumbai")
        );
        setData(filteredData);
      } else {
        const filteredData = data.filter(
          (item) =>
            new Date(item?.created_at).toLocaleDateString() ===
            new Date().toLocaleDateString() &&
            item.branch === localStorage.getItem(CONSTANTS.BRANCH)
        );
        setData(filteredData);
      }
    } else {
      throw new Error(error);
    }
  }

  const onDateFind = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .gte("created_at", moment(date).format("YYYY-MM-DD"));
    if (!error) {
      const parcels = data.filter(
        (parcel) => parcel.branch === localStorage.getItem(CONSTANTS.BRANCH)
      );
      navigate("/general", {
        state: { data: parcels, dates: { startDate: date, endDate: date } },
      });
    } else {
      throw new Error(error);
    }
  };

  const getTotal = () => {
    var quantity = 0;
    var total_amount = 0;

    for (let i = 0; i < data?.length; i++) {
      if (data[i].returned === false) {
        quantity += Number(data[i].quantity);
        total_amount += Number(data[i].total_amount);
      }
    }
    return { quantity: quantity, total_amount: total_amount };
  };

  const { quantity, total_amount } = getTotal();

  // modal component
  function MyVerticallyCenteredModal(props) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [branches, setBranches] = useState([]);
    const [placeToSend, setPlaceToSend] = useState([]);
    const [data, setData] = useState([]);
    const [sentBranch, setSentBranch] = useState("");
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedPlaceToSend, setSelectedPlaceToSend] = useState([]);

    const generalRef = useRef();
    const navigate = useNavigate();

    const handlePrint = useReactToPrint({
      content: () => generalRef.current,
    });

    useEffect(() => {
      getBranches();
      getPlaceToSend();
    }, []);

    useEffect(() => {
      if (data.length > 0) {
        // handlePrint();
        navigate("/general", {
          state: {
            data: data,
            dates: { startDate: startDate, endDate: endDate },
            type: type,
          },
        });
      }
    }, [data]);

    const getBranches = async () => {
      const { data, error } = await supabase.from("branches").select("*");
      if (!error) {
        // console.log("data: ", data);
        setBranches(data?.filter(item => item.type !== "admin"));
      } else {
        console.log("error: ", error);
      }
    };

    const getPlaceToSend = async () => {
      // const { data, error } = await supabase.from("place_to_send").select("*");
      // if (!error) {
      //   //   console.log("data: ", data);
      //   setPlaceToSend(data);
      // } else {
      //   console.log("error: ", error);
      // }

      const access = await supabase.from("access_branch").select("*").eq("branch", localStorage.getItem(CONSTANTS.BRANCH_ID));
      if(!access.error){
        if(access.data.length > 0){
          let data = JSON.parse(access.data[0].places);
          setPlaceToSend(data.map(branch => ({place_to_send: branch})));
        }
      } else {
      console.log("error: ", access.error);
    }
    };

    const getGeneralData = async () => {
      if (startDate.getDate() !== endDate.getDate()) {
        if (type === "general") {
          const { data, error } = await supabase
            .from("parcels")
            .select("*")
            .lt(
              "created_at",
              moment(endDate).add(1, "day").format("YYYY-MM-DD")
            )
            .gte("created_at", moment(startDate).format("YYYY-MM-DD"))
            .eq("branch", localStorage.getItem(CONSTANTS.BRANCH));

          if (!error) {
            const finalFiltered = data.filter((shipment) => {
              return selectedPlaceToSend.some(
                (place) => place.place_to_send === shipment.place_to_send
              );
            });
            // console.log("final data: ", finalFiltered)
            if (finalFiltered.length === 0) {
              alert("No data found!");
              return;
            }
            navigate("/general", {
              state: {
                data: finalFiltered,
                dates: { startDate: startDate, endDate: endDate },
                type: type,
              },
            });
          } else {
            console.log("error: ", error);
          }
        } else if (type === "dispatch") {
          const { data, error } = await supabase
            .from("parcels")
            .select("*")
            // .lt(
            //   "created_at",
            //   moment(endDate).add(1, "day").format("YYYY-MM-DD")
            // )
            // .gte("created_at", moment(startDate).format("YYYY-MM-DD"))
            .eq("branch", localStorage.getItem(CONSTANTS.BRANCH))
            .eq("is_dispatched", false);

          if (!error) {
            const finalFiltered = data.filter((shipment) => {
              return selectedPlaceToSend.some(
                (place) => place.place_to_send === shipment.place_to_send
              );
            });
            // console.log("final data: ", finalFiltered)
            if (finalFiltered.length === 0) {
              alert("No data found!");
              return;
            }
            navigate("/general", {
              state: {
                data: finalFiltered,
                dates: { startDate: startDate, endDate: endDate },
                type: type,
              },
            });
          } else {
            console.log("error: ", error);
          }
        }
        // else if (type === "deliver") {
        //   const { data, error } = await supabase
        //     .from("parcels")
        //     .select("*")
        //     // .lt(
        //     //   "created_at",
        //     //   moment(endDate).add(1, "day").format("YYYY-MM-DD")
        //     // )
        //     // .gte("created_at", moment(startDate).format("YYYY-MM-DD"))
        //     .eq("branch", localStorage.getItem(CONSTANTS.BRANCH))
        //     .eq("is_dispatched", true);

        //   if (!error) {
        //     const finalFiltered = data.filter((shipment) => {
        //       return selectedPlaceToSend.some(
        //         (place) => place.place_to_send === shipment.place_to_send
        //       );
        //     });
        //     // console.log("final data: ", finalFiltered)
        //     if (finalFiltered.length === 0) {
        //       alert("No data found!");
        //       return;
        //     }
        //     navigate("/general", {
        //       state: {
        //         data: finalFiltered,
        //         dates: { startDate: startDate, endDate: endDate },
        //         type: type,
        //       },
        //     });
        //   } else {
        //     console.log("error: ", error);
        //   }
        // }
      } else {
        if (type === "general") {
          const { data, error } = await supabase
            .from("parcels")
            .select("*")
            .eq("branch", localStorage.getItem(CONSTANTS.BRANCH));

          let particularDateData = data.filter(
            (parcel) =>
              new Date(parcel.created_at).toLocaleDateString() ===
              new Date(startDate).toLocaleDateString()
          );

          const finalFiltered = particularDateData.filter((shipment) => {
            return selectedPlaceToSend.some(
              (place) => place.place_to_send === shipment.place_to_send
            );
          });
          // console.log("final data: ", finalFiltered)
          if (finalFiltered.length === 0) {
            alert("No data found!");
            return;
          }
          navigate("/general", {
            state: {
              data: finalFiltered,
              dates: { startDate: startDate, endDate: endDate },
              type: type,
            },
          });
        } else if (type === "dispatch") {
          const { data, error } = await supabase
            .from("parcels")
            .select("*")
            .eq("branch", localStorage.getItem(CONSTANTS.BRANCH))
            .eq("is_dispatched", false);

          // let particularDateData = data.filter(
          //   (parcel) =>
          //     new Date(parcel.created_at).toLocaleDateString() ===
          //     new Date(startDate).toLocaleDateString()
          // );

          const finalFiltered = data.filter((shipment) => {
            return selectedPlaceToSend.some(
              (place) => place.place_to_send === shipment.place_to_send
            );
          });
          // console.log("final data: ", finalFiltered)
          if (finalFiltered.length === 0) {
            alert("No data found!");
            return;
          }
          navigate("/general", {
            state: {
              data: finalFiltered,
              dates: { startDate: startDate, endDate: endDate },
              type: type,
            },
          });
        }
        // else if (type === "deliver") {
        //   const { data, error } = await supabase
        //     .from("parcels")
        //     .select("*")
        //     .eq("branch", localStorage.getItem(CONSTANTS.BRANCH))
        //     .eq("is_dispatched", true);

        //   // let particularDateData = data.filter(
        //   //   (parcel) =>
        //   //     new Date(parcel.created_at).toLocaleDateString() ===
        //   //     new Date(startDate).toLocaleDateString()
        //   // );

        //   const finalFiltered = data.filter((shipment) => {
        //     return selectedPlaceToSend.some(
        //       (place) => place.place_to_send === shipment.place_to_send
        //     );
        //   });
        //   // console.log("final data: ", finalFiltered)
        //   if (finalFiltered.length === 0) {
        //     alert("No data found!");
        //     return;
        //   }
        //   navigate("/general", {
        //     state: {
        //       data: finalFiltered,
        //       dates: { startDate: startDate, endDate: endDate },
        //       type: type,
        //     },
        //   });
        // }
      }
    };

    const getMainBranchData = async () => {
      console.log("hirabagh general");
      if (startDate.getDate() !== endDate.getDate()) {
        if (type === "general") {
          const { data, error } = await supabase
            .from("parcels")
            .select("*")
            .gte("created_at", moment(startDate).startOf('day').toISOString())
            .lt("created_at", moment(endDate).add(1, 'day').startOf('day').toISOString());
          if (!error) {
            // console.log("data: ", data.map(item => moment(item.created_at).format("DD-MM-YYYY hh:mm a")));
            const filteredShipments = data.filter((shipment) => {
              return selectedBranches.some(
                (branch) => branch.branch_name === shipment.branch
              );
            });
            // console.log("actual data: ", filteredShipments)
            const finalFiltered = filteredShipments.filter((shipment) => {
              return selectedPlaceToSend.some(
                (place) => place.place_to_send === shipment.place_to_send
              );
            });
            // console.log("final data: ", finalFiltered)
            if (finalFiltered.length === 0) {
              alert("No data found!");
              return;
            }
            navigate("/general", {
              state: {
                data: finalFiltered,
                dates: { startDate: startDate, endDate: endDate },
                type: type,
              },
            });
          } else {
            console.log("error: ", error);
          }
        } else if (type === " dispatch") {
          const { data, error } = await supabase
            .from("parcels")
            .select("*")
            // .lt(
            //   "created_at",
            //   moment(endDate).add(1, "day").format("YYYY-MM-DD")
            // )
            // .gte("created_at", moment(startDate).format("YYYY-MM-DD"))
            .eq("is_dispatched", false);
          if (!error) {
            const filteredShipments = data.filter((shipment) => {
              return selectedBranches.some(
                (branch) => branch.branch_name === shipment.branch
              );
            });
            // console.log("actual data: ", filteredShipments)
            const finalFiltered = filteredShipments.filter((shipment) => {
              return selectedPlaceToSend.some(
                (place) => place.place_to_send === shipment.place_to_send
              );
            });
            // console.log("final data: ", finalFiltered)
            if (finalFiltered.length === 0) {
              alert("No data found!");
              return;
            }
            navigate("/general", {
              state: {
                data: finalFiltered,
                dates: { startDate: startDate, endDate: endDate },
                type: type,
              },
            });
          } else {
            console.log("error: ", error);
          }
        }
        // else if (type === "deliver") {
        //   const { data, error } = await supabase
        //     .from("parcels")
        //     .select("*")
        //     // .lt(
        //     //   "created_at",
        //     //   moment(endDate).add(1, "day").format("YYYY-MM-DD")
        //     // )
        //     // .gte("created_at", moment(startDate).format("YYYY-MM-DD"))
        //     .eq("is_dispatched", true);
        //   if (!error) {
        //     const filteredShipments = data.filter((shipment) => {
        //       return selectedBranches.some(
        //         (branch) => branch.branch_name === shipment.branch
        //       );
        //     });
        //     // console.log("actual data: ", filteredShipments)
        //     const finalFiltered = filteredShipments.filter((shipment) => {
        //       return selectedPlaceToSend.some(
        //         (place) => place.place_to_send === shipment.place_to_send
        //       );
        //     });
        //     // console.log("final data: ", finalFiltered)
        //     if (finalFiltered.length === 0) {
        //       alert("No data found!");
        //       return;
        //     }
        //     navigate("/general", {
        //       state: {
        //         data: finalFiltered,
        //         dates: { startDate: startDate, endDate: endDate },
        //         type: type,
        //       },
        //     });
        //   } else {
        //     console.log("error: ", error);
        //   }
        // }
      } else {
        if (type === "general") {
          const { data } = await supabase.from("parcels").select("*");
          let particularDateData = data.filter(
            (parcel) => moment(startDate).get("date") === moment(parcel?.created_at).get("date") && moment(startDate).get("month") === moment(parcel?.created_at).get("month")
              // new Date(parcel.created_at).toLocaleDateString() ===
              // new Date(startDate).toLocaleDateString()
          );

          const filteredShipments = particularDateData.filter((shipment) => {
            return selectedBranches.some(
              (branch) => branch.branch_name === shipment.branch
            );
          });
          // const finalFiltered = filteredShipments;
          // console.log("actual data: ", filteredShipments)
          const finalFiltered = filteredShipments.filter((shipment) => {
            return selectedPlaceToSend.some(
              (place) => place.place_to_send === shipment.place_to_send
            );
          });
          // console.log("final data: ", finalFiltered)
          if (finalFiltered.length === 0) {
            alert("No data found!");
            return;
          }
          navigate("/general", {
            state: {
              data: finalFiltered,
              dates: { startDate: startDate, endDate: endDate },
              type: type,
            },
          });
        } else if (type === "dispatch") {
          const { data, error } = await supabase
            .from("parcels")
            .select("*")
            .eq("is_dispatched", false);
          // let particularDateData = data.filter(
          //   (parcel) =>
          //     new Date(parcel.created_at).toLocaleDateString() ===
          //     new Date(startDate).toLocaleDateString()
          // );

          const filteredShipments = data.filter((shipment) => {
            return selectedBranches.some(
              (branch) => branch.branch_name === shipment.branch
            );
          });
          // console.log("actual data: ", filteredShipments)
          const finalFiltered = filteredShipments.filter((shipment) => {
            return selectedPlaceToSend.some(
              (place) => place.place_to_send === shipment.place_to_send
            );
          });
          // console.log("final data: ", finalFiltered)
          if (finalFiltered.length === 0) {
            alert("No data found!");
            return;
          }
          navigate("/general", {
            state: {
              data: finalFiltered,
              dates: { startDate: startDate, endDate: endDate },
              type: type,
            },
          });
        }
        // else if (type === "deliver") {
        //   const { data, error } = await supabase
        //     .from("parcels")
        //     .select("*")
        //     .eq("is_dispatched", true);
        //   // let particularDateData = data.filter(
        //   //   (parcel) =>
        //   //     new Date(parcel.created_at).toLocaleDateString() ===
        //   //     new Date(startDate).toLocaleDateString()
        //   // );

        //   const filteredShipments = data.filter((shipment) => {
        //     return selectedBranches.some(
        //       (branch) => branch.branch_name === shipment.branch
        //     );
        //   });
        //   // console.log("actual data: ", filteredShipments)
        //   const finalFiltered = filteredShipments.filter((shipment) => {
        //     return selectedPlaceToSend.some(
        //       (place) => place.place_to_send === shipment.place_to_send
        //     );
        //   });
        //   // console.log("final data: ", finalFiltered)
        //   if (finalFiltered.length === 0) {
        //     alert("No data found!");
        //     return;
        //   }
        //   navigate("/general", {
        //     state: {
        //       data: finalFiltered,
        //       dates: { startDate: startDate, endDate: endDate },
        //       type: type,
        //     },
        //   });
        // }
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {type === "general" ? "General" : type === "dispatch" ? "Deliver" :  ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="" className="form_control_wrapper">
            {type === "general" && (
              <>
                {" "}
                <div className="days_count d-flex gap-3 align-center">
                  <h6>Date : </h6>
                  <div className="text-dark d-flex align-items-center gap-3">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      maxDate={new Date()}
                    />
                    <div className="">to</div>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
                <div className="line mt-5"></div>
              </>
            )}

            <div className="send-to-rec d-flex justify-content-between align-items-center">
              <div className="flex flex-column">
                {localStorage.getItem(CONSTANTS.BRANCH)?.includes("(HO)") ? (
                  <Select
                    options={branches}
                    getOptionLabel={(option) => `${option.branch_name}`}
                    getOptionValue={(option) => `${option.branch_name}`}
                    isMulti
                    isSearchable={true}
                    value={selectedBranches}
                    onChange={(value) => setSelectedBranches(value)}
                  />
                ) : localStorage.getItem(CONSTANTS.BRANCH)?.includes("(SA)") ? (
                  <Select
                    options={branches}
                    getOptionLabel={(option) => `${option.branch_name}`}
                    getOptionValue={(option) => `${option.branch_name}`}
                    isMulti
                    isSearchable={true}
                    value={selectedBranches}
                    onChange={(value) => setSelectedBranches(value)}
                  />
                ) : (
                  <select
                    name=""
                    id=""
                    disabled
                    className="w-100 general_delivery"
                  >
                    <option value={localStorage.getItem(CONSTANTS.BRANCH)}>
                      {localStorage.getItem(CONSTANTS.BRANCH)}
                    </option>
                  </select>
                )}
                <div className="text-center mt-2">
                  <Button onClick={() => setSelectedBranches(branches)}>
                    Select All
                  </Button>
                </div>
              </div>
              <p className="px-3">To</p>

              <div className="flex flex-column">
                <Select
                  options={placeToSend}
                  getOptionLabel={(option) => `${option.place_to_send}`}
                  getOptionValue={(option) => `${option.place_to_send}`}
                  isSearchable={true}
                  isMulti
                  value={selectedPlaceToSend}
                  onChange={(value) => setSelectedPlaceToSend(value)}
                />
                <div className="text-center mt-2">
                  <Button onClick={() => setSelectedPlaceToSend(placeToSend)}>
                    Select All
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() =>
              localStorage.getItem(CONSTANTS.BRANCH)?.includes("(HO)")
                ? getMainBranchData()
                : localStorage.getItem(CONSTANTS.BRANCH)?.includes("(SA)")
                  ? getMainBranchData()
                  : getGeneralData()
            }
          >
            {type === "general" ? "Create General" : type === "dispatch" ? "Show Deliver" : ""}
          </Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <section className="pt__table_print mb-5">
      <div className="container">
        <div className="row justify-between">
          <div className="table-other gap-30 col-8">
            <Button
              variant="primary"
              className="pt__lr_item time_btn"
              onClick={() => {
                setType("general");
                setModalShow(true);
              }}
            >
              General
            </Button>
            <Button
              variant="primary"
              className="pt__lr_item time_btn"
              onClick={() => {
                setType("dispatch");
                setDispatchModal(true);
              }}
            >
              Deliver
            </Button>
            {/* <Button
              variant="primary"
              className="pt__lr_item time_btn"
              onClick={() => {
                setType("deliver");
                setModalShow(true);
              }}
            >
              Deliver
            </Button> */}

            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <DispatchModal
              show={dispatchModal}
              onHide={() => setDispatchModal(false)}
            />
          </div>
          <div className="search_lr col-4">
            <form className="header_form">
              {/* <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                maxDate={new Date()}
              /> */}
              <input
                type="date"
                placeholder="Select date"
                className="header_input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
              <input
                type="submit"
                className="btn"
                value="Find Details"
                onClick={onDateFind}
              />
            </form>
          </div>
        </div>
        <div className="row">
          <div className="pt__table-data">
            <table cellPadding="0" cellSpacing="0">
              <tr>
                <th>Date</th>
                <th>Receipt No.</th>
                <th>Sender Name</th>
                <th>Receiver Name</th>
                <th>Item Detail</th>
                <th>Quantity No.</th>
                <th>Total Amount</th>
                <th>Payment Type</th>
                <th>Place to send</th>
                <th>Print & Action</th>
              </tr>
              {data.map((item, index) => (
                <tr className={item?.returned ? "bg-danger" : "bg-light"}>
                  <td>{new Date(item?.created_at).toLocaleDateString()}</td>
                  <td>
                    {" "}
                    <Link
                      className="btn-success btn"
                      onClick={() => onFindDetails(item?.receipt_no)}
                    >
                      {" "}
                      {item?.receipt_no}{" "}
                    </Link>
                  </td>
                  <td>{item?.sender_name}</td>
                  <td>{item?.receiver_name}</td>
                  <td>{item?.item_detail}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.total_amount}</td>
                  <td
                    className={
                      item?.payment_type === "Paid"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {item?.payment_type}
                  </td>
                  <td>{item?.place_to_send}</td>
                  <td>Print & Action</td>
                </tr>
              ))}
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td className="fw-bolder">{quantity}</td>
                <td className="fw-bolder">{total_amount}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;

const DispatchModal = ({ show, onHide }) => {
  const navigate = useNavigate();
  const [lr, setLr] = useState(null);
  const [error, setError] = useState("");

  const getLrData = async () => {
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .eq("receipt_no", lr);
    if (!error) {
      console.log("data: ", data);
      if(data?.length === 0){
        setError("Couldn't find data for that");
        return;  
      }
      setError("");
      navigate("/lr", { state: { data: data, is_dispatched: data[0]?.is_dispatched } });
    } else {
      setError("Couldn't find data for that")
      console.log("error: ", error);
    }
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Deliver
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          className="form-control border"
          placeholder="Enter LR Number"
          value={lr}
          onChange={e => setLr(e.target.value)}
        />
        {error && <div className="text-danger">{error}</div>}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
        <Button
          onClick={() => {
            getLrData();
          }}
        >
          Deliver
        </Button>
      </Modal.Footer>
    </Modal>
  )
}