'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../shareable/navbar";
import Card from "@/components/ui/card";
// import { environment } from "environment";
import BarLoader from "../shareable/bar-loader";

export default function Dashboard() {
  const [roomdata, setRoomdata] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const getRoomdata = async () => {
    try {
      setLoader(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/list/canvas`);
      setRoomdata(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(()=>{
    getRoomdata();
  },[])
  return (
    <>  
      <Navbar />
      <div className="w-screen min-h-screen bg-white dark:bg-black pt-12">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto w-full">
          {roomdata.length > 0 ? (
            roomdata.map((room: any, index: number) => (
              <Card key={index} {...room}  index={index}/>
            ))
          ) : (
            <div className="flex items-center justify-center w-full col-span-full py-10">
              <span className="text-foreground w-full py-5 font-bold text-xl text-center">
                No Room Found
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
