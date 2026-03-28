import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Images from "@/components/home/Images";
import Tools from "@/components/home/Tools";

const Home = () => {
    return (
        <main className="flex flex-col gap-8 pt-[3em] justify-between items-center font-sans h-screen">
            <Header />
            <Tools />
            <Footer />
            <Images />
        </main>
    );
};

export default Home;
