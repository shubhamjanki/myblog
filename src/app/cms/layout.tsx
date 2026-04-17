"use client";

import CmsLayoutComponent from "@/components/cms/CmsLayout";

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CmsLayoutComponent>{children}</CmsLayoutComponent>;
}
