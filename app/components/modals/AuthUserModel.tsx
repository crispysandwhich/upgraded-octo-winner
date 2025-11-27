"use client";

import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { useModal } from "@/app/hooks/use-modal-store";
import { HandleCredentialSignin, HandleWalletSignin } from "@/app/lib/actions";

export type AuthPayload = {
  email?: string;
  password?: string;
  metaAddress?: string | null;
  signature?: string | null;
  firstTime?: boolean;
};

const AuthUserModel = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "AuthUser";

  const router = useRouter();

  // UI state
  const [tab, setTab] = useState<"credentials" | "wallet">("credentials");

  // form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstTime, setFirstTime] = useState(false);

  // -----------------------
  // EMAIL + PASSWORD LOGIN
  // -----------------------
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: AuthPayload = {
      email,
      password,
      metaAddress: null,
      signature: null,
      firstTime
    };

    try {
      const res = await HandleCredentialSignin(payload);

      if (res.status === "success") {
        // router.push("/profile");
        toast("Login successful");
        onClose();
        router.refresh();
      } else {
        toast("Invalid email or password");
      }
    } catch (err) {
      toast("Error logging in");
    }
  };

  // -----------------------
  // METAMASK SIGN-IN
  // -----------------------
  const handleWalletLogin = async () => {
    try {
      if (!window.ethereum) {
        toast("MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = "Sign in to confirm ownership of this wallet.";
      const signature = await signer.signMessage(message);

      const payload: AuthPayload = {
        email: null,
        password: null,
        metaAddress: address,
        signature,
        firstTime
      };
      const res = await HandleWalletSignin(payload);
      if (res.status === "success") {
        // router.push("/profile");
        toast("Wallet authenticated successfully");
        onClose();
        router.refresh();
      } else {
        toast("Wallet authentication failed");
      }
    } catch (err) {
      toast("Error connecting to MetaMask");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isModalOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <dialog
        open={isModalOpen}
        className="relative bg-white rounded-xl shadow-xl p-5 w-full max-w-sm"
      >
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            className={`flex-1 pb-2 text-sm ${
              tab === "credentials" ? "font-bold border-b-2" : "text-gray-400"
            }`}
            onClick={() => setTab("credentials")}
          >
            Email Login
          </button>

          <button
            className={`flex-1 pb-2 text-sm ${
              tab === "wallet" ? "font-bold border-b-2" : "text-gray-400"
            }`}
            onClick={() => setTab("wallet")}
          >
            MetaMask
          </button>
        </div>

        {/* ----------------------------- */}
        {/*       EMAIL / PASSWORD FORM    */}
        {/* ----------------------------- */}
        {tab === "credentials" && (
          <form
            onSubmit={handleCredentialsLogin}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              placeholder="Email"
              className="border rounded-md px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="border rounded-md px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="firstTime">
              <input
                type="checkbox"
                id="firstTime"
                className="mr-2"
                checked={firstTime}
                onChange={(e) => setFirstTime(e.target.checked)}
              />
              First time user
            </label>

            <button
              type="submit"
              className="bg-black text-white py-2 rounded-md text-sm"
            >
              Sign in
            </button>
          </form>
        )}

        {/* ----------------------------- */}
        {/*          METAMASK LOGIN        */}
        {/* ----------------------------- */}
        {tab === "wallet" && (
          <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-500">
              Sign in by proving ownership of your MetaMask wallet.
            </div>

            <label htmlFor="firstTime">
              <input
                type="checkbox"
                id="firstTime"
                className="mr-2"
                checked={firstTime}
                onChange={(e) => setFirstTime(e.target.checked)}
              />
              First time user
            </label>

            <button
              onClick={handleWalletLogin}
              className="bg-orange-500 text-white py-2 rounded-md text-sm hover:bg-orange-600"
            >
              Connect & Sign Message
            </button>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 text-sm"
        >
          ✕
        </button>
      </dialog>
    </div>
  );
};

export default AuthUserModel;
