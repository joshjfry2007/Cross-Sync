import React from "react";
import Sidebar from "@/component/Sidebar";
import Header from "@/component/Header";
import PeopleCard from "@/component/peopleCard";

const page = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                <section className="flex-1 p-6 overflow-hidden">
                    <PeopleCard />
                </section>
            </div>
        </main>
    );
};

export default page;

