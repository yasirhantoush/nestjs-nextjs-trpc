"use client"
import { Button } from '@/components/ui/button'
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import React from 'react'

interface IProps {
  children: React.JSX.Element,
  open?: boolean,
  setOpen: (a: boolean) => any,
  label?: string,
  new?: boolean,
  buttonTitle?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}

function EditDialog(props: IProps) {
  return (
    <Dialog open={props.open} onOpenChange={(o) => {props.setOpen(o)}}>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>{props.dialogTitle ?? `${!props.new ? 'تعديل' : 'إنشاء'} ${props.label}`}</DialogTitle>
          <DialogDescription>
            {props.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {props.children}
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog