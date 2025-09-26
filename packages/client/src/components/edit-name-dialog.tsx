import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const nameSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100, "名前は100文字以内で入力してください"),
});

type NameFormData = z.infer<typeof nameSchema>;

interface EditNameDialogProps {
  children: React.ReactNode;
  currentName: string;
}

export default function EditNameDialog({ children, currentName }: EditNameDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const updateName = trpc.user.updateName.useMutation({
    onSuccess: () => {
      toast.success("名前を更新しました");
      utils.user.getCurrentUser.invalidate();
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const onSubmit = (data: NameFormData) => {
    updateName.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>名前を変更</DialogTitle>
          <DialogDescription>
            表示される名前を変更できます。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="名前を入力" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                disabled={updateName.isPending}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={updateName.isPending}
              >
                {updateName.isPending ? "更新中..." : "更新"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}