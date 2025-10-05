"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { PenTool } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValue = {
  canvasName: string;
};

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValue>({ mode: "onTouched" });

  const onSubmit = async (data: FormValue) => {
    console.log("data", data);
    const payload = {
      canvas_name : data?.canvasName?.trim()
    }
    console.log("payload",payload);
  };
  return (
    <>
      <header className="bg-background border-b border-border shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            {/* Left side */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                <PenTool className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent text-foreground">
                DrawWithMe
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Signed out */}
              <SignedOut>
                <SignInButton forceRedirectUrl={"/dashboard"}>
                  <button className="border border-border hover:border-primary text-foreground px-6 py-2 rounded-xl font-semibold text-base transition-all backdrop-blur-sm bg-muted">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full border border-border hover:scale-110 transition"
              >
                {theme === "dark" ? (
                  <PenTool className="w-5 h-5 text-yellow-400" />
                ) : (
                  <PenTool className="w-5 h-5 text-gray-900" />
                )}
              </button>

              {/* Signed in */}
              <SignedIn>
                {/* Dialog Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="border border-gray-700 hover:border-white text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 bg-black/20 backdrop-blur-md hover:shadow-[0_0_10px_#00ffd060] flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span className="whitespace-nowrap">Create</span>
                    </button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a Room</DialogTitle>
                      <DialogDescription>
                        This form lets you create a room where you can play with
                        your own canvas.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="canvasName"
                          className="block text-sm font-medium mb-1 text-foreground"
                        >
                          Canvas Name
                        </label>
                        <input
                          id="canvasName"
                          type="text"
                          {...register("canvasName", {
                            required: "Canvas Name is required",
                            minLength: {
                              value: 4,
                              message:
                                "Canvas name must be at least 4 characters long",
                            },
                            validate: (value)=>
                              value.trim().length >= 4 || "Canvas name must be at least 4 characters long",
                            }
                          )}
                          className="w-full rounded-md border border-border px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.canvasName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.canvasName.message as string}
                          </p>
                        )}
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" type="button">
                            Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                        <Button type="submit" disabled={!isValid}>
                          Save changes
                        </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* user button */}
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "w-10 h-10 border border-border rounded-full",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
