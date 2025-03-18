"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationForm } from "./notification-form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Bell, Calendar, CheckCircle, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Exhibition Opening",
      message: "Modern Art Exhibition opens tomorrow at 10 AM",
      type: "event",
      status: "scheduled",
      recipients: "all_users",
      scheduledFor: "2024-03-20T10:00:00",
    },
    {
      id: 2,
      title: "System Maintenance",
      message: "Platform will be under maintenance for 2 hours",
      type: "system",
      status: "sent",
      recipients: "all_users",
      sentAt: "2024-03-15T14:30:00",
    },
    {
      id: 3,
      title: "New Artist Feature",
      message: "Check out our featured artist of the month",
      type: "promotion",
      status: "draft",
      recipients: "subscribers",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);


  const handleDeleteNotification = (id: number) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(notifications.filter((notification) => notification.id !== id));
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditForm = (notification: any) => {
    setEditingNotification(notification);
    setIsFormOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-50 text-green-700 border-green-200";
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "draft":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-4 h-4" />;
      case "system":
        return <Bell className="w-4 h-4" />;
      case "promotion":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-2">Manage and send notifications to your users</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="w-4 h-4" />
          New Notification
        </Button>
      </div>

      <NotificationForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingNotification(null);
        }}
        onSubmit={() => {
            console.log("submit");
        }}
        initialData={editingNotification}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        {["all", "scheduled", "sent", "draft"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-4">
              {notifications
                .filter((n) => tab === "all" || n.status === tab)
                .map((notification) => (
                  <Card key={notification.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg leading-none">
                              {notification.title}
                            </h3>
                            <Badge 
                              className={cn(
                                "rounded-full px-3 py-1 font-medium border",
                                getStatusColor(notification.status)
                              )}
                            >
                              {notification.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              {getTypeIcon(notification.type)}
                              <span className="capitalize">{notification.type}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Recipients:</span>
                              <span className="capitalize">{notification.recipients.replace('_', ' ')}</span>
                            </div>
                            {notification.scheduledFor && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(notification.scheduledFor).toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(notification)}
                            className="flex items-center gap-2 hover:bg-gray-50"
                          >
                            <FileEdit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

