"use client";
import { useState } from "react";

export function ProductTabs({ description }: { description: string }) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="mt-12">
      <div className="border-b border-neutral-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-sky-600 text-sky-600"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {activeTab === "description" && (
          <div className="prose max-w-none text-neutral-700">{description}</div>
        )}
        {activeTab === "specs" && (
          <div className="text-neutral-600">Specifications coming soon.</div>
        )}
        {activeTab === "reviews" && (
          <div className="text-neutral-600">No reviews yet.</div>
        )}
      </div>
    </div>
  );
}

