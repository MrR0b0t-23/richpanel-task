import React from "react";
import axios from "axios";
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
const cancelled = () =>
  toast.success(`Current Plan cancelled !`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    toastId: "2",
    progress: undefined,
  });
function Dashboard() {
  // get token from local storage
  const jwtToken = localStorage.getItem("Token");
  const [logged, setLoginStatus] = useState(true);
  const [isload, setloader] = useState(false);
  const [userPlan, setUserPlan] = useState(false);
  const [newUser, setNewUser] = useState(true);
  const [userEmail, SetUserEmail] = useState("");
  useEffect(() => {
    axios
      .post("https://richpanel-golang.herokuapp.com/onload", { token: jwtToken })
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
      .post("https://richpanel-golang.herokuapp.com/userplan", { token: jwtToken })
      .then((response) => {
        console.log(response);
        setloader(true);
        setNewUser(true);
        setUserPlan(response.data.data);
      })
      .catch((error) => {
        setloader(true);
        console.log(error);
      });
  }, [jwtToken, logged]);

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

  if (newUser) {
    return (window.location = "/plan");
  }

  const cancelSubcription = () => {
    axios
      .post("https://richpanel-golang.herokuapp.com/cancelplan", { token: jwtToken })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    window.location.reload(false);
    cancelled();
  };

  welcome(userEmail);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(false);
  };
  return (
    <div>
      <ToastContainer />
      <div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
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
            Your subcription has started on {userPlan.subcripedAt} and will
            auto renew on {userPlan.renewAt}.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
