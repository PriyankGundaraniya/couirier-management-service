import React from 'react'
import './admin.sass'
import supabase from '../../supabase/supabaseClient.js'
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Admin = () => {
    const validate = Yup.object().shape({
        sender_name: Yup.string().required("Please enter Sender name"),
        sender_number: Yup.string().required("Please enter Sender number"),
        receiver_name: Yup.string().required("Please enter Receiver name"),
        receiver_number: Yup.string().required("Please enter Receiver number"),
        item_detail: Yup.string().required("Please select item detail"),
        color: Yup.string().required("Please select item color"),
        quantity: Yup.string().required("Please enter qunatity"),
        rate: Yup.string().required("Please enter rate"),
        total_amount: Yup.string().required("Please enter total amount"),
        payment_type: Yup.string().required("Please select Payment type"),
        place_to_send: Yup.string().required("Please select Place to Send"),
        remarks: Yup.string().required("Please enter remarks"),
        driver: Yup.string().required("Please enter driver number")
    })

    const formik = useFormik({
        initialValues: {
            sender_name: '',
            sender_number: '',
            receiver_name: '',
            receiver_number: '',
            item_detail: '',
            color: '',
            quantity: '',
            rate: '',
            payment_type: '',
            total_amount: '',
            place_to_send: '',
            remarks: '',
            driver: ''
        },
        validationSchema: validate,
        onSubmit: async (values) => {
            console.log("values: ", values)
            const { data, error } = await supabase.from("parcels").insert({ ...values })
            if (!error) {
                console.log("data: ", data);
                window.location.reload(false);
            } else {
                console.log("error: ", error);
                throw new Error(error);
            }
        }
    })

    return (
        <section className='pt__admin'>
            <form onSubmit={formik.handleSubmit}>
                <div className='container'>
                    <div className="row">
                        <div className="col-7">
                            <div className="container">

                            <div className='row justify-between'>
                        <div className='m-15'>
                            <div className="col-12">
                                <div className='form_control_wrapper'>
                                    <label>Place to send</label>
                                    <select name="place_to_send" id="cars" value={formik.values.place_to_send} onChange={formik.handleChange}>
                                        <option value="">Select Place to Send...</option>
                                        <option value="volvo">Volvo</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                    {
                                        formik.errors.place_to_send && <div className='text-danger'>{formik.errors.place_to_send}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        </div>
                    <div className='row justify-between'>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Sender Name</label>
                                <input
                                    name='sender_name'
                                    value={formik.values.sender_name}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.sender_name && <div className='text-danger'>{formik.errors.sender_name}</div>
                                }
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Sender Number</label>
                                <input
                                    name='sender_number'
                                    value={formik.values.sender_number}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.sender_number && <div className='text-danger'>{formik.errors.sender_number}</div>
                                }
                            </div>
                        </div>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Receiver Name</label>
                                <input
                                    name='receiver_name'
                                    value={formik.values.receiver_name}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.receiver_name && <div className='text-danger'>{formik.errors.receiver_name}</div>
                                }
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Receiver Number</label>
                                <input
                                    name='receiver_number'
                                    value={formik.values.receiver_number}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.receiver_number && <div className='text-danger'>{formik.errors.receiver_number}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Item Details</label>
                                <select name="item_detail" id="cars" value={formik.values.item_detail} onChange={formik.handleChange}>
                                    <option value="">Select Item detail...</option>
                                    <option value="Volvo">Volvo</option>
                                    <option value="Saab">Saab</option>
                                    <option value="Mercedes">Mercedes</option>
                                    <option value="Audi">Audi</option>
                                </select>
                                {
                                    formik.errors.item_detail && <div className='text-danger'>{formik.errors.item_detail}</div>
                                }
                            </div>
                        </div>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Colors</label>
                                <select name="color" id="color" value={formik.values.color} onChange={formik.handleChange}>
                                    <option value="">Select Color...</option>
                                    <option value="Red">Red</option>
                                    <option value="Green">Green</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Cyan">Cyan</option>
                                </select>
                                {
                                    formik.errors.color && <div className='text-danger'>{formik.errors.color}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                        <div className='col-25'>
                            <div className='form_control_wrapper'>
                                <label>Quantity Number</label>
                                <input
                                    name='quantity'
                                    value={formik.values.quantity}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.quantity && <div className='text-danger'>{formik.errors.quantity}</div>
                                }
                            </div>
                        </div>
                        <div className='col-25'>
                            <div className='form_control_wrapper'>
                                <label>Rate</label>
                                <input
                                    name='rate'
                                    value={formik.values.rate}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.rate && <div className='text-danger'>{formik.errors.rate}</div>
                                }
                            </div>
                        </div>
                        <div className='col-25'>
                            <div className='form_control_wrapper'>
                                <label>Total Amount</label>
                                <input
                                    name='total_amount'
                                    value={formik.values.total_amount}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.total_amount && <div className='text-danger'>{formik.errors.total_amount}</div>
                                }
                            </div>
                        </div>
                        <div className='col-25'>
                            <div className='form_control_wrapper'>
                                <label>Payment Type</label>
                                <select name="payment_type" id="payment_type" disabled value={formik.values.payment_type} onChange={formik.handleChange}>
                                    <option value="Jama">Paid</option>
                                </select>
                                {
                                    formik.errors.payment_type && <div className='text-danger'>{formik.errors.payment_type}</div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row justify-between mt-30">
                        <div className='col-4'>
                            <div className='form_control_wrapper'>
                                <label>Remarks</label>
                                <input
                                    name='remarks'
                                    value={formik.values.remarks}
                                    onChange={formik.handleChange}
                                />
                                {
                                    formik.errors.remarks && <div className='text-danger'>{formik.errors.remarks}</div>
                                }
                            </div>
                        </div>

                    </div>
                    <div className="row justify-between mt-30">
                        <div className="col-12">
                            <button type='submit' className='pt__lr_num time_btn btn btn-submit'>Print and Save</button>
                        </div>
                    </div>

                            </div>

                        </div>
                        <div className="col-25">
                        <div className="pt__admin_charges"> 
                                <table>
                                    <tr>    
                                        <th width='50'>
                                            Charges
                                        </th>
                                        <th width='50'>

                                        </th>
                                    </tr>
                                    <tr>
                                        <td>
                                            Freight
                                        </td>
                                        <td>
                                            50
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            LR Charge
                                        </td>
                                        <td>
                                            10
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Total
                                        </td>
                                        <td>
                                            60
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Grand Total
                                        </td>
                                        <td>
                                            60
                                        </td>
                                    </tr>
                                </table>
                        </div>    
                        </div>
                    </div>


                </div>
            </form>
        </section>
    )
}

export default Admin