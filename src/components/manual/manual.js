import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { CONSTANTS } from "../../utils/contants";
import supabase from "../../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

const Manual = () => {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [branches, setBranches] = useState([]);
  const [items, setItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getBranches();
    getItems();
    getColors();
  }, []);

  const getBranches = async () => {
    const { data, error } = await supabase.from("place_to_send").select("*");
    if (!error) {
      setBranches(data);
    } else {
      console.log("error: ", error);
    }
  };

  const getItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (!error) {
      //   console.log("data: ", data);
      setItems(data);
    } else {
      console.log("error: ", error);
    }
  };

  const getColors = async () => {
    const { data, error } = await supabase.from("colors").select("*");
    if (!error) {
      //   console.log("data: ", data);
      setColors(data);
    } else {
      console.log("error: ", error);
    }
  };

  const validate = Yup.object().shape({
    id: Yup.string().required("Please enter LR no."),
    sender_name: Yup.string().required("Please enter Sender name"),
    sender_number: Yup.string()
      .required("Please enter Sender number")
      .max(10, "Maximum 10 numbers only!")
      .min(10, "Minimum 10 numbers!"),
    receiver_name: Yup.string().required("Please enter Receiver name"),
    receiver_number: Yup.string()
      .required("Please enter Receiver number")
      .max(10, "Maximum 10 numbers only!")
      .min(10, "Minimum 10 numbers!"),
    item_detail: Yup.string().required("Please select item detail"),
    quantity: Yup.string().required("Please enter qunatity"),
    rate: Yup.string().required("Please enter rate"),
    total_amount: Yup.string().required("Please enter total amount"),
    payment_type: Yup.string().required("Please select Payment type"),
    place_to_send: Yup.string().required("Please select Place to Send"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      sender_name: "",
      sender_number: "",
      receiver_name: "",
      receiver_number: "",
      item_detail: "",
      color: "",
      quantity: "",
      rate: "",
      payment_type: "",
      total_amount: "",
      place_to_send: "",
      remarks: "",
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      // console.log("values: ", JSON.stringify(values));
      if (date === null) {
        setError("Please select date");
        return;
      }
      setError("");
      const { data, error } = await supabase.from("parcels").select("*");
      if (!error) {
        const isExist = data.filter((item) => item.id === Number(values.id));
        console.log("is exist: ", isExist);
        if (isExist.length > 0) {
          alert("LR no. already exist!");
        } else {
          let branch = "";
          if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(HO)")) {
            branch = "HO/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("SA")) {
            branch = "SA/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("KA")) {
            branch = "KA/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(BHI)")) {
            branch = "BHI/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(BO)")) {
            branch = "BO/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(GH)")) {
            branch = "GH/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(AN)")) {
            branch = "AN/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(PU)")) {
            branch = "PU/";
          } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(LI)")) {
            branch = "LI/";
          }
          const addManual = await supabase.from("parcels").insert({
            ...values,
            id: Number(values.id),
            add_type: "manual",
            receipt_no: branch + Number(values.id),
            created_at: date,
            total_amount: Number(values?.total_amount) + 10,
            branch: localStorage.getItem(CONSTANTS.BRANCH),
          });
          if (!addManual.error) {
            navigate("/");
          } else {
            console.log("insert error: ", addManual.error);
          }
        }
      } else {
        console.log("is exist search error: ", error);
      }
    },
  });

  return (
    <div className="pt_admin_lr">
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div className="row">
            <div className="col-7">
              <div className="container">
                <div className="row m-15 justify-between">
                  <div className="col-8">
                    <div className="form_control_wrapper">
                      <label>Place to send</label>
                      <select
                        name="place_to_send"
                        id="cars"
                        value={formik.values.place_to_send}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Place to Send...</option>
                        {branches &&
                          branches.map((branch) => (
                            <option value={branch?.place_to_send}>
                              {branch?.place_to_send}
                            </option>
                          ))}
                      </select>
                      {formik.touched.place_to_send &&
                        formik.errors.place_to_send && (
                          <div className="text-danger">
                            {formik.errors.place_to_send}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form_control_wrapper">
                      <label>LR No.</label>
                      <input
                        name="id"
                        type="text"
                        value={formik.values.id}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.id && formik.errors.id && (
                        <div className="text-danger">{formik.errors.id}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row justify-between">
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Sender Name</label>
                      <input
                        name="sender_name"
                        type="text"
                        value={formik.values.sender_name}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.sender_name &&
                        formik.errors.sender_name && (
                          <div className="text-danger">
                            {formik.errors.sender_name}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form_control_wrapper">
                      <label>Sender Number</label>
                      <input
                        name="sender_number"
                        type="text"
                        maxLength={10}
                        value={formik.values.sender_number}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.sender_number &&
                        formik.errors.sender_number && (
                          <div className="text-danger">
                            {formik.errors.sender_number}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Receiver Name</label>
                      <input
                        name="receiver_name"
                        type="text"
                        value={formik.values.receiver_name}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.receiver_name &&
                        formik.errors.receiver_name && (
                          <div className="text-danger">
                            {formik.errors.receiver_name}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form_control_wrapper">
                      <label>Receiver Number</label>
                      <input
                        name="receiver_number"
                        type="text"
                        maxLength={10}
                        value={formik.values.receiver_number}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.receiver_number &&
                        formik.errors.receiver_number && (
                          <div className="text-danger">
                            {formik.errors.receiver_number}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="row justify-between mt-30">
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Item Details</label>
                      <select
                        name="item_detail"
                        id="cars"
                        value={formik.values.item_detail}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Item detail...</option>
                        {items &&
                          items.map((item) => (
                            <option value={item?.item_name}>
                              {item?.item_name}
                            </option>
                          ))}
                      </select>
                      {formik.touched.item_detail &&
                        formik.errors.item_detail && (
                          <div className="text-danger">
                            {formik.errors.item_detail}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Colors</label>
                      <select
                        name="color"
                        id="color"
                        value={formik.values.color}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Color...</option>
                        {colors &&
                          colors.map((item) => (
                            <option value={item?.color}>{item?.color}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row justify-between mt-30">
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Quantity Number</label>
                      <input
                        name="quantity"
                        type="number"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.quantity && formik.errors.quantity && (
                        <div className="text-danger">
                          {formik.errors.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Rate</label>
                      <input
                        name="rate"
                        type="number"
                        value={formik.values.rate}
                        onChange={(e) => {
                          formik.handleChange(e);
                          formik.setFieldValue(
                            "total_amount",
                            formik.values.quantity * e.target.value
                          );
                        }}
                      />
                      {formik.touched.rate && formik.errors.rate && (
                        <div className="text-danger">{formik.errors.rate}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Total Amount</label>
                      <input
                        name="total_amount"
                        type="number"
                        disabled
                        value={formik.values.total_amount}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.total_amount &&
                        formik.errors.total_amount && (
                          <div className="text-danger">
                            {formik.errors.total_amount}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Payment Type</label>
                      <select
                        name="payment_type"
                        id="payment_type"
                        value={formik.values.payment_type}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Payment Type...</option>
                        <option value="To Pay">To Pay</option>
                        <option value="Paid">Paid</option>
                      </select>
                      {formik.touched.payment_type &&
                        formik.errors.payment_type && (
                          <div className="text-danger">
                            {formik.errors.payment_type}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="row justify-between align-items-start mt-30">
                  <div className="col-4">
                    <div className="form_control_wrapper">
                      <label>Remarks</label>
                      <input
                        name="remarks"
                        value={formik.values.remarks}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form_control_wrapper">
                      <label>Date & Time</label>
                      <input
                        name="created_at"
                        type="date"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          e.target.value
                            ? setError("")
                            : setError("Please select date");
                        }}
                        max={tomorrow.toISOString().split("T")[0]}
                      />
                      {error && <div className="text-danger">{error}</div>}
                    </div>
                  </div>
                  <div className="col-4 text-end align-self-center">
                    <button
                      type="submit"
                      className="pt__lr_num time_btn btn btn-submit"
                      // onClick={(e) => e.preventDefault()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-25">
              <div className="pt__admin_charges">
                <table>
                  <tr>
                    <th width="50">Charges</th>
                    <th width="50"></th>
                  </tr>
                  <tr>
                    <td>Freight</td>
                    <td>{formik.values.total_amount || 0}</td>
                  </tr>
                  <tr>
                    <td>LR Charge</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>{Number(formik.values.total_amount) + 10}</td>
                  </tr>
                  <tr>
                    <td>Grand Total</td>
                    <td>{Number(formik.values.total_amount) + 10}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Manual;
