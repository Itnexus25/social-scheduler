// client/src/components/Navbar.tsx
import { useRouter } from "next/router";
import React from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const { isSignedIn } = useUser();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#222", // Dark background for high contrast
        color: "#fff",
        padding: "1rem 2rem",
        marginBottom: "2rem"
      }}
    >
      {/* Home Button */}
      <button
        onClick={() => router.push("/")}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "1rem"
        }}
      >
        Home
      </button>

      <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>
        Social Scheduler
      </div>

      {/* Show the logout button only if the user is signed in and not on the homepage */}
      {isSignedIn && !isHomePage && (
        <SignOutButton>
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </SignOutButton>
      )}
    </nav>
  );
};

export default Navbar;