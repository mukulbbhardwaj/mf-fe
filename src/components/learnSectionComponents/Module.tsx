import { FC } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const COLOR_BORDER: Record<string, string> = {
  green: "border-green-500",
  blue: "border-blue-500",
  violet: "border-violet-500",
  amber: "border-amber-500",
  border: "border-border",
};

interface ModuleProps {
  id: string;
  name: string;
  desc: string;
  color: string;
  order?: number;
}

const Module: FC<ModuleProps> = ({ name, desc, id, color, order }) => {
  return (
    <div className="lg:w-64">
      <div className="flex gap-4 justify-center items-center">
        <div className="text-2xl font-bold">{order !== undefined ? order + 1 : id.slice(0, 1)}</div>
        <div className={cn("w-full h-0 border-2", COLOR_BORDER[color] ?? "border-border")} />
      </div>
      <div className="ml-1">
        <Link to={`/modules/${encodeURIComponent(id)}`} className="link">
          <div className="text-bold text-xl">{name}</div>
        </Link>
        <div className="text-sm text-secondary-foreground my-2">{desc}</div>
      </div>
    </div>
  );
};

export default Module;
