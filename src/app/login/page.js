import Image from "next/image";
import LoginForm from "@/components/login";
import logo from "../../../public/assets/logo.png";
import "./index.css";

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen">
    
      <div className="w-full max-w-lg p-6">
        <div className="block md:hidden flex flex-col items-center mb-6">
          <Image src={logo} width={200} height={200} alt="Logo not found" className="logo2" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
