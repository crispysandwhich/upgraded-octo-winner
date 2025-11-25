"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params; // <-- the dynamic route value

  return (
    <div>
      <h1>Single Blog Page</h1>
      <p>Blog ID: {id}</p>
    </div>
  );
}
