import { getCurrentUser } from "@/lib/session";
import {  redirect } from "next/navigation";

export default async function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();
    if (!user || !user.role.includes("admin")) {
        return redirect('/auth');
    }
    // if (!user || !user.role.includes("admin")) {
    //     return redirect('/auth');
    // }
    return (
        <>
            {children}
        </>
    )
}