import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../config/api"; // axios.create({ baseURL: "http://<host>:<port>/api" })

/* ========================== OTP Verification ============================= */
const OtpVerification = ({ email, onVerified }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef([]);

  /* Countdown timer */
  useEffect(() => {
    const id = setInterval(() => setTimer((t) => (t ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  /* Handle OTP input */
  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx) refs.current[idx - 1]?.focus();
  };

  /* Resend OTP */
  const resend = async () => {
    try {
      await api.post("/user/forgot-password", { email });
      toast.success("Đã gửi lại OTP!");
      setTimer(120);
      setOtp(Array(6).fill(""));
      refs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không gửi lại được OTP");
    }
  };

  /* Verify OTP */
  const submit = async () => {
    const code = otp.join("");
    if (code.length !== 6) return setError("Hãy nhập đủ 6 số OTP.");

    setLoading(true);
    setError("");
    try {
      const res = await api.get("/user/verify-otp", { params: { email, otp: code } });
      if (res.data?.token) {
        toast.success("Xác thực thành công!");
        onVerified(res.data.token);
      } else {
        setError("OTP không đúng hoặc đã hết hạn.");
      }
    } catch (e) {
      setError(e.response?.data?.message || "OTP không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  /* UI */
  return (
    <div className="space-y-6">
      <p className="text-center text-sm font-medium text-red-700 mb-4">Nhập mã OTP</p>

      <div className="flex gap-2 justify-center">
        {otp.map((v, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            maxLength={1}
            className="w-12 h-12 text-center border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold text-red-900"
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <div className="text-center text-sm text-gray-500">
        {timer ? (
          <p>
            Gửi lại OTP sau {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </p>
        ) : (
          <button
            className="text-red-600 hover:text-red-800 font-medium"
            onClick={resend}
          >
            Gửi lại OTP
          </button>
        )}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang xác thực...
          </span>
        ) : (
          "Xác thực"
        )}
      </button>
    </div>
  );
};

/* ============================ Main Component ============================= */
const PasswordResetForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [pwd, setPwd] = useState("");
  const [cfm, setCfm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState({});

  const strong =
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /\d/.test(pwd) &&
    /[!@#$%^&*]/.test(pwd);

  /* Send OTP */
  const sendOTP = async () => {
    if (!email) return toast.error("Vui lòng nhập email");
    setLoading(true);
    try {
      await api.post("/user/forgot-password", { email });
      toast.success("Đã gửi OTP tới email!");
      setStep("otp");
    } catch (e) {
      toast.error(e.response?.data?.message || "Không gửi được OTP");
    } finally {
      setLoading(false);
    }
  };

  /* Reset password */
  const reset = async () => {
    const e = {};
    if (!strong) e.pwd = "Mật khẩu chưa đủ mạnh";
    if (pwd !== cfm) e.cfm = "Xác nhận không khớp";
    setErrs(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await api.post("/user/reset-password", {
        email,
        token,
        newPassword: pwd,
      });
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (er) {
      toast.error(er.response?.data?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  /* UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <Heart
            key={i}
            className="text-red-800 absolute animate-pulse transition-all duration-3000"
            style={{
              fontSize: `${Math.random() * 50 + 25}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 space-y-8">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-red-800" />
          <h2 className="mt-6 text-3xl font-extrabold text-red-900">
            {step === "email"
              ? "Quên mật khẩu"
              : step === "otp"
              ? "Xác thực OTP"
              : "Đặt lại mật khẩu"}
          </h2>
          <p className="mt-2 text-sm text-red-600">Hệ thống hiến máu</p>
        </div>

        {/* STEP 1: Email */}
        {step === "email" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-red-700">Email</label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                "Gửi OTP"
              )}
            </button>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <OtpVerification
            email={email}
            onVerified={(tk) => {
              setToken(tk);
              setStep("reset");
            }}
          />
        )}

        {/* STEP 3: Reset Password */}
        {step === "reset" && (
          <div className="space-y-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-red-700">Mật khẩu mới</label>
              <div className="mt-1 relative">
                <input
                  type={show1 ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShow1(!show1)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {show1 ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errs.pwd && <p className="mt-2 text-sm text-red-600">{errs.pwd}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-red-700">Xác nhận mật khẩu</label>
              <div className="mt-1 relative">
                <input
                  type={show2 ? "text" : "password"}
                  value={cfm}
                  onChange={(e) => setCfm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShow2(!show2)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {show2 ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errs.cfm && <p className="mt-2 text-sm text-red-600">{errs.cfm}</p>}
            </div>

            <button
              onClick={reset}
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetForm;
