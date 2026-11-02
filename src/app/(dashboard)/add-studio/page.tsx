import { Sparkles } from "lucide-react";
import StudioForm from "@/component/studio-form/StudioForm";

/**
 * Header + create form. StudioForm submits to POST /api/studios — the page
 * itself must not call the backend: a POST fired during render hung this route
 * whenever the Render service was asleep and inserted empty records.
 */
const AddStudioPage = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-sky-500/10 dark:text-sky-400">
                    <Sparkles className="size-5" />
                </span>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add New Studio
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Publish your space to the StudioSpace marketplace.
                    </p>
                </div>
            </div>

            <StudioForm mode="add" />
        </div>
    );
};

export default AddStudioPage;
