import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    actions?: ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between space-y-2 mb-6">
            <h2 className="text-3xl font-headline font-bold tracking-tight text-white">{title}</h2>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
    );
}
