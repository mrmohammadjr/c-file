import Image from "next/image";
import Intro from "./components/Intro";
import UploadFile from "./components/UploadFile";
import Services from "./components/Services";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Intro />
      <UploadFile />
    </div>
  );
}
