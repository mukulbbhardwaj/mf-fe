import { FC } from "react";

import MainLogo from "./MainLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useStore from "@/store/userStore";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const menus: { title: string; href: string }[] = [
  { title: "Learn", href: "/learn" },
  // { title: "Blogs", href: "/blogs" },
  { title: "Challenge", href: "/challenge" },
  { title: "Leaderboard", href: "/leaderboard" },
];

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const userStore = useStore();
  const navigate = useNavigate();
  const handleLogOut = () => {
    userStore.logoutUser();
    toast.info("Logged Out");
    navigate("/login");
  };
  return (
    <header className="flex items-center justify-between py-4 border-b border-border mb-6">
      <div>
        <MainLogo />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="default" size="sm" className="rounded-full hidden sm:inline-flex" asChild>
          <Link to="/challenge">Play</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            {menus.map((menu) => (
              <DropdownMenuItem key={menu.href} asChild>
                <Link to={menu.href} className="cursor-pointer">
                  {menu.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            {userStore.user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    Portfolio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <p className="text-sm text-muted-foreground">
                  <Link to="/login" className="underline hover:text-foreground">
                    Login
                  </Link>
                  {" or "}
                  <Link to="/register" className="underline hover:text-foreground">
                    Register
                  </Link>
                  {" to see your portfolio"}
                </p>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
