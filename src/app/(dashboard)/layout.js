import Menu from "../../components/Menu/page.js"
import Navbar from "../../components/Navbar/index.js";
import Image from "next/image";

const DashboardLayout=({children})=> {
  return (
    <div className="h-screen flex">
      <div className="w-[18%] md:w-[8%] lg:w-[20%] xl:w-[18%] p-4">
          <div className="flex flex-row  justify-center item-center">
          </div>
        <Menu />
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
          <Navbar />
        
        {children}
       
      </div>
    </div>
  );
}

export default DashboardLayout