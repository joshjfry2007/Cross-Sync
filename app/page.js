import React from "react";
import Sidebar from "@/component/Sidebar";
import Header from "@/component/Header";
import PeopleCard from "@/component/peopleCard";

const page = () => {
    return (
        <main className="flex flex-col md:flex-row min-h-screen md:h-screen">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-x-hidden md:overflow-hidden">
                <Header />

                <section className="flex-1 p-3 md:p-6 overflow-y-auto">
                    <PeopleCard />
                </section>
            </div>
        </main>
    );
};

export default page;
