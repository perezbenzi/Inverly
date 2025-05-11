import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestAccessModal = ({
  isOpen,
  onClose,
}: RequestAccessModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isProduction = process.env.NODE_ENV === "production";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const mailtoLink = `mailto:perezbenzif@gmail.com?subject=Access Request - ${encodeURIComponent(
        name
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      )}`;

      if (isProduction) {
        window.location.href = mailtoLink;
        toast.success("Request sent! Opening email client...");
      } else {
        console.log("Access request details:", { name, email, message });
        toast.success("Access request processed in development mode");
      }

      setName("");
      setEmail("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending request:", error);
      setError("Failed to send request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isProduction) {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Let us know why you're interested in accessing this application"
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-center text-sm text-destructive space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Development Mode Access</p>
            <p className="text-sm text-muted-foreground">
              You're running the application in development mode. Access
              requests are simulated and won't actually be sent. In production,
              users will be able to send access requests via email to:{" "}
              <span className="font-mono text-xs">perezbenzif@gmail.com</span>
            </p>
          </div>

          <DialogFooter className="flex flex-col gap-y-2 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={onClose} >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={() => {
                console.log("Development mode: Simulating access request");
                toast.success("Development: Access granted automatically");
                onClose();
              }}
            >
              Grant Access (Dev Mode)
            </Button>
          </DialogFooter>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Application Access</DialogTitle>
          <DialogDescription>
            Fill out the form below to request access to the finance tracking
            application.
          </DialogDescription>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
