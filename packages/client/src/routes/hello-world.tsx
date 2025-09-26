import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/hello-world")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();

  const navigate = Route.useNavigate();

  useEffect(() => {
    if (!session && !isPending) {
      navigate({
        to: "/",
      });
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold p-6">Hello World!</h1>
      <div className="px-6">
        <p className="text-gray-600 mb-4">認証機能付きのHello Worldページです。</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-semibold text-blue-800 mb-2">🎉 ログイン成功</h2>
          <p className="text-blue-700 text-sm mb-2">こちらは認証が必要なページです。ログインに成功したので表示されています。</p>
        </div>
      </div>
    </div>
  );
}
