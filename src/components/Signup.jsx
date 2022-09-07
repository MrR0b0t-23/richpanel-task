import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { React } from "react";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isload, setloader] = userState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.clear();
    const userData = {
      userName: userName,
      emailId: emailId,
      password: password,
    };
    console.log(userData);
    axios
      .post("https://richpanel-golang.herokuapp.com/signup", userData)
      .then((response) => {
        console.log(response);
        setloader(true)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (isload){
    return (window.location = "/login");
  }
  return (
    <div className="home-container">
      <div className="container-content">
        <p className="container-title">Create Account</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              className="inputBox"
              type="text"
              placeholder="Enter name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="emailId">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="inputBox"
              type="email"
              placeholder="Enter email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="inputBox"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="rememberMe">
            <Form.Check
              className="inputBox"
              type="checkbox"
              label="Remember Me"
            />
          </Form.Group>

          <Button className="button" type="submit">
            Sign Up
          </Button>

          <div className="container-footer">
            Already have an account ? <a href="/login">Login</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
