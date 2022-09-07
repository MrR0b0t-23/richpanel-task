import React from "react";
import "./Payments.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useState, useEffect } from "react";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51LeCTcSDyoGuF7sjjrugARViax2Ome90fGUvpOyxwZuHrrj9aclXmwiKRAslru4Lb2PUGXPNb3KYByb37sXWsnxu00gzLQMbiv"
);

function Payment() {
  const metadata = JSON.parse(localStorage.getItem("metadata"));
  const [logged, setLoginStatus] = useState(true);
  const [isload, setloader] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const jwtToken = localStorage.getItem("Token");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axios
      .post("https://richpanel-golang.herokuapp.com/onload", { token: jwtToken })
      .then((response) => {
        console.log(response);
        console.log(response.data.message);
        if (response.message === "failure") {
          localStorage.clear();
          setLoginStatus(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoginStatus(false);
      });
    if (logged) {
      axios
        .post("https://richpanel-golang.herokuapp.com/create-payment-intent/" + metadata.priceId)
        .then((response) => {
          console.log(response);
          setloader(true);
          setClientSecret(response.data.data);
        })
        .catch((error) => {
          setloader(true);
          console.log(error);
        });
    }
  }, [jwtToken, logged, metadata.priceId]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

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

  const handleLogout = () => {
    localStorage.clear();
    return (window.location = "/login");
  };

  return (
    <div>
      <div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <div className="container">
        <div className="payment-wrapper">
          <div className="payment-title">Complete Payment</div>
          <div className="payment-subtitle">
            Enter your credit or debit card details below
          </div>
          <div className="payment-stripe">
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  jwtToken={jwtToken}
                  metadata={metadata}
                />
              </Elements>
            )}
          </div>
        </div>

        <div className="summary-wrapper">
          <div className="summary-title">Order Summary</div>
          <div className="summary-table">
            <table>
              <tbody className="divide-y divide-[#e4e5e5]">
                <tr>
                  <td className="summaryFeature-title ">Plan Name</td>
                  <td className="summaryFeature-value ">{metadata.planName}</td>
                </tr>
                <tr>
                  <td className="summaryFeature-title ">Billing Cycle</td>
                  <td className="summaryFeature-value ">{metadata.type}</td>
                </tr>

                <tr>
                  <td className="summaryFeature-title ">Plan Price</td>
                  <td className="summaryFeature-value ">
                    &#x20B9; {metadata.price.toLocaleString()}{" "}
                    {metadata.type === "Monthly" ? "/mo" : "/yr"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
