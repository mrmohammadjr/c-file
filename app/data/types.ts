import { CiTextAlignCenter } from "react-icons/ci";
import { FaHtml5, FaFilePdf } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa6";
import { FaFilePowerpoint } from "react-icons/fa6";
import { FaFileWord } from "react-icons/fa6";
export const ext = [
  {
    id: 1,
    type: "pdf",
    theme: "red",
    icon: FaFilePdf,
  },
  {
    id: 2,
    type: "docx",
    theme: "blue",
    icon: FaFileWord,
  },
  {
    id: 3,
    type: "xlsx",
    theme: "green",
    icon: FaFileExcel,
  },
  {
    id: 4,
    type: "pptx",
    theme: "red",
    icon: FaFilePowerpoint,
  },
  {
    id: 6,
    type: "txt",
    theme: "yellow",
    icon: CiTextAlignCenter,
  },
];
