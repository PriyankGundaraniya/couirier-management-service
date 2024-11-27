import React, { forwardRef } from "react";
import { CONSTANTS } from "../utils/contants";
import moment from "moment";
import "./builty.css";

const Builty = forwardRef((props, ref) => {
  // console.log("props data: ", props?.data)
  let branch = "";
  if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(HO)")) {
    branch = "HO/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(SA)")) {
    branch = "SA/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(KA)")) {
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
  return (
    <div ref={ref} className="builty_table">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <th rowspan="2" class="text-start">
            FROM : {props?.data[0]?.branch} <br />
            Mo.No.{" "}
            {props?.data[0]?.branch.includes("(HO)")
              ? "(7567529600)"
              : props?.data[0]?.branch.includes("(KA)")
              ? "(7405194000)"
              : props?.data[0]?.branch.includes("(SA)")
              ? "(7567545800)"
              : ""}
          </th>
          <th rowspan="2" class="text-start">
            TO : {props?.data[0]?.place_to_send} <br />
            Mo.No.{" "}
            {props?.data[0]?.place_to_send?.includes("RAJKOT(LIMDA CHOK)")
              ? "(9408847247)"
              : props?.data[0]?.place_to_send?.includes("RAJKOT(PUNITNAGAR)")
              ? "(8460005334)"
              : props?.data[0]?.place_to_send?.includes("MUMBAI(BORIVALI)")
              ? "(8450905454)"
              : "(-)"}
          </th>
          <th class="text-start">LR NO. :</th>
          <th class="text-end">
            <b> {props?.data[0]?.receipt_no} </b>
          </th>
        </tr>
        <tr>
          <th class="text-start">LR Type:</th>
          <th class="text-end">
            <b>{props?.data[0]?.payment_type}</b>
          </th>
        </tr>
        <tr>
          <th rowspan="2" class="text-start">
            SENDER : {props?.data[0]?.sender_name}
            <br />
            No. ({props?.data[0]?.sender_number} )
          </th>
          <th rowspan="2" class="text-start">
            RECIEVER : {props?.data[0]?.receiver_name} <br />
            No. ({props?.data[0]?.receiver_number})
          </th>
          <th class="text-start">Freight:</th>
          <th class="text-end">{Number(props?.data[0]?.total_amount) - 10}</th>
        </tr>
        <tr>
          <th class="text-start">LR Charge:</th>
          <th class="text-end">10</th>
        </tr>
        <tr>
          <th colspan="2" rowspan="2" class="text-start">
            PKGS :{" "}
            <b>
              {props?.data[0]?.quantity + " " + props?.data[0]?.item_detail}
            </b>
          </th>
        </tr>
        <tr>
          <th colspan="2" rowspan="2">
            -
          </th>
        </tr>
        <tr>
          <th colspan="2" class="text-start">
            Remark : {props?.data[0]?.remarks}
          </th>
        </tr>
        <tr>
          <th colspan="2" class="text-start">
            Booking Time :{" "}
            {moment(props?.data[0]?.created_at).format("DD/MM/YYYY h:mm a")}
          </th>
          <th class="text-start">Total</th>
          <th class="text-end">
            <b>{props?.data[0]?.total_amount}</b>
          </th>
        </tr>
        {/* <tr>
                <th colspan="4" class="text-start">
                    Deliver Address: <br/>
                    RATNAMANI COMPLEX BESIDE STAR BAZAR SATELITE
                </th>
            </tr> */}
      </table>

      {/* 
                <table cellPadding={0} cellSpacing={0} className='m-3'>
                    <tr>
                        <td>
                            LR No. :   <b> {branch+props?.data[0]?.id} </b> <br />
                            {localStorage.getItem(CONSTANTS.BRANCH)} - {props?.data[0]?.place_to_send} <br />
                            Sender : {props?.data[0]?.sender_name} <br />
                            Sender No. : {props?.data[0]?.sender_number} <br />
                            Reciever : {props?.data[0]?.receiver_name} <br />
                            Reciever No. : {props?.data[0]?.receiver_number} <br />
                            Item Type : <b>{props?.data[0]?.quantity + " " + props?.data[0]?.item_detail}</b> <br />
                            Remark : {props?.data[0]?.remarks}<br />
                            Booking Time : {moment(props?.data[0]?.created_at).format('DD/MM/YYYY h:mm a')} <br />
                            Delivery Address : {props?.data[0]?.place_to_send} <br />
                            Freight : {Number(props?.data[0]?.total_amount) - 10} <br />
                            L.R. Charge : 10 <br />
                            Grand Total : <b>{props?.data[0]?.total_amount}</b> <br />
                            <p><b>{props?.data[0]?.payment_type}</b></p>
                        </td>
                        <td>
                            LR No. :<b> {branch+props?.data[0]?.id} </b><br />
                            {localStorage.getItem(CONSTANTS.BRANCH)} - {props?.data[0]?.place_to_send} <br />
                            Sender : {props?.data[0]?.sender_name} <br />
                            Sender No. : {props?.data[0]?.sender_number} <br />
                            Reciever : {props?.data[0]?.receiver_name} <br />
                            Reciever No. : {props?.data[0]?.receiver_number} <br />
                            Item Type : <b>{props?.data[0]?.quantity + " " + props?.data[0]?.item_detail}</b> <br />
                            Remark : {props?.data[0]?.remarks}<br />
                            Booking Time : {moment(props?.data[0]?.created_at).format('DD/MM/YYYY h:mm a')} <br />
                            Delivery Address : {props?.data[0]?.place_to_send} <br />
                            Freight : {Number(props?.data[0]?.total_amount) - 10} <br />
                            L.R. Charge : 10 <br />
                            Grand Total : <b>{props?.data[0]?.total_amount}</b> <br />
                            <p><b>{props?.data[0]?.payment_type}</b></p>
                        </td>
                    </tr>
                </table> */}
    </div>
  );
});

export default Builty;
