/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface FieldErrorProps {
  errors?: any[];
}

export default function FieldError({ errors }: FieldErrorProps) {
  if (!errors || errors.length === 0) return null;

  const msgs = errors
    .map((e) => {
      if (!e) return undefined;
      if (typeof e === "string") return e;
      if (typeof e === "object") {
        if ("message" in e && typeof (e as any).message === "string")
          return (e as any).message;
        if ("message" in e && Array.isArray((e as any).message))
          return (e as any).message.join(", ");
      }
      try {
        return String(e);
      } catch {
        return undefined;
      }
    })
    .filter(Boolean) as string[];
  if (msgs.length === 0) return null;
  return (
    <div className="mt-1 text-sm text-red-500" role="alert">
      {msgs[0]}
    </div>
  );
}
