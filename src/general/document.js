import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./style.css";
import moment from "moment";
import supabase from "../supabase/supabaseClient";
import { DispatchDocPrint } from "../components/dispatchdoc/DispatchDoc";
import { useReactToPrint } from "react-to-print";

export const Document = forwardRef((props, ref) => {
  const dispatchRef = useRef();
  const getTotal = () => {
    var quantity = 0;
    var paid = 0;
    var paid_online = 0;
    var paid_manual = 0;
    var to_pay = 0;
    var to_pay_online = 0;
    var to_pay_manual = 0;

    for (let i = 0; i < props?.data?.length; i++) {
      if (props?.data[i]?.returned === false) {
        quantity += Number(props?.data[i].quantity);
      }
      if (
        props?.data[i]?.payment_type === "Paid" &&
        props?.data[i]?.returned === false
      ) {
        paid += Number(props?.data[i].total_amount);
      }
      if (
        props?.data[i]?.payment_type === "Paid" &&
        props?.data[i]?.add_type === "online" &&
        props?.data[i]?.returned === false
      ) {
        paid_online += Number(props?.data[i].total_amount);
      }
      if (
        props?.data[i]?.payment_type === "Paid" &&
        props?.data[i]?.add_type === "manual" &&
        props?.data[i]?.returned === false
      ) {
        paid_manual += Number(props?.data[i].total_amount);
      }
      if (
        props?.data[i]?.payment_type === "To Pay" &&
        props?.data[i]?.returned === false
      ) {
        to_pay += Number(props?.data[i].total_amount);
      }
      if (
        props?.data[i]?.payment_type === "To Pay" &&
        props?.data[i]?.add_type === "online" &&
        props?.data[i]?.returned === false
      ) {
        to_pay_online += Number(props?.data[i].total_amount);
      }
      if (
        props?.data[i]?.payment_type === "To Pay" &&
        props?.data[i]?.add_type === "manual" &&
        props?.data[i]?.returned === false
      ) {
        to_pay_manual += Number(props?.data[i].total_amount);
      }
    }
    return {
      quantity: quantity,
      paid: paid,
      to_pay: to_pay,
      paid_online: paid_online,
      paid_manual: paid_manual,
      to_pay_online: to_pay_online,
      to_pay_manual: to_pay_manual,
    };
  };

  const {
    quantity,
    paid,
    to_pay,
    paid_online,
    paid_manual,
    to_pay_online,
    to_pay_manual,
  } = getTotal();

  const prevSortedData = props?.data?.sort((a, b) => {
    const patternA = a.receipt_no.split("/");
    const patternB = b.receipt_no.split("/");

    const keyA = patternA[0];
    const keyB = patternB[0];
    const valueA = parseInt(patternA[1]);
    const valueB = parseInt(patternB[1]);

    if (keyA < keyB) {
      return -1;
    } else if (keyA > keyB) {
      return 1;
    } else {
      return valueA - valueB;
    }
  });

  const [sortedData, setSortedData] = useState(prevSortedData);
  const [selectedParcels, setSelectedParcels] = useState([]);

  const selectAll = () => {
    if (selectedParcels.length === sortedData.length) {
      setSelectedParcels([]);
    } else {
      setSelectedParcels(sortedData);
    }
  };

  // const dispatchSelected = async () => {
  //   selectedParcels.map(async (parcel) => {
  //     const { data, error } = await supabase
  //       .from("parcels")
  //       .update({ is_dispatched: true })
  //       .eq("ids", parcel.ids);
  //     if (!error) {
  //       console.log("data: ", data);
  //     } else {
  //       console.log("error: ", error);
  //     }
  //   });
  //   const selectedParcelsIds = new Set(selectedParcels.map((item) => item.ids));
  //   const afterRemoval = sortedData.filter(
  //     (item) => !selectedParcelsIds.has(item.ids)
  //   );
  //   setSortedData(afterRemoval);
  //   handlePrint();
  //   setSelectedParcels([]);
  // };

  // const deliverSelected = async () => {
  //   selectedParcels.map(async (parcel) => {
  //     const { data, error } = await supabase
  //       .from("parcels")
  //       .update({ is_delivered: true })
  //       .eq("ids", parcel.ids);
  //     if (!error) {
  //       console.log("data: ", data);
  //     } else {
  //       console.log("error: ", error);
  //     }
  //   });
  //   const selectedParcelsIds = new Set(selectedParcels.map((item) => item.ids));
  //   const afterRemoval = sortedData.filter(
  //     (item) => !selectedParcelsIds.has(item.ids)
  //   );
  //   setSortedData(afterRemoval);
  //   handlePrint();
  //   setSelectedParcels([]);
  // };

  const handlePrint = useReactToPrint({
    content: () => dispatchRef.current,
  });

  return (
    <div ref={ref} className="booking_report">
      <div className="d-none">
        <DispatchDocPrint ref={dispatchRef} data={selectedParcels} />
      </div>
      <div className="booking_report_title">
        <h4>Pavan Transport Company</h4>
        <p>
          Address: KRISHNA NAGAR SOCIETY, BESIDE LAXMI HOTEL, OPP. DOCTOR HOUSE,
          NR HIRABAUGH
        </p>
        <h5>Booking Register Report</h5>
      </div>
      <div className="d-flex align-center justify-between mb-2">
        {props.type === "general" && (
          <p>
            Date:{" "}
            {moment(props?.dates?.startDate).format("DD-MM-YYYY") +
              " - " +
              moment(props?.dates?.endDate).format("DD-MM-YYYY")}
          </p>
        )}
        <div></div>
        <div>
          {/* <button className="btn btn-primary me-3" onClick={selectAll}>
            {selectedParcels.length === sortedData.length
              ? "Unselect All"
              : "Select All"}
          </button> */}
          {/* <button
              className={
                selectedParcels.length > 0
                  ? "btn btn-primary"
                  : "btn btn-secondary disabled"
              }
              disabled={selectedParcels.length === 0}
              onClick={dispatchSelected}
            >
              Dispatch Selected
            </button> */}
        </div>
      </div>

      <div className="booking_report_table">
        <table cellPadding={0} cellSpacing={0}>
          <tr>
            <th>SR...</th>
            <th>LR NUM...</th>
            <th>LR Type</th>
            <th>Dest</th>
            <th>Sender</th>
            <th>Reciever</th>
            <th>Reciever No.</th>
            <th>Art</th>
            <th>Art Type</th>
            <th>Total</th>
            {<th>Dispatched</th>}
            {props?.type === "deliver" && <th>Delivered</th>}
          </tr>
          {sortedData &&
            sortedData.map((parcel, index) => (
              <tr
                key={index}
                className={parcel?.returned ? "bg-danger" : "bg-light"}
              >
                <td>{index + 1}</td>
                <td> {parcel?.receipt_no}</td>
                <td>{parcel?.payment_type}</td>
                <td>{parcel?.place_to_send}</td>
                <td>{parcel?.sender_name}</td>
                <td>{parcel?.receiver_name}</td>
                <td>{parcel?.receiver_number}</td>
                <td>{parcel?.quantity}</td>
                <td>{parcel?.item_detail}</td>
                <td>{parcel?.total_amount}</td>
                <td className="text-center">
                    <input
                      type="checkbox"
                      // onChange={(e) => {
                      //   // onDispatch(e, parcel)
                      //   if (e.target.checked) {
                      //     console.log("checked: ", e.target.checked);
                      //     setSelectedParcels((prev) => [...prev, parcel]);
                      //   } else {
                      //     const removeItem = selectedParcels.filter(
                      //       (item) => item.ids !== parcel.ids
                      //     );
                      //     setSelectedParcels(removeItem);
                      //   }
                      // }}
                      // checked={
                      //   selectedParcels.filter(
                      //     (item) => item.ids === parcel.ids
                      //   ).length > 0
                      // }
                      disabled
                      defaultChecked={parcel.is_dispatched}
                    />
                  </td>
                {/* {props?.type === "dispatch" ? (
                  <td className="text-center">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        // onDispatch(e, parcel)
                        if (e.target.checked) {
                          console.log("checked: ", e.target.checked);
                          setSelectedParcels((prev) => [...prev, parcel]);
                        } else {
                          const removeItem = selectedParcels.filter(
                            (item) => item.ids !== parcel.ids
                          );
                          setSelectedParcels(removeItem);
                        }
                      }}
                      checked={
                        selectedParcels.filter(
                          (item) => item.ids === parcel.ids
                        ).length > 0
                      }
                    />
                  </td>
                )
                  :
                  props?.type === "deliver" ? (
                    <td className="text-center">
                      <input
                        type="checkbox"
                        disabled
                        // onChange={(e) => {
                        //   // onDispatch(e, parcel)
                        //   if (e.target.checked) {
                        //     console.log("checked: ", e.target.checked);
                        //     setSelectedParcels((prev) => [...prev, parcel]);
                        //   } else {
                        //     const removeItem = selectedParcels.filter(
                        //       (item) => item.ids !== parcel.ids
                        //     );
                        //     setSelectedParcels(removeItem);
                        //   }
                        // }}
                        checked={parcel?.is_dispatched}
                      />
                    </td>
                  ) : null
                }
                {props?.type === "deliver" && (
                  <td className="text-center">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        // onDispatch(e, parcel)
                        if (e.target.checked) {
                          console.log("checked: ", e.target.checked);
                          setSelectedParcels((prev) => [...prev, parcel]);
                        } else {
                          const removeItem = selectedParcels.filter(
                            (item) => item.ids !== parcel.ids
                          );
                          setSelectedParcels(removeItem);
                        }
                      }}
                      checked={
                        selectedParcels.filter(
                          (item) => item.ids === parcel.ids
                        ).length > 0
                      }
                    />
                  </td>
                )} */}
              </tr>
            ))}
          <tr>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>{quantity}</th>
            <th>-</th>
            <th>
              Paid : {paid} <br /> To Pay : {to_pay}{" "}
            </th>
          </tr>
        </table>
      </div>

      <div className="general_bottom_table mt-3">
        <table>
          <tr>
            <th>Type</th>
            <th>Paid</th>
            <th>To Pay</th>
            <th>Total Amount</th>
          </tr>
          <tr>
            <th>Online</th>
            <th>{paid_online}</th>
            <th>{to_pay_online}</th>
            <th>{paid_online + to_pay_online}</th>
          </tr>
          <tr>
            <th>Manual</th>
            <th>{paid_manual}</th>
            <th>{to_pay_manual}</th>
            <th>{paid_manual + to_pay_manual}</th>
          </tr>
          <tr>
            <th>Total</th>
            <th>{paid_online + paid_manual}</th>
            <th>{to_pay_online + to_pay_manual}</th>
            <th>{paid_online + paid_manual + to_pay_online + to_pay_manual}</th>
          </tr>
        </table>
      </div>
    </div>
  );
});
