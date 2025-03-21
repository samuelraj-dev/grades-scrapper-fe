import { useState } from "react";
import axios from "axios";

const BASE_URL = 'https://rit-grades-scrapper-nd7cw.ondigitalocean.app';

export default function CollegePortal() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [grades, setGrades] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGrades = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/api/get_grades`, { withCredentials: true });
      setGrades(response.data);
    } catch (err) {
      setError("Failed to fetch grades. Please log in again.");
      console.log(err)
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${BASE_URL}/api/auth/login`,
        { register_number: registerNumber, phone_number: phoneNumber },
        { withCredentials: true }
      );
      fetchGrades();
    } catch (err) {
      console.log(err)
      setError("Login failed. Please check your details.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-xl font-bold mb-4">CGPA Calculator</h2>
      <h4 className="text-l font-bold mb-4">Instructions: Enter your IMS credentials</h4>
      <p>Note: Works only for RIT II-CSBS students</p>
      <input
        type="text"
        placeholder="Register Number"
        value={registerNumber}
        onChange={(e) => setRegisterNumber(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 w-full rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error !== "" && <p className="text-red-500 mt-2">{error}</p>}
      {grades && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Your Grades</h3>
          <pre className="bg-gray-100 p-2">{JSON.stringify(grades, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}