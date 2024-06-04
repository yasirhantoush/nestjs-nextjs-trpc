import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IProps {
  title?: string;
  data: any;
}

export default function Debug(props: IProps) {
  if (process.env.NEXT_PUBLIC_DEBUG !== '1') {
    return <></>
  }
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Debug {props.title}</Button>
    </DialogTrigger>
    <DialogContent className="w-[90%] h-[90vh]">
      <DialogHeader>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogDescription>
        </DialogDescription>
      </DialogHeader>
      <pre dir="ltr" className="whitespace-pre overflow-auto">{JSON.stringify(props.data, null, 4)}</pre>
      <DialogFooter>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}

