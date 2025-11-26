
import { getSession } from "@/app/lib/actions";
import MainHeader from "./MainHeader";

export default async function SessionHeader() {
  const session = await getSession();
  return <MainHeader userData={JSON.stringify(session)} version={Date.now()} />;
}
