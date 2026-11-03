import { redirect } from "next/navigation";

const OldEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    redirect(`/studios/edit/${id}`);
};

export default OldEditPage;
