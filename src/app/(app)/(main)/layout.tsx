import { BottomNav } from "@/components/shared/BottomNav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-bg-main pb-20">
            <div className="flex-1">
                {children}
            </div>
            <BottomNav />
        </div>
    );
}
