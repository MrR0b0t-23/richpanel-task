import React from "react";

function DeviceTable({ devices }) {
  return (
    <div className="deviceTable-container">
      <table className="deviceTable-wrapper">
        <tbody>
          {devices.map((device) => (
            <tr className="deviceTableRow">
              <td className="deviceTable-value">{device}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeviceTable;
