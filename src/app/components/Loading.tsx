export function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-lg">Loading...</p>
            </div>
        </div>
    );
} 