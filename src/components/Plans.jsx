import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import PlansTable from "./PlansTable";
import "./Switch.css";
import "./Plans.css";
import { Navigate } from "react-router-dom";

function Plans() {
  const [planData, setPlanData] = useState("");
  const [isload, setloader] = useState(false);
  const [selectedPlan, SetSelectedPlan] = useState();
  const [metadata, setMetadata] = useState();
  const jwtToken = localStorage.getItem("Token");
  const [logged, setLoginStatus] = useState(true);
  const [proceedPayment, setProceedPayment] = useState(false);
  var plans = [];
  const [toggle, setToggle] = useState(false);

  const triggerToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    axios
      .post("http://richpanel-golang.herokuapp.com/onload", { token: jwtToken })
      .then((response) => {
        if (response.message === "failure") {
          localStorage.clear();
          setLoginStatus(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoginStatus(false);
      });

    axios
      .get("http://richpanel-golang.herokuapp.com/getplans")
      .then((response) => response)
      .then((responseJson) => {
        setloader(true);
        setPlanData(responseJson.data.data);
        if (responseJson) {
          SetSelectedPlan(responseJson.data.data.data[3]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [jwtToken]);

  [planData.data].map((plan) => plans.push(plan));
  plans = plans[0];

  if (!jwtToken || jwtToken === "undefined") {
    return (window.location = "/login");
  }

  // if not valid redirect to login
  if (logged === false) {
    return (window.location = "/login");
  }

  if (!isload) {
    return <div>Loading</div>;
  }
  const handlePayment = () => {
    if (!toggle) {
      setMetadata({
        planName: selectedPlan.planName,
        price: selectedPlan.monthlyPrice,
        type: "Monthly",
        devices: selectedPlan.devices,
        resoultion: selectedPlan.resoultion,
        videoQuality: selectedPlan.videoQuality,
        priceId: selectedPlan.monthlyPriceAPI,
        activeScreens: selectedPlan.activeScreens,
      });
    } else {
      setMetadata({
        planName: selectedPlan.planName,
        price: selectedPlan.yearlyPrice,
        type: "Yearly",
        devices: selectedPlan.devices,
        resoultion: selectedPlan.resoultion,
        videoQuality: selectedPlan.videoQuality,
        priceId: selectedPlan.yearlyPriceAPI,
        activeScreens: selectedPlan.activeScreens,
      });
    }
    setProceedPayment(true);
  };
  console.log(metadata);
  if (proceedPayment) {
    console.log(metadata);
    localStorage.setItem("metadata", JSON.stringify(metadata));
    return <Navigate to="/payment" />;
  }
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(false);
  };

  return (
    <div>
      <div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <main className="container">
        <div className="plan-content ">
          <div className="title">Choose the right plan for you</div>

          <div className="planBox-container">
            <div className="planBox-wrapper">
              <div className="switch-wrapper">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider" onClick={triggerToggle}>
                    {toggle === true ? "Monthly" : "Yearly"}
                  </span>
                </label>
              </div>

              {plans.map((plan) => (
                <div
                  key={plan.productId}
                  className={
                    selectedPlan.productID === plan.productID
                      ? "planBox-selected"
                      : "planBox"
                  }
                  onClick={() => SetSelectedPlan(plan)}
                >
                  {plan.planName}
                </div>
              ))}
            </div>
            <PlansTable plans={plans} selected={selectedPlan} toggle={toggle} />
          </div>
          <div className="next-wrapper">
            <button className="nextButton" onClick={handlePayment}>
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Plans;
