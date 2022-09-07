import React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const welcome = (userEmail) =>
  toast.success(`Welcome ${userEmail.data} !`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    toastId: "1",
    progress: undefined,
  });
  const cancel = () =>
  toast.success(`Current plan cancelled !`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    toastId: "1",
    progress: undefined,
  });
function Dashboard() {
  // get token from local storage
  const jwtToken = localStorage.getItem("Token");
  const [logged, setLoginStatus] = useState(true);
  const [isload, setloader] = useState(false);
  const [userPlan, setUserPlan] = useState();
  const [newUser, setNewUser] = useState(true);
  const [userEmail, SetUserEmail] = useState("");
  const [canclePlan, setCancelPlan] = useState(false);
  useEffect(() => {
    axios
      .post("http://localhost:5000/onload", { token: jwtToken })
      .then((response) => {
        console.log(response);
        console.log(response.data.message);
        if (response.message === "failure") {
          localStorage.clear();
          setLoginStatus(false);
        }
        SetUserEmail(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoginStatus(false);
      });

    axios
      .post("http://localhost:5000/userplan", { token: jwtToken })
      .then((response) => {
        console.log(response);
        setloader(true);
        setNewUser(false);
        setUserPlan(response.data.data);
      })
      .catch((error) => {
        setloader(true);
        console.log(error);
      });
  }, [jwtToken]);

  if (!jwtToken || jwtToken === "undefined") {
    return <Navigate to="login" />;
  }

  // if not valid redirect to login
  if (logged === false) {
    return <Navigate to="login" />;
  }
  if (!isload) {
    return <div>Loading</div>;
  }

  if (newUser) {
    return <Navigate to="plan" />;
  }

  function cancelSubcription(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5000/cancelplan", { token: jwtToken })
      .then((response) => {
        console.log(response);
        setCancelPlan(true);
        cancel();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  if (canclePlan) {
    setCancelPlan(false);
    return <Navigate to="" />;
  }
  welcome(userEmail);
  return (
    <div>
      <ToastContainer />
      <div className="container">
        <div className="card-wrapper">
          <div className="card-header">
            <div className="card-title">
              Current Plan Details{" "}
              <span
                className={
                  userPlan.status === "active" ? "badge-active" : "badge-cancel"
                }
              >
                {userPlan.status === "active" ? "Active" : "Cancelled"}
              </span>{" "}
            </div>
            {userPlan.status === "active" ? (
              <button type="button" className="btn" onClick={cancelSubcription}>
                Cancel
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="card-body">
            <div className="card-plan-wrapper">
              <div className="card-plan">{userPlan.planName}</div>
              <div className="card-device">
                {userPlan.device.map((dev) => (
                  <span>{dev} </span>
                ))}
              </div>
            </div>
            <div className="card-price">
              &#x20B9; {userPlan.price.toLocaleString()}{" "}
              {userPlan.type === "Monthly" ? "/mo" : "/yr"}
            </div>
            <a type="button" className="changePlanButton" href="/plan">
              {userPlan.status === "active" ? "Change Plan" : "Choose Plan"}
            </a>
          </div>
          <div className="card-footer">
            Your subcription has started on Jul 11th 2022 and will auto renew on
            Jul 12th, 2023.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
