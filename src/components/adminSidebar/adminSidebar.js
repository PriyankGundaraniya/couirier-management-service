import React from 'react'
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    return (
        <div className="setitem_left">
            <ul>
                <li>
                    <Link to="/setting/items"> Items </Link>
                </li>
                <li>
                    <Link to="/setting/color"> Color </Link>
                </li>
                <li>
                    <Link to="/setting/sendplace"> Place To Send </Link>
                </li>
                <li>
                    <Link to="/setting/access">Access to Places </Link>
                </li>
            </ul>
        </div>
    )
}

export default AdminSidebar;