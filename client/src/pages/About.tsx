import React from "react";


const About = () => {


    const developers = [
        {
            link: "/group_pics/bugarin.png",
            name: "BUGARIN, JAY MERIE ANN",
        },
        {
            link: "/group_pics/galola.jpg",
            name: "GALOLA, JEFTE",
        },
        {
            link: "/group_pics/liongson.jpg",
            name: "LIONGSON, BEATRIX",
        },
        {
            link: "/group_pics/niamit.png",
            name: "NIAMIT, RASVI RUPERT",
        },
        {
            link: "/group_pics/pineda.png",
            name: "PINEDA, DANICA LYKA",
        },
        {
            link: "/group_pics/pontillas.jpg",
            name: "PONTILLAS, JOSH LENUEL",
        },
        {
            link: "/group_pics/senar.png",
            name: "SEÑAR, REJAY MAR",
        },
        {
            link: "/group_pics/villavicencio.jpg",
            name: "VILLAVICENCIO, KEVIN KYLE",
        },
    ]


    return (
        <div className="h-auto min-h-screen w-full  ">


            <div>
                <div className="flex flex-col  justify-center items-center block ">
                    <p className="flex justify-center items-center font-bold text-3xl text-neutral-800 uppercase">
                        Kaizen Quiz Bank
                    </p>
                    <p className="flex justify-center items-center  text-lg text-neutral-600  mt-4 mb-8">
                        CPE 025 - Software Design
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 place-content-center">


                    {
                        developers.map(developer =>
                            <div className="flex flex-col items-center">
                                <img
                                    className="rounded-full border border-4 border-zinc-50 aspect-square max-h-[140px] max-w-[140px]"
                                    src={developer.link}
                                    alt=""
                                />
                                <p className="text-sm text-center py-4 capitalize">
                                    {developer.name}
                                </p>
                            </div>
                        )
                    }


                </div>
            </div>
            <div className="flex flex-col items-center mt-8  border-b border-neutral-light-700 pb-4">
                <p className="font-bold">
                    DEVELOPERS
                </p>
            </div>

            <div className="flex flex-col items-center mt-10 ">
                <div className="max-h-[140px] max-w-[140px] h-[140px] w-[140px] text-sm">
                    <img
                        className="rounded-full border border-4 border-zinc-50 aspect-square"
                        src="/group_pics/prof.png"
                        alt=""
                    />
                    <p className="text-sm text-center py-4 capitalize">
                        ENGR. JONATHAN TAYLAR
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center mt-20  border-b border-neutral-light-700 pb-4">
                <p className="font-bold">
                    INSTRUCTOR
                </p>
            </div>


        </div>
    );
}

export default About