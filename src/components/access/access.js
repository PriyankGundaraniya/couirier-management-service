import React, { useEffect, useState } from 'react'
import AdminSidebar from '../adminSidebar/adminSidebar';
import supabase from '../../supabase/supabaseClient';
import toast from 'react-hot-toast';

const Access = () => {

    const [placeToSend, setPlaceToSend] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        getPlaceToSend();
        getBranches();
    }, []);

    useEffect(() => {
        if(selectedBranch){
            getBranchData();    
        } else {
            setSelectedPlaces([]);
        }
    }, [selectedBranch]);

    const getBranchData = async() => {
        const {data, error} = await supabase.from("access_branch").select("*").eq("branch", Number(selectedBranch));
        if(!error){
            console.log("branch data: ", data);
            if(data.length > 0){
                setSelectedPlaces(JSON.parse(data[0].places))
            } else {
                setSelectedPlaces([]);
            }
        } else {
            console.log("Failed to retrieve branch data: ", error);
        }
    }

    const getPlaceToSend = async () => {
        const { data, error } = await supabase.from("place_to_send").select("*");
        if (!error) {
            //   console.log("data: ", data);
            setPlaceToSend(data);
        } else {
            console.log("error: ", error);
        }
    };

    const getBranches = async () => {
        const { data, error } = await supabase.from("branches").select("*");
        if (!error) {
            console.log("data: ", data);
            setBranches(data?.filter(item => item.type !== "admin"));
        } else {
            console.log("error: ", error);
        }
    };

    const onSelectPlace = (e, place) => {
        const selected = e.target.checked;
        if (selected) {
            setSelectedPlaces(prev => ([...prev, place]))
        } else {
            const places = selectedPlaces.filter(item => item !== place);
            setSelectedPlaces(places);
        }
    }

    const onUpdate = async(e) => {
        e.preventDefault();
        const isExist = await supabase.from("access_branch").select("*").eq("branch", Number(selectedBranch));
        if(!isExist.error){
            if(isExist.data.length > 0){
                const {data, error} = await supabase.from("access_branch").update({
                    branch: selectedBranch,
                    places: JSON.stringify(selectedPlaces)
                }).eq("branch", Number(selectedBranch));
                if(!error) {
                    console.log("updated data: ", data);
                    toast.success("Access updated successfully")
                }else {
                    toast.error("Failed to update access data!!!");
                    console.log("failed to update: ", error);
                }
            } else {
                const {data, error} = await supabase.from("access_branch").insert({
                    branch: selectedBranch,
                    places: JSON.stringify(selectedPlaces)
                });
                if(!error) {
                    console.log("updated data: ", data);
                    toast.success("Access added successfully")
                }else {
                    toast.error("Failed to update access data!!!");
                    console.log("failed to update: ", error);
                }
            }
        } else {
            toast.error("Something went wrong, refresh and try again!");
            console.log("Failed to get data for branch: ", selectedBranch)
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
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div className='d-flex flex-column align-items-start'>
                                        <label className='form-label'>Branch</label>
                                        <select className='form-select w-100' value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
                                            <option value="">Select branch</option>
                                            {branches.map(branch => (
                                                <option value={branch?.id}>{branch?.branch_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className='btn btn-primary' disabled={!selectedBranch} onClick={onUpdate}>
                                        Update Access
                                    </button>
                                </div>
                                <div className="additem_table">
                                    <table cellPadding={0} cellSpacing={0}>
                                        <tr>
                                            <th className="col-1">No.</th>
                                            <th className="col-10">Branch</th>
                                            <th className="col-1">Actions</th>
                                        </tr>
                                        {placeToSend &&
                                            placeToSend.map((place, index) => (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{place?.place_to_send}</td>
                                                    <td className={"d-flex justify-content-center"} role="button">
                                                        <input
                                                            type='checkbox'
                                                            disabled={!selectedBranch}
                                                            className='form-check'
                                                            checked={selectedPlaces.includes(place?.place_to_send)}
                                                            onChange={(e) => onSelectPlace(e, place?.place_to_send)}
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
    )
}

export default Access;