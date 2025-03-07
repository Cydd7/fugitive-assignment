"use client";
export function Error({ error }: { error: string }) {
    return (
        <div className="bg-red-200 p-2 rounded"> {/* Added div with background color */}
            <p className="text-red-600">{error}</p> {/* Changed text color for better visibility */}
        </div>
    );
}