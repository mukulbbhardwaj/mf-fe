import { FC } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// import chapters from "./data/chapters";
import modules from "./data/modules";
import ButtonArray from "../miscComponents/ButtonArray";

interface ChapterPageProps {}

const ChapterPage: FC<ChapterPageProps> = () => {
  const { id, chapterID } = useParams();

  const chapterContent =
    modules[parseInt(id!)].chapters[parseInt(chapterID!)].chapterContent;
  return (
    <div>
      <div className="flex flex-col justify-between lg:flex-row border-b ">
        <div className="">
          <div className="border-b-2 border-primary w-max link">
            {modules[parseInt(id!)].id}. {modules[parseInt(id!)].name}
          </div>
          <div className="my-4 text-4xl font-bold">
            {modules[parseInt(id!)].chapters[parseInt(chapterID!)].chapterID}. 
            {modules[parseInt(id!)].chapters[parseInt(chapterID!)].chapterName}
          </div>
        </div>
        <ButtonArray />
      </div>
      <div className="flex justify-center ">
        <div className=" w-7/12	my-4">
          <ReactMarkdown
            className="markdown"
            children={chapterContent}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
