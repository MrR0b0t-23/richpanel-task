import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Navigate } from "react-router-dom";
import CardSection from "./CardSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from "react";

const paymentSuccess = () =>
  toast.success("Payment Successful !", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });

export default function CheckoutForm({ clientSecret, jwtToken, metadata }) {
  const stripe = useStripe();
  const elements = useElements();
  const [logged, setLoginStatus] = useState(true);
  const [userEmail, SetUserEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);

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
        SetUserEmail(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        setLoginStatus(false);
      });
  }, [jwtToken]);
  console.log(userEmail);

  if (!jwtToken || jwtToken === "undefined") {
    return <Navigate to="login" />;
  }

  // if not valid redirect to login
  if (logged === false) {
    return (window.location = "login");
  }

  if (paymentStatus) {
    setPaymentStatus(false);
    return <Navigate to="/" />;
  }

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: userEmail,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        axios
          .post("http://localhost:5000/activeplan", {
            token: jwtToken,
            planName: metadata.planName,
            videoQuality: metadata.videoQuality,
            resolution: metadata.resolution,
            device: metadata.devices,
            price: parseInt(metadata.price),
            type: metadata.type,
            activeScreens: metadata.activeScreens,
          })
          .then((response) => {
            console.log(response);
            console.log(response.data.message);
            if (response.message === "failure") {
              localStorage.removeItem("metadata");
            }
            SetUserEmail(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
        setPaymentStatus(true);
        paymentSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <CardSection />
      <button disabled={!stripe} type="sumbit" className="payment-bnt">
        {!stripe ? <div class="loader"></div> : "Confirm Payment"}{" "}
      </button>
    </form>
  );
}

//  <button type="sumbit" className="payment-bnt" disabled={isLoading}>
//          {isLoading ? <div class="loader"></div> : "Pay now"}

//    const paymentProcessing = () =>
//      toast.info("Payment Intitated !", {
//        position: "top-right",
//        autoClose: 3000,
//        hideProgressBar: false,
//        closeOnClick: true,
//        pauseOnHover: true,
//        draggable: false,
//        progress: undefined,
//      });

//    const paymentError = () =>
//      toast.error("Payment Error, Try again !", {
//        position: "top-right",
//        autoClose: 3000,
//        hideProgressBar: false,
//        closeOnClick: true,
//        pauseOnHover: true,
//        draggable: false,
//        progress: undefined,
//      });

//    const paymentStatusUnknown = () =>
//      toast.error("Something went wrong", {
//        position: "top-right",
//        autoClose: 3000,
//        hideProgressBar: false,
//        closeOnClick: true,
//        pauseOnHover: true,
//        draggable: false,
//        progress: undefined,
//      });
