"use client"

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Images from "@/components/home/Images";
import Tools from "@/components/home/Tools";
import { ViewTransition } from "react";

const Home = () => {
    return (
        <ViewTransition enter="zoom-in" exit="zoom-out">
            <main className="flex flex-col gap-8 pt-[3em] justify-between items-center font-sans h-screen">
                <Header />
                <Tools />
                <Footer />
                <Images />
            </main>
        </ViewTransition>
    );
};

export default Home;
