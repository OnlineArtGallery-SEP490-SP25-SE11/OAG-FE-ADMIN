"use client";

import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";
import { Terminal, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { approveExhibitionAction, rejectExhibitionAction } from "./action";
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleContext } from "@/components/ui.custom/interactive-overlay";
import { Exhibition } from "@/types/exhibition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const approveExhibitionSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const rejectExhibitionSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApproveExhibitionForm({ exhibition, setIsOpen }: { exhibition: Exhibition; setIsOpen: (open: boolean) => void }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");

  // Get default name from contents based on default language
  const defaultContent = exhibition.contents.find(c => 
    exhibition.languageOptions?.find(l => l.isDefault && l.code === c.languageCode)
  ) || exhibition.contents[0];
  
  const approveForm = useForm<z.infer<typeof approveExhibitionSchema>>({
    resolver: zodResolver(approveExhibitionSchema),
    defaultValues: {
      name: defaultContent?.name || "",
    },
  });

  const rejectForm = useForm<z.infer<typeof rejectExhibitionSchema>>({
    resolver: zodResolver(rejectExhibitionSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { execute: executeApprove, error: approveError, isPending: isApprovePending } = useServerAction(approveExhibitionAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exhibition approved successfully",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve exhibition",
        variant: "destructive",
      });
    }
  });

  const { execute: executeReject, error: rejectError, isPending: isRejectPending } = useServerAction(rejectExhibitionAction, {
    onSuccess: () => {
      toast({
        title: "Exhibition Rejected",
        description: "Exhibition has been rejected",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject exhibition",
        variant: "destructive",
      });
    }
  });

  const onApprove: SubmitHandler<z.infer<typeof approveExhibitionSchema>> = () => {
    executeApprove({
      exhibitionId: exhibition._id,
    });
  };

  const onReject: SubmitHandler<z.infer<typeof rejectExhibitionSchema>> = (values) => {
    executeReject({
      exhibitionId: exhibition._id,
      reason: values.reason,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-1 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-end mb-2">
          <Link
            href={`/exhibitions/preview/${exhibition._id}`}
            target="_blank"
            className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span>Open Preview</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <h4 className="font-medium mb-2">{defaultContent?.name || "Untitled Exhibition"}</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {defaultContent?.description || "No description available"}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{exhibition.author.name}</span>
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
              <FormField
                control={approveForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exhibition Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />
              {approveError && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error approving exhibition</AlertTitle>
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
                    <FormLabel>Rejection Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Please provide a reason for rejection..."
                        className="min-h-[120px] resize-none w-full"
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
                  <AlertTitle>Error rejecting exhibition</AlertTitle>
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