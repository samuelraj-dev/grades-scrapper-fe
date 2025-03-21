import { useState } from "react";
import axios from "axios";
import './App.css'

const BASE_URL = 'https://rit-grades-scrapper-nd7cw.ondigitalocean.app';

type GradesData = {
  CGPA: number;
  grades: Record<string, { GPA: number }>;
};

export default function CollegePortal() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [grades, setGrades] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGrades = async () => {
    setError("");
    // setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/get_grades`, { withCredentials: true });
      setGrades(response.data);
    } catch (err) {
      setError("Failed to fetch grades. Please log in again.");
      console.log(err);
    }
    // setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setGrades(null);
    try {
      await axios.post(
        `${BASE_URL}/api/auth/login`,
        { register_number: registerNumber, phone_number: phoneNumber },
        { withCredentials: true }
      );
      await fetchGrades();
    } catch (err) {
      console.log(err)
      setError("Login failed. Please check your details.");
    }
    setPhoneNumber("")
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center flex-col justify-center w-screen h-full">
      <div className="container mx-auto p-4 max-w-md">
        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-4">CGPA Calculator</h2>
        <p className="text-md text-gray-600 text-center mb-6">
          <strong>Instructions:</strong> Enter your IMS credentials  
        </p>
        <p className="text-sm text-red-500 text-center mb-4">
          ⚠️ Note: Works only for RIT II-CSBS students
        </p>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <input
            type="text"
            name="username"
            placeholder="Register Number"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 text-white font-semibold rounded-lg transition-all ${
              loading
                ? "bg-cyan-300 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error !== "" && <p className="text-red-500 mt-2">{error}</p>}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <span className="loader"></span>
          </div>
        )}

        {grades && (
          <div className="mt-4 max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Academic Performance</h2>
            <div className="mt-4 p-4 bg-blue-100 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-700">Overall CGPA</p>
              <p className="text-3xl font-extrabold text-blue-900">{grades?.CGPA?.toFixed(3)}</p>
            </div>
            <div className="mt-6 space-y-3">
            {Object.entries(grades?.grades || {}).map(([semester, { GPA }]) => (
              <div key={semester} className="flex justify-between bg-gray-100 p-3 rounded-lg shadow">
                <span className="text-gray-700 font-medium">{semester}</span>
                <span className="text-blue-700 font-bold text-lg">{GPA.toFixed(3)}</span>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}