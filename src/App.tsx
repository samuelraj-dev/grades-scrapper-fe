import { useState } from "react";
import axios from "axios";
import './App.css'

const BASE_URL = 'https://rit-grades-scrapper-nd7cw.ondigitalocean.app';
// const BASE_URL = 'http://127.0.0.1:5000';

type GradesData = {
  CGPA: number;
  grades: Record<string, { GPA: number }>;
};

type ErrorResponse = {
  response?: {
    data?: {
      error?: string;
    };
  };
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
      setError((err as ErrorResponse)?.response?.data?.error || "Something went wrong. Please try later.");
      // console.log(err);
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
      // console.log(err.response.data)
      setError((err as ErrorResponse)?.response?.data?.error || "Something went wrong. Please try later.");
    }
    setPhoneNumber("")
    setLoading(false);
  };

  return (
    <div className="flex items-center flex-col justify-start w-full min-h-screen overflow-x-hidden">
      <div className="bg-yellow-200 text-yellow-800 text-center p-2 font-medium w-full">
        🚧 This app is in testing phase. Features may change or break.
      </div>

      <div className="container mx-auto p-4 max-w-md">
        <div className="mt-8 max-w-md p-6 bg-white rounded-2xl shadow-lg border border-gray-200">

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
              className="text-black bg-white border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-black bg-white border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
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
        </div>

        {error !== "" && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <span>❌ {error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <span className="loader"></span>
          </div>
        )}

        {grades && (
          <div className="mt-8 max-w-md p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
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

      <p className="text-sm text-white text-center my-4">
        Facing issues? Report to{" "}
        <a href="mailto:samuelrajholyns@gmail.com" className="underline">
          samuelrajholyns@gmail.com
        </a>
      </p>
    </div>
  );
}