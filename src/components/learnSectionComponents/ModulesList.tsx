import { FC } from "react";
import Module from "./Module";
import type { CategoryInfo } from "@/pages/LearnSectionPage";

interface ModulesListProps {
  categories: CategoryInfo[];
}

const ModulesList: FC<ModulesListProps> = ({ categories }) => {
  return (
    <div className="flex gap-4 flex-col lg:flex-row lg:gap-32">
      {categories.map((cat, index) => (
        <Module
          key={cat.id}
          id={cat.id}
          name={cat.name}
          desc={cat.desc}
          color={cat.color}
          order={index}
        />
      ))}
    </div>
  );
};

export default ModulesList;
