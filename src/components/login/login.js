import React, { useEffect, useState } from "react";
import "./login.sass";
import login from "../../images/truck.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { CONSTANTS } from "../../utils/contants";

const Login = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data, error } = await supabase.from("branches").select("*");
    if (data) {
      setUsers(data);
    } else {
      throw new Error(error);
    }
  }

  // function capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  let formik = useFormik({
    initialValues: {
      branch: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      branch: Yup.string().required("Branch name is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("values: ", values);
      const validate = users.filter(
        (branch) =>
          branch?.username.toLowerCase() === values.branch &&
          branch?.password === values.password
      );
      if (validate.length === 1) {
        setError("");
        if(validate[0]?.type === "admin"){
          localStorage.setItem(CONSTANTS.USER_TYPE, "admin");
          navigate("/setting/items");
          return;
        } else {
          localStorage.setItem(CONSTANTS.USER_TYPE, "user");
          localStorage.setItem(CONSTANTS.BRANCH, validate[0]?.branch_name);
          localStorage.setItem(CONSTANTS.BRANCH_ID, validate[0]?.id);
          navigate("/");
        }
        // const branch = capitalizeFirstLetter(values.branch)
      } else {
        console.log("validate: ", validate);
        setError("Invalid Branch name or Password");
      }
    },
  });

  return (
    <section className="pt__login">
      <div className="container">
        <div className="row">
          <div className="col-8">
            <div className="pt__login_img">
              <img src={login} alt="" />
            </div>
          </div>
          <div className="col-4">
            <div className="pt__login_form">
              <form action="" onSubmit={formik.handleSubmit}>
                <h2>Pavan Parcel Service</h2>
                <p>The right transportation solution for you</p>

                {error && <div className="text-danger fs-5">{error}</div>}

                <div className="pt__login_input">
                  <label>Branch Name</label>
                  <input
                    type="text"
                    name="branch"
                    id=""
                    placeholder="Branch name"
                    className="form-control text-light"
                    value={formik.values.branch}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.branch && formik.errors.branch && (
                    <div className="text-danger text-start mt-2 fs-5">
                      {formik.errors.branch}
                    </div>
                  )}
                </div>
                <div className="pt__login_input">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    id=""
                    placeholder="Password"
                    className="form-control text-light"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger text-start mt-2 fs-5">
                      {formik.errors.password}
                    </div>
                  )}
                </div>
                <div className="pt__login_btn">
                  <input
                    type="submit"
                    name=""
                    id=""
                    value="Submit"
                    className="submit_btn"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
