import { useAuth } from "@/lib/AuthContext";
import { Link } from "@tanstack/react-router";
import { LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthMenu() {
  const { user, isLoadingAuth, navigateToLogin, logout } = useAuth();

  if (isLoadingAuth) {
    return <span className="h-11 w-24 animate-pulse rounded-xl bg-muted" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => navigateToLogin()}
        className="tap rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Sign in
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tap inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-bold text-foreground hover:bg-secondary"
        >
          <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="max-w-[7rem] truncate">{user.full_name || "My account"}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="truncate text-[0.8rem] font-normal text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "admin" ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="cursor-pointer font-semibold">
                <ShieldCheck className="mr-2 h-4 w-4 text-primary" aria-hidden="true" /> Curator console
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/outreach" className="cursor-pointer font-semibold">
                <Mail className="mr-2 h-4 w-4 text-primary" aria-hidden="true" /> Email prospects
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuItem onSelect={() => logout()} className="cursor-pointer font-semibold">
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}