import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    return (
        <>
            <PageHeader 
                title="Kelola About"
                actions={
                    <Button className="bg-white/30 text-white hover:bg-white/40">Tambah About</Button>
                }
            />
            {/* The rest of the content for managing the About section will go here. */}
        </>
    );
}
