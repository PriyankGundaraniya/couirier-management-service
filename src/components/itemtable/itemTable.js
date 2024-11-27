import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabase/supabaseClient";
import {MdDelete} from 'react-icons/md'
import AdminSidebar from "../adminSidebar/adminSidebar";

const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("id", { ascending: true });
    if (!error) {
      setItems(data);
    }
  };

  const deleteItem = async (id) => {
    const {data, error} = await supabase.from('items').delete().eq("id", id)
    if(data){
      getItems()
    } else {
      getItems()
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
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Add Here"
                        className="form_control"
                      />
                      <button
                        className="btn btn-primary"
                        onClick={async (e) => {
                          e.preventDefault();
                          const { data, error } = await supabase
                            .from("items")
                            .insert({ item_name: itemName });
                            if(!error){
                              setItemName("")
                                getItems();
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
                      <th className="col-10">Item</th>
                      <th className="col-1">Actions</th>
                    </tr>
                    {items &&
                      items.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.item_name}</td>
                          <td className="text-center" role="button">
                            <MdDelete size={25} onClick={() => deleteItem(item?.id)} />
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

export default ItemTable;
