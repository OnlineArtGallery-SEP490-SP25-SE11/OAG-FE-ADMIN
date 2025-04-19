"use client";

import React, { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";
import { Terminal, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleContext } from "@/components/ui.custom/interactive-overlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtistRequest } from "@/types/artist-request";
import { rejectArtistRequestAction, approveArtistRequestAction } from "./action";

const approveRequestSchema = z.object({});

const rejectRequestSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApproveRequestForm({ request, setIsOpen }: { request: ArtistRequest; setIsOpen: (open: boolean) => void }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");

  const approveForm = useForm<z.infer<typeof approveRequestSchema>>({
    resolver: zodResolver(approveRequestSchema),
    defaultValues: {},
  });

  const rejectForm = useForm<z.infer<typeof rejectRequestSchema>>({
    resolver: zodResolver(rejectRequestSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { execute: executeApprove, error: approveError, isPending: isApprovePending } = useServerAction(approveArtistRequestAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Artist request approved successfully",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve artist request",
        variant: "destructive",
      });
    }
  });

  const { execute: executeReject, error: rejectError, isPending: isRejectPending } = useServerAction(rejectArtistRequestAction, {
    onSuccess: () => {
      toast({
        title: "Request Rejected",
        description: "Artist request has been rejected",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject artist request",
        variant: "destructive",
      });
    }
  });

  const onApprove = () => {
    executeApprove({
      requestId: request._id,
    });
  };

  const onReject: SubmitHandler<z.infer<typeof rejectRequestSchema>> = (values) => {
    executeReject({
      requestId: request._id,
      reason: values.reason,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="relative aspect-[3/2] rounded-md overflow-hidden">
            <Image
              src={request.imageFront}
              alt="ID Front"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[3/2] rounded-md overflow-hidden">
            <Image
              src={request.imageBack}
              alt="ID Back"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{request.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID Number</p>
              <p className="font-medium">{request.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{request.dob}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nationality</p>
              <p className="font-medium">{request.nationality}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sex</p>
              <p className="font-medium">{request.sex}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{request.address}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Features</p>
            <p className="font-medium">{request.features}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "approve" | "reject")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="approve" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approve
          </TabsTrigger>
          <TabsTrigger value="reject" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Reject
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approve" className="mt-0">
          <Form {...approveForm}>
            <form onSubmit={approveForm.handleSubmit(onApprove)} className="space-y-4">
              <Separator className="my-6" />
              {approveError && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error approving request</AlertTitle>
                  <AlertDescription>{approveError.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isApprovePending}
                  className="w-32"
                  variant="default"
                >
                  {isApprovePending ? "Approving..." : "Approve"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="reject" className="mt-0">
          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(onReject)} className="space-y-4">
              <FormField
                control={rejectForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for rejection</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the reason for rejection"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-6" />
              {rejectError && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error rejecting request</AlertTitle>
                  <AlertDescription>{rejectError.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isRejectPending}
                  className="w-32"
                  variant="destructive"
                >
                  {isRejectPending ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}