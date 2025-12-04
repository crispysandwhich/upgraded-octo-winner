import CreateForm from "@/app/components/CreateForm";
import { getSession } from "@/app/lib/actions";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getSession() as any;

  if (!session.isLoggedIn || session.role !== "CAPTAIN") {
    return redirect("/"); 
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#0D0F12] text-gray-200 flex justify-center">
      <CreateForm userSession={JSON.stringify(session)} />
    </div>
  );
};

export default Page;
