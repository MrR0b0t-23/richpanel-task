import React from "react";
import DeviceTable from "./DeviceTable";

function PlansTable({ plans, selected, toggle }) {
  //console.log(selected);
  return (
    <table>
      <tbody className="divide-y divide-[gray] text-align-center">
        <tr className="tableRow">
          <td className="tableDataTitle">
            {toggle === true ? "Yearly Price" : "Monthly Price"}
          </td>
          {plans.map((plan) => (
            <td
              className={
                selected.productID === plan.productID
                  ? "tableDataFeature-selected"
                  : "tableDataFeature"
              }
            >
              &#x20B9; &nbsp;
              {toggle === true ? plan.yearlyPrice : plan.monthlyPrice}
            </td>
          ))}
        </tr>

        <tr className="tableRow">
          <td className="tableDataTitle">Video quality</td>
          {plans.map((plan) => (
            <td
              className={
                selected.productID === plan.productID
                  ? "tableDataFeature-selected"
                  : "tableDataFeature"
              }
            >
              {plan.videoQuality}
            </td>
          ))}
        </tr>

        <tr className="tableRow">
          <td className="tableDataTitle">Resolution</td>
          {plans.map((plan) => (
            <td
              className={
                selected.productID === plan.productID
                  ? "tableDataFeature-selected"
                  : "tableDataFeature"
              }
            >
              {plan.resolution}
            </td>
          ))}
        </tr>

        <tr className="tableRow">
          <td className="tableDataTitle">
            Number of active screen at one time
          </td>
          {plans.map((plan) => (
            <td
              className={
                selected.productID === plan.productID
                  ? "tableDataFeature-selected"
                  : "tableDataFeature"
              }
            >
              {plan.activeScreens}
            </td>
          ))}
        </tr>

        <tr className="tableRow">
          <td className="tableDataTitle">Devices you can use to watch</td>
          {plans.map((plan) => (
            <td
              className={
                selected.productID === plan.productID
                  ? "tableDataFeature-selected"
                  : "tableDataFeature"
              }
            >
              <DeviceTable devices={plan.devices} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default PlansTable;
