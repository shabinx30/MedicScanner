import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

const Footer = () => {
    return (
        <footer className="mb-[1em] text-[0.65rem] md:text-xs text-center text-[#9b9b9b]">
            <p className="text-center">
                All the data we use for this validation is collected from <br />
            </p>
            <Link
                className="hover:underline hover:text-white text-center flex justify-center items-center gap-1"
                href="https://cdsco.gov.in/opencms/opencms/en/Notifications/nsq-drugs/"
            >
                Center Drug Standard Organization
                <HiExternalLink size={16} />
            </Link>
        </footer>
    );
};

export default Footer;
