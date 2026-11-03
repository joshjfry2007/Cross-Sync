import React from "react";
import Sidebar from "@/component/Sidebar";
import Header from "@/component/Header";
import PeopleCard from "@/component/peopleCard";

const page = () => {
    return (
        <main className="flex flex-col md:flex-row min-h-screen md:h-screen overflow-x-hidden">
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 md:overflow-hidden">
                <Header />

                <section className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto md:overflow-hidden">
                    <PeopleCard />
                </section>
            </div>
        </main>
    );
};

export default page;
