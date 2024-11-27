import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabase/supabaseClient";
import { MdDelete } from "react-icons/md";
import AdminSidebar from "../adminSidebar/adminSidebar";

const SendPlacetable = () => {
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("");

  useEffect(() => {
    getBranches();
  }, []);

  async function getBranches() {
    const { data, error } = await supabase
      .from("place_to_send")
      .select("*")
      .order("id", { ascending: true });
    if (!error) {
      setBranches(data);
    }
  }

  const deleteItem = async (id) => {
    const {data, error} = await supabase.from('place_to_send').delete().eq("id", id)
    if(data){
      getBranches()
    } else {
      getBranches()
      // console.log("error: ", error)
      // throw new Error(error)
    }
  }

  return (
    <>
      <section className="setItem">
        <div className="setitem_container">
          <div className="row">
            <div className="col-4">
              <AdminSidebar />
            </div>
            <div className="col-8">
              <div className="setitem_right">
                <div className="d-flex justify-content-end">
                  <div className="additem_form">
                    <form action="">
                      <input
                        type="text"
                        placeholder="Add Here"
                        className="form_control"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={async (e) => {
                          e.preventDefault();
                          const { data, error } = await supabase
                            .from("place_to_send")
                            .insert({ place_to_send: branch });
                          if (!error) {
                            setBranch("");
                            getBranches();
                          }
                        }}
                      >
                        Add
                      </button>
                    </form>
                  </div>
                </div>
                <div className="additem_table">
                  <table cellPadding={0} cellSpacing={0}>
                    <tr>
                      <th className="col-1">No.</th>
                      <th className="col-10">Branch</th>
                      <th className="col-1">Actions</th>
                    </tr>
                    {branches &&
                      branches.map((branch, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{branch?.place_to_send}</td>
                          <td className="text-center" role="button">
                            <MdDelete
                              size={25}
                              onClick={() => deleteItem(branch?.id)}
                            />
                          </td>
                        </tr>
                      ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SendPlacetable;
