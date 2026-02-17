import Image from "next/image";

const UserCard = ({ type, count = 0 }) => {
  console.log("total", count);


  const currentYear = new Date().getFullYear();
 
  const financialYear = `${currentYear}/${currentYear + 1}`;

  return (
    <div className="rounded-xl odd:bg-white even:bg-white p-4 flex-1 min-w-[150px] shadow-lg">
      <div className="flex justify-between items-center">
        <span className="text-[14px] bg-white px-2 py-1 rounded-full text-pink-600">
          {financialYear}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-black">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-black text-xl">{type}</h2>
    </div>
  );
};

export default UserCard;
