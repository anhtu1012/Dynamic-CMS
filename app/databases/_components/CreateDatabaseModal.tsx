"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FieldError from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateDatabaseRequest,
  CreateDatabaseRequestItem,
} from "@/lib/schemas/databases/databases.request";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useCreateDatabase } from "../_hooks/useDatabases";

interface CreateDatabaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commonIcons = ["💾", "🗄️", "🛒", "📱", "🌐", "⚡"];

export default function CreateDatabaseModal({
  open,
  onOpenChange,
}: CreateDatabaseModalProps) {
  const createMutation = useCreateDatabase();
  const [selectedIcon, setSelectedIcon] = useState("💾");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      icon: "💾",
      settings: {
        defaultLanguage: "en",
        timezone: "Asia/Ho_Chi_Minh",
        dateFormat: "DD/MM/YYYY",
      },
      tags: [],
    } as CreateDatabaseRequestItem,
    validators: {
      onSubmit: CreateDatabaseRequest,
    },
    onSubmit: async ({ value }) => {
      const dataToSubmit = {
        ...value,
        icon: selectedIcon,
        tags: tags,
      };
      await createMutation.mutateAsync(dataToSubmit);
      onOpenChange(false);
      // Reset form
      form.reset();
      setSelectedIcon("💾");
      setTags([]);
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Create New Database</DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            Fill in the details to create a new database for your project.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <Tabs
            defaultValue="basic"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2 dark:bg-slate-800">
              <TabsTrigger value="basic" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300">Basic Info</TabsTrigger>
              <TabsTrigger value="settings" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300">Settings & Tags</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-1">
              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* Icon Selection */}
                <div className="space-y-2">
                  <Label className="dark:text-slate-200">Database Icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {commonIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`text-3xl p-2 rounded-lg border-2 transition-all ${
                          selectedIcon === icon
                            ? "border-primary bg-primary/10 dark:border-white dark:bg-white/20"
                            : "border-gray-200 hover:border-gray-300 dark:border-slate-600 dark:hover:border-slate-500"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      value.length < 1 ? "Name is required" : undefined,
                  }}
                >
                  {(field) => {
                    const isInvalid = field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Database Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="my-ecommerce-db"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                        <p className="text-xs text-gray-500">
                          Use lowercase letters, numbers, and hyphens only
                        </p>
                      </div>
                    );
                  }}
                </form.Field>

                {/* Display Name */}
                <form.Field name="displayName">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="My E-commerce Database"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <p className="text-xs text-gray-500">
                        A friendly name for display purposes
                      </p>
                    </div>
                  )}
                </form.Field>

                {/* Description */}
                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Main database for e-commerce platform"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={3}
                      />
                    </div>
                  )}
                </form.Field>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold dark:text-white">Database Settings</h3>

                  <form.Field name="settings.defaultLanguage">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="defaultLanguage">
                          Default Language
                        </Label>
                        <Input
                          id="defaultLanguage"
                          placeholder="en"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="settings.timezone">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                          id="timezone"
                          placeholder="Asia/Ho_Chi_Minh"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="settings.dateFormat">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Input
                          id="dateFormat"
                          placeholder="DD/MM/YYYY"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="dark:text-slate-200">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag (e.g., production)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                      className="dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                    >
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm dark:bg-slate-700 dark:text-slate-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="dark:bg-white dark:text-black dark:hover:bg-gray-200">
              {createMutation.isPending ? "Creating..." : "Create Database"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
