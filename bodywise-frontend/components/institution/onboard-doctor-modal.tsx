"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function OnboardDoctorModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Onboard new practitioner
      </Button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3a2218]/40 px-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-[0_40px_120px_-60px_rgba(58,34,24,0.65)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-[#3a2218]">
                      Onboard practitioner
                    </h2>
                    <p className="text-sm text-[#80685b]">
                      Share practitioner details to begin BodyWise verification.
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a] transition hover:bg-[#e6c8ab]"
                  >
                    Close
                  </button>
                </div>
                <form className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-name" requiredIndicator>
                        Full name
                      </Label>
                      <Input
                        id="practitioner-name"
                        placeholder="Dr. Nia Kabede"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-email" requiredIndicator>
                        Email
                      </Label>
                      <Input
                        id="practitioner-email"
                        type="email"
                        placeholder="nia@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-specialty" requiredIndicator>
                      Specialty
                    </Label>
                    <Input
                      id="practitioner-specialty"
                      placeholder="Clinical Psychologist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-docs">
                      Verification documents
                    </Label>
                    <input
                      id="practitioner-docs"
                      type="file"
                      className="w-full rounded-2xl border border-dashed border-[#d6b28f] bg-[#fdf9f6] px-4 py-3 text-sm text-[#6a4a3a] focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full px-5 py-3 text-sm font-semibold text-[#6a4a3a] transition hover:text-[#3a2218]"
                    >
                      Cancel
                    </button>
                    <Button type="button" variant="secondary">
                      Submit for review
                    </Button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}


