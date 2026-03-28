import Image from "next/image";

const Images = () => {
    return (
        <>
            <Image
                className="hidden md:block absolute top-1/4 left-1/9 w-[7em]"
                src="/star.avif"
                alt="star"
                width={100}
                height={100}
            />
            <Image
                className="hidden md:block absolute bottom-1/4 right-1/9"
                src="/dimond.avif"
                alt="star"
                width={100}
                height={100}
            />
        </>
    );
};

export default Images;
