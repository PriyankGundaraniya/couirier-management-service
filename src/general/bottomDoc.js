import React from 'react'

const BottomDoc = () => {
  return (
    <div className='general_bottom_table'>
        <table>
            <tr>
                <th>Type</th>
                <th>Paid</th>
                <th>To Pay</th>
                <th>Total Amount</th>
            </tr>
            <tr>
                <th>Online</th>
                <th>40</th>
                <th>50</th>
                <th>90</th>
            </tr>
            <tr>
                <th>Manual</th>
                <th>0</th>
                <th>0</th>
                <th> 0</th>
            </tr>
            <tr>
                <th>Total</th>
                <th>40</th>
                <th>50</th>
                <th>90</th>
            </tr>
        </table>
    </div>
  )
}

export default BottomDoc