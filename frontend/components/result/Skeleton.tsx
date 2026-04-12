const Skeleton = () => {
    return (
        <>
            <div className="mt-10 w-full flex gap-2 justify-center md:justify-between">
                <div className="p-4 w-[5.5em] md:w-[20em] rounded-xl bg-[#8dc3c6] dark:bg-[#0d3234] animate-pulse"></div>
                <div className="hidden md:block p-4 w-[10em] rounded-xl bg-[#8dc3c6] dark:bg-[#0d3234] animate-pulse"></div>
            </div>
            <section className="flex flex-col lg:flex-row w-full gap-4">
                <div className="flex flex-col min-h-full flex-1/3 bg-[#24868b] dark:bg-[#196165] rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <p className="p-4 w-3/4 md:w-1/2 bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl"></p>

                        <p className="hidden lg:block p-2 w-1/4 bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl"></p>
                    </div>
                    <h3 className="mt-4 p-8 w-3/4 bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl"></h3>
                    <div className="p-16 flex-1 flex flex-col mt-6 rounded-xl bg-[#dafdff] dark:bg-[#0d3234] animate-pulse"></div>
                    <div className="flex justify-center">
                        <p className="block lg:hidden mt-4 p-2 w-1/2 bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl"></p>
                    </div>
                </div>
                <div className="flex flex-col justify-center flex-1 min-h-full bg-[#24868b] dark:bg-[#196165] rounded-2xl p-6">
                    <h5 className="p-4 w-full bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl mb-8"></h5>
                    <h6 className="mt-4 p-4 w-2/3 bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl"></h6>
                    <h6 className="mt-4 p-4 w-2/3 bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl"></h6>
                    <h6 className="mt-4 p-4 w-2/3 bg-[#dafdff] dark:bg-[#0d3234] animate-pulse rounded-2xl"></h6>
                </div>
            </section>
            <div className="block md:hidden p-4 w-[10em] rounded-xl bg-[#8dc3c6] dark:bg-[#0d3234] animate-pulse"></div>
        </>
    );
};

export default Skeleton;
