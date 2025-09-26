import { authClient } from "@/lib/auth-client";
import { signInSchema, signUpSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Copy, Check, Eye, EyeOff, ArrowDown } from "lucide-react";
import Loader from "./loader";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormData = {
  email: string;
  password: string;
  name?: string;
};

export default function AuthForm() {
  const navigate = useNavigate({
    from: "/",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const { isPending } = authClient.useSession();

  // Demo account credentials
  const demoEmail = "demo@example.com";
  const demoPassword = "demo123456";

  // Demo account UI state
  const [showPassword, setShowPassword] = useState(false);
  const [copyStates, setCopyStates] = useState({
    email: { copied: false },
    password: { copied: false }
  });

  const form = useForm<FormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  // Demo account helper functions
  const copyToClipboard = async (text: string, type: 'email' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates(prev => ({
        ...prev,
        [type]: { copied: true }
      }));
      toast.success(`${type === 'email' ? 'メールアドレス' : 'パスワード'}をコピーしました`);
      setTimeout(() => {
        setCopyStates(prev => ({
          ...prev,
          [type]: { copied: false }
        }));
      }, 2000);
    } catch {
      toast.error('コピーに失敗しました');
    }
  };

  const fillEmail = () => {
    form.setValue('email', demoEmail);
    toast.success('メールアドレスを入力しました');
  };

  const fillPassword = () => {
    form.setValue('password', demoPassword);
    toast.success('パスワードを入力しました');
  };

  const fillBothFields = () => {
    form.setValue('email', demoEmail);
    form.setValue('password', demoPassword);
    toast.success('デモアカウント情報を入力しました');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: FormData) => {
    if (isSignUp) {
      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name || "",
        },
        {
          onSuccess: () => {
            toast.success("Sign up successful");
            navigate({
              to: "/hello-world",
            });
          },
          onError: (ctx) => {
            form.setError("email", {
              type: "manual",
              message: ctx.error.message,
            });
          },
        },
      );
    } else {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            toast.success("Sign in successful");
            navigate({
              to: "/hello-world",
            });
          },
          onError: (ctx) => {
            form.setError("email", {
              type: "manual",
              message: ctx.error.message,
            });
          },
        },
      );
    }
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h1>

      {/* Demo Account Section - Only show for Sign In - Moved to top */}
      {!isSignUp && (
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300 text-center">
              デモアカウント
            </div>

            <div className="space-y-2">
              {/* Email */}
              <div className="flex items-center gap-2">
                <Label className="text-xs text-blue-600 dark:text-blue-400 min-w-[80px]">Email:</Label>
                <div className="flex-1 bg-white dark:bg-blue-900/30 rounded px-2 py-1 text-sm font-mono border">
                  {demoEmail}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(demoEmail, 'email')}
                  className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300"
                  title={copyStates.email.copied ? 'コピー済み!' : 'メールアドレスをコピー'}
                >
                  {copyStates.email.copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fillEmail}
                  className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300"
                  title="入力フィールドに設定"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              {/* Password */}
              <div className="flex items-center gap-2">
                <Label className="text-xs text-blue-600 dark:text-blue-400 min-w-[80px]">Password:</Label>
                <div className="flex-1 bg-white dark:bg-blue-900/30 rounded px-2 py-1 text-sm font-mono border">
                  {showPassword ? demoPassword : '••••••••••••'}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300"
                  title={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(demoPassword, 'password')}
                  className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300"
                  title={copyStates.password.copied ? 'コピー済み!' : 'パスワードをコピー'}
                >
                  {copyStates.password.copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fillPassword}
                  className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300"
                  title="入力フィールドに設定"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* 一括設定ボタン */}
            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillBothFields}
                className="w-full text-xs h-7 border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                両方とも入力フィールドに設定
              </Button>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={() => {
            setIsSignUp(!isSignUp);
            form.reset();
          }}
          className="text-indigo-600 hover:text-indigo-800"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </Button>
      </div>
    </div>
  );
}
