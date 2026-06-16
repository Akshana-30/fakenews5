export default function AdBanner() {
    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700 py-3 px-4 flex flex-col items-center gap-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Advertisement
            </p>
            <div className="w-full max-w-4xl h-20 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                    Your ad could be here
                </span>
            </div>
        </div>
    );
}
