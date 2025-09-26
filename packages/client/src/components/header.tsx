import { authClient } from "@/lib/auth-client";
import UserMenu from "./user-menu";
import { FileText } from "lucide-react";

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-xl font-semibold">
            My App
          </h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          {session && <UserMenu />}
        </div>
      </div>
      <hr />
    </div>
  );
}
