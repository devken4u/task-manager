import Layout from "../components/Layout";
import Authenticate from "../components/Authenticate";
import {
  emailVerificationMutation,
  checkEmailVerificationCodeMutation,
} from "../api/mutations/VerificationMutation";
import Button from "../components/Button";
import Input from "../components/Input";
import { useEffect, useState, useRef } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const emailVerification = emailVerificationMutation();
  const checkEmailVerification = checkEmailVerificationCodeMutation();
  const [statusMessage, setStatusMessage] = useState(<></>);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestCooldown, setRequestCooldown] = useState(0);
  const requestIntervalId = useRef(setTimeout(() => {}));
  const [code, setCode] = useState({
    code1: "",
    code2: "",
    code3: "",
    code4: "",
  });

  function setCooldownTimer() {
    if (requestIntervalId.current) {
      clearInterval(requestIntervalId.current); // Clears any existing interval
    }
    requestIntervalId.current = setInterval(() => {
      setRequestCooldown((prev) => {
        if (prev - 1 === 0) {
          clearInterval(requestIntervalId.current);
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleVerificationClick() {
    if (Object.values(code).join("").length === 4) {
      setErrorMessage("");
      checkEmailVerification.mutate(Object.values(code).join(""));
    } else {
      setErrorMessage("Invalid Code.");
    }
  }

  // request a code in the first load
  useEffect(() => {
    emailVerification.mutate();
  }, []);

  // use effect if the data changes (successful request email verification code)
  useEffect(() => {
    if (emailVerification.data?.data) {
      setRequestCooldown(emailVerification.data?.data.cooldown);
      setCooldownTimer();
      setStatusMessage(
        <>
          We've sent a code to{" "}
          <span className="font-bold">
            {emailVerification.data?.data.email}
          </span>
        </>
      );
    }
  }, [emailVerification.data]);

  // use effect if request email verification code has error
  useEffect(() => {
    const error = emailVerification.error as AxiosError;
    if (error) {
      const data = error.response?.data as { email: string; cooldown: number };
      setRequestCooldown(data.cooldown);
      setCooldownTimer();
      setStatusMessage(
        <>
          We've already sent a code to{" "}
          <span className="font-bold">{data.email}</span>
        </>
      );
    }
  }, [emailVerification.error]);

  // use effect if the data changes (successful  email verification)
  useEffect(() => {
    if (checkEmailVerification.data) navigate("/");
  }, [checkEmailVerification.data]);

  // use effect if  email verification has error
  useEffect(() => {
    if (checkEmailVerification.error) setErrorMessage("Invalid Code.");
  }, [checkEmailVerification.error]);

  return (
    <Authenticate
      redirectIfAuthenticated={false}
      unauthenticatedPath="/"
      userPath="/user-dashboard"
    >
      <Layout>
        <div className="flex items-center justify-center size-full">
          <div className="p-8 rounded-md shadow-md bg-zinc-50 max-w-96">
            <h1 className="text-2xl font-bold text-center">
              Enter Verification Code
            </h1>
            <p className="text-center">{statusMessage}</p>

            <div className="py-8">
              <div className="flex justify-center gap-4 ">
                <Input
                  autoComplete="off"
                  id="code1"
                  className="text-xl font-bold text-center border-gray-200/95"
                  maxLength={1}
                  value={code.code1}
                  onChange={(e) => {
                    if (e.target.value !== " ")
                      setCode((prev) => ({ ...prev, code1: e.target.value }));
                  }}
                />
                <Input
                  autoComplete="off"
                  id="code2"
                  className="text-xl font-bold text-center border-gray-200/95"
                  maxLength={1}
                  value={code.code2}
                  onChange={(e) => {
                    if (e.target.value !== " ")
                      setCode((prev) => ({ ...prev, code2: e.target.value }));
                  }}
                />
                <Input
                  autoComplete="off"
                  id="code3"
                  className="text-xl font-bold text-center border-gray-200/95"
                  maxLength={1}
                  value={code.code3}
                  onChange={(e) => {
                    if (e.target.value !== " ")
                      setCode((prev) => ({ ...prev, code3: e.target.value }));
                  }}
                />
                <Input
                  autoComplete="off"
                  id="code4"
                  className="text-xl font-bold text-center border-gray-200/95"
                  maxLength={1}
                  value={code.code4}
                  onChange={(e) => {
                    if (e.target.value !== " ")
                      setCode((prev) => ({ ...prev, code4: e.target.value }));
                  }}
                />
              </div>
              {errorMessage && (
                <p className="mt-2 text-center text-red-500">{errorMessage}</p>
              )}
            </div>

            <p className="text-center">
              Didn't get a code?{" "}
              {requestCooldown <= 0 ? (
                <span
                  className="font-bold cursor-pointer hover:border-b border-b-zinc-900"
                  onClick={() => {
                    emailVerification.mutate();
                  }}
                >
                  Click to resend.
                </span>
              ) : (
                <span className="font-bold">Resend in {requestCooldown}</span>
              )}
            </p>
            <Button
              isLoading={checkEmailVerification.isPending}
              className="w-full p-2 mt-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
              onClick={handleVerificationClick}
            >
              Verify
            </Button>
          </div>
        </div>
      </Layout>
    </Authenticate>
  );
}

export default VerifyEmailPage;
