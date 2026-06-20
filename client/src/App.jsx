import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "https://ai-interview-preparation-platform-hdj7.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Login Successful!");

      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Login Failed!"
      );
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "80px auto",
        textAlign: "center",
        fontFamily: "Arial",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
      }}
    >
      <h1>AI Interview Preparation Platform</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "20px",
        }}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button
        onClick={loginUser}
        style={{
          width: "100%",
          padding: "10px",
          background: "#1677ff",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Login
      </button>

      <p
        style={{
          marginTop: "25px",
        }}
      >
        Don't have an account?
      </p>

      <button
        onClick={() => (window.location.href = "/register")}
        style={{
          width: "100%",
          padding: "10px",
          background: "#22c55e",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Register
      </button>
    </div>
  );
}

export default App;