'use client'

import { MoonLoader } from "react-spinners";
import { Spinner } from "../ui/spinner";

interface IProps {
  title?: string
}

export default function Loading(props: IProps) {
  return (
    <div className="flex gap-2 justify-center items-center w-full h-[100vh]">
      <Spinner size={'medium'} /> {props.title}
    </div>
  );
};
