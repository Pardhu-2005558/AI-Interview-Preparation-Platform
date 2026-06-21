import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async () => {
    if (loading) return;

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://ai-interview-preparation-platform-hdj7.onrender.com/api/auth/register",
        form
      );

      alert("Registration Successful!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "80px auto",
        textAlign: "center",
        fontFamily: "Arial",
      }}
    >
      <h1>Register</h1>

      <input
        type="text"
        name="name"
        placeholder="Enter Name"
        value={form.name}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={form.email}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={form.password}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={register}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          background: "#1677ff",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p
        style={{
          marginTop: "20px",
        }}
      >
        Already have an account?
      </p>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Register;