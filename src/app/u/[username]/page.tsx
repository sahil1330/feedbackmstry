"use client";
import React, { useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import { messageSchema } from "@/schemas/messageSchema";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MessageCard from "@/components/MessageCard";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { Message } from "@/model/User.model";

const UserPublicProfile = () => {
  const params = useParams();
  const username = params.username as string;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {};

  const { toast } = useToast();

  const { data: session } = useSession();
  // console.log(session);
  const onSubmit = async (data: messageSchema) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content: data.content,
        username,
      });
      if (response?.data.success) {
        toast({
          title: response.data.message,
        });
      }
      if (!response?.data.success) {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestMessages = async () => {
    const response = await axios.post<ApiResponse>("/api/suggest-messages", {});
    setMessages(response.data.messages || []);
    console.log(response.data.messages);
  };

  return (
    <div>
      <h1 className="text-center m-6 md:m-10 text-3xl md:text-5xl font-bold">
        Public Profile Link
      </h1>
      <div className="w-full m-auto flex justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-5/6 md:w-2/3 space-y-8"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold md:text-lg text-sm">
                    Send anonymous message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "Send it"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="suggestions md:w-2/3 w-5/6 mx-auto space-y-8 my-8 flex justify-center items-center">
        <div className="w-full md:space-y-6 space-y-4 mx-auto flex flex-col">
          <Button className="" onClick={suggestMessages}>
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card>
                <CardContent className="font-bold text-lg flex justify-center items-center p-2 ">
                  Card Content 1
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
      {session ? (
        <div></div>
      ) : (
        <div className="createAccountButton">
          <Button>Create Account</Button>
        </div>
      )}
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="messages">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={function (messageId: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPublicProfile;
