import Header from "@/components/header";
import Loader from "@/components/loader";
import { Toaster } from "@/components/ui/sonner";
import { trpcQueryUtils } from "@/main";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import "../index.css";

export interface RouterAppContext {
  trpcQueryUtils: typeof trpcQueryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });
  return (
    <>
      <Header />
      {isFetching && <Loader />}
      <Outlet />
      <Toaster richColors />
    </>
  );
}
