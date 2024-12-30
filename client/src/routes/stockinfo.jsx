import { Popover } from "../../components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DatePickerForm } from "./datepickerform";
import { useState } from "react";

const StockInfo = () => {
    return (
        <div className="p-6 space-y-6">
            <SubmissionForm />
            <DatePickerForm />
        </div>
    );
}

const SubmissionForm = () => {

    const [date, setDate] = useState(Date())

    const handleSubmitLink = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

    };
    return (
        <div>
            {/* <form onSubmit={handleSubmitLink} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Submit </h2>
                <Button type="submit" variant="secondary" size="default">Submit</Button>
            </form> */}


        </div>
    )
}

export default StockInfo;
