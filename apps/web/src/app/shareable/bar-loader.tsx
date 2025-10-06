"use client";

import { BarLoader as ReactBarLoader } from "react-spinners";

export default function BarLoader() {
  return (
    <div className="w-full">
      <ReactBarLoader color="hsl(var(--primary))" width="100%" height={2}/>
    </div>
  );
}
