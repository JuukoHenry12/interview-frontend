import Image from "next/image";
import Form from "@/components/forms";
import logo from "../../../public/assets/logo.png";
import "./index.css";

const SignUp = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 h-screen">
      {/* Left logo section - only visible on large screens (laptops/desktops) */}

      {/* Form section */}
      <div className="w-full max-w-lg p-6">
        {/* Logo only visible on mobile and tablets */}
        <div className="block lg:hidden flex flex-col items-center mb-6 mt-2">
          <Image
            src={logo}
            width={200}
            height={200}
            alt="image not found"
            className="logo2"
          />
        </div>
        <Form />
      </div>
    </div>
  );
};

export default SignUp;
