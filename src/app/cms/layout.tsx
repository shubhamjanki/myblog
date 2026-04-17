import CmsLayoutComponent from "@/components/cms/CmsLayout";

export const dynamic = "force-dynamic";

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CmsLayoutComponent>{children}</CmsLayoutComponent>;
}
